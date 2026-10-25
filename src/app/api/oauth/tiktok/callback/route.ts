import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`;

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/?oauth_error=${encodeURIComponent(error || "Kode otorisasi TikTok tidak ditemukan")}`, baseUrl)
    );
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${baseUrl}/api/oauth/tiktok/callback`;

  try {
    // 1. Tukar auth code dengan token TikTok
    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: clientKey!,
        client_secret: clientSecret!,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error || !tokenData.data?.access_token) {
      return NextResponse.redirect(
        new URL(`/?oauth_error=${encodeURIComponent(tokenData.message || "Gagal menukar token TikTok")}`, baseUrl)
      );
    }

    const { access_token, refresh_token, open_id } = tokenData.data;

    // 2. Ambil profil user TikTok
    const userRes = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const userData = await userRes.json();
    const user = userData.data?.user;

    const displayName = user?.display_name || "TikTok Creator";
    const avatarUrl = user?.avatar_url || "";

    // 3. Simpan ke Supabase social_accounts
    await supabaseServer.from("social_accounts").upsert(
      {
        workspace_id: "ws-1",
        platform: "tiktok",
        external_account_id: open_id,
        display_name: displayName,
        handle: `@${displayName.replace(/\s+/g, "").toLowerCase()}`,
        avatar_url: avatarUrl,
        access_token: refresh_token || access_token,
        scopes: ["user.info.basic", "video.upload", "video.publish"],
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "workspace_id,platform,external_account_id" }
    );

    return NextResponse.redirect(
      new URL(`/?connected=tiktok&handle=${encodeURIComponent(displayName)}`, baseUrl)
    );
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(`/?oauth_error=${encodeURIComponent(err.message || "Gagal menghubungkan TikTok")}`, baseUrl)
    );
  }
}
