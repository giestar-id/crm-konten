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
      new URL(`/?oauth_error=${encodeURIComponent(error || "Kode otorisasi Google tidak ditemukan")}`, baseUrl)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/oauth/youtube/callback`;

  try {
    // 1. Tukar auth code dengan token Google
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      return NextResponse.redirect(
        new URL(`/?oauth_error=${encodeURIComponent(tokenData.error_description || tokenData.error)}`, baseUrl)
      );
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    // 2. Ambil info channel YouTube
    const channelRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const channelData = await channelRes.json();
    const channel = channelData.items?.[0];

    const channelId = channel?.id || "yt-unknown-id";
    const channelTitle = channel?.snippet?.title || "My YouTube Channel";
    const avatarUrl = channel?.snippet?.thumbnails?.default?.url || "";

    // 3. Simpan ke Supabase social_accounts
    await supabaseServer.from("social_accounts").upsert(
      {
        workspace_id: "ws-1",
        platform: "youtube",
        external_account_id: channelId,
        display_name: channelTitle,
        handle: channel?.snippet?.customUrl || `@${channelTitle.replace(/\s+/g, "").toLowerCase()}`,
        avatar_url: avatarUrl,
        access_token: refreshToken || accessToken, // simpan refresh token
        token_expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        scopes: [
          "https://www.googleapis.com/auth/youtube.upload",
          "https://www.googleapis.com/auth/youtube.readonly",
        ],
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "workspace_id,platform,external_account_id" }
    );

    return NextResponse.redirect(
      new URL(`/?connected=youtube&handle=${encodeURIComponent(channelTitle)}`, baseUrl)
    );
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(`/?oauth_error=${encodeURIComponent(err.message || "Gagal menghubungkan YouTube")}`, baseUrl)
    );
  }
}
