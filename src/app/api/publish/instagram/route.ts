import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoUrl, caption } = body;

    if (!videoUrl) {
      return NextResponse.json(
        { error: "URL video publik (videoUrl) wajib disertakan." },
        { status: 400 }
      );
    }

    // 1. Ambil token Instagram dari Supabase
    const { data: account, error: accError } = await supabaseServer
      .from("social_accounts")
      .select("external_account_id, access_token")
      .eq("platform", "instagram")
      .eq("workspace_id", "ws-1")
      .eq("status", "active")
      .maybeSingle();

    if (accError || !account) {
      return NextResponse.json(
        {
          error:
            "Akun Instagram belum terhubung di Supabase. Silakan login ke Instagram terlebih dahulu.",
        },
        { status: 400 }
      );
    }

    const igUserId = account.external_account_id;
    const accessToken = account.access_token;

    // 2. Step 1 Meta: Buat Container Media Reels
    const createContainerRes = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "REELS",
          video_url: videoUrl,
          caption: caption || "",
          share_to_feed: true,
          access_token: accessToken,
        }),
      }
    );

    const containerData = await createContainerRes.json();
    if (containerData.error) {
      return NextResponse.json(
        { error: `Meta API Error: ${containerData.error.message}` },
        { status: 400 }
      );
    }

    const creationId = containerData.id;

    // 3. Step 2 Meta: Polling status sampai FINISHED (maks 10x coba dengan interval 3 detik)
    let statusCode = "IN_PROGRESS";
    let attempts = 0;

    while (statusCode !== "FINISHED" && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const statusRes = await fetch(
        `https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusRes.json();
      statusCode = statusData.status_code;

      if (statusCode === "ERROR") {
        return NextResponse.json(
          { error: "Meta gagal memproses format video tersebut." },
          { status: 400 }
        );
      }
      attempts++;
    }

    if (statusCode !== "FINISHED") {
      return NextResponse.json(
        {
          warning: "Video masih diproses di latar belakang oleh Instagram.",
          creationId,
        },
        { status: 202 }
      );
    }

    // 4. Step 3 Meta: Publikasikan Container Media
    const publishRes = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publishRes.json();
    if (publishData.error) {
      return NextResponse.json(
        { error: `Gagal Publish: ${publishData.error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      mediaId: publishData.id,
      postUrl: `https://www.instagram.com/reel/${publishData.id}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
