import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const errorDescription = req.nextUrl.searchParams.get("error_description");
  const state = req.nextUrl.searchParams.get("state") || "";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const proto = req.headers.get("x-forwarded-proto") || (isLocal ? "http" : "https");
  const baseUrl = host
    ? `${proto}://${host}`
    : (process.env.NEXT_PUBLIC_BASE_URL || "https://crm-konten.giestar.web.id");

  if (error || !code) {
    return NextResponse.redirect(
      new URL(
        `/?oauth_error=${encodeURIComponent(
          errorDescription || error || "Kode otorisasi TikTok tidak ditemukan"
        )}`,
        baseUrl
      )
    );
  }

  // Retrieve code_verifier from cookie or fallback to state
  let codeVerifier = req.cookies.get("tiktok_code_verifier")?.value;
  if (!codeVerifier && state.startsWith("tt_")) {
    codeVerifier = state.substring(3);
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${baseUrl}/api/oauth/tiktok/callback`;

  try {
    const tokenBody = new URLSearchParams({
      client_key: clientKey!,
      client_secret: clientSecret!,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });

    if (codeVerifier) {
      tokenBody.set("code_verifier", codeVerifier);
    }

    // 1. Tukar auth code dengan token TikTok
    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenBody,
    });

    const tokenData = await tokenRes.json();
    const payload = tokenData.data || tokenData;

    if (tokenData.error || !payload?.access_token) {
      return NextResponse.redirect(
        new URL(
          `/?oauth_error=${encodeURIComponent(
            tokenData.error_description || tokenData.message || "Gagal menukar token TikTok"
          )}`,
          baseUrl
        )
      );
    }

    const { access_token, refresh_token, open_id } = payload;

    // 2. Ambil profil user TikTok
    let displayName = "TikTok Creator";
    let avatarUrl = "";

    try {
      const userRes = await fetch(
        "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      const userData = await userRes.json();
      const user = userData.data?.user || userData.user;
      if (user?.display_name) displayName = user.display_name;
      if (user?.avatar_url) avatarUrl = user.avatar_url;
    } catch {
      // Fallback display name
    }

    // 3. Simpan ke Supabase social_accounts
    const externalId = open_id || `tt_${Date.now()}`;
    await supabaseServer.from("social_accounts").upsert(
      {
        id: `acc-tt-${externalId}`,
        workspace_id: "ws-1",
        platform: "tiktok",
        external_account_id: externalId,
        display_name: displayName,
        handle: `@${displayName.replace(/\s+/g, "").toLowerCase()}`,
        avatar_url: avatarUrl,
        access_token: access_token,
        refresh_token: refresh_token || null,
        token_expires_at: new Date(Date.now() + 86400 * 1000).toISOString(),
        scopes: ["user.info.basic", "video.upload", "video.publish"],
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "workspace_id,platform,external_account_id" }
    );

    const res = NextResponse.redirect(
      new URL(`/?connected=tiktok&handle=${encodeURIComponent(displayName)}`, baseUrl)
    );
    res.cookies.delete("tiktok_code_verifier");
    return res;
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(`/?oauth_error=${encodeURIComponent(err.message || "Gagal menghubungkan TikTok")}`, baseUrl)
    );
  }
}
