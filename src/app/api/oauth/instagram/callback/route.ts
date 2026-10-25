import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  let code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const errorDescription = req.nextUrl.searchParams.get("error_description");

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const proto = req.headers.get("x-forwarded-proto") || (isLocal ? "http" : "https");
  const baseUrl = host
    ? `${proto}://${host}`
    : (process.env.NEXT_PUBLIC_BASE_URL || "https://crm-konten.giestar.web.id");

  if (error) {
    console.error("[Instagram Callback] Error returned:", { error, errorDescription });
    return NextResponse.redirect(
      new URL(`/?oauth_error=${encodeURIComponent(errorDescription || error)}`, baseUrl)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/?oauth_error=Authorization+code+tidak+ditemukan", baseUrl)
    );
  }

  // Strip #_ that Instagram automatically appends to authorization codes
  code = code.replace(/#_$/, "");

  const instagramAppId = process.env.INSTAGRAM_APP_ID || "1435512674602696";
  const instagramAppSecret = process.env.INSTAGRAM_APP_SECRET || "d49759e60552b43827f3786a86dff3c4";
  const redirectUri = `${baseUrl}/api/oauth/instagram/callback`;

  try {
    console.log("[Instagram Callback] Exchanging code for Instagram access token with redirectUri:", redirectUri);
    // 1. Tukar auth code dengan Short-Lived Access Token via api.instagram.com
    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: instagramAppId,
        client_secret: instagramAppSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log("[Instagram Callback] Short-lived token response:", tokenData);

    if (tokenData.error_message || tokenData.error) {
      console.error("[Instagram Callback] Token exchange failed:", tokenData);
      return NextResponse.redirect(
        new URL(
          `/?oauth_error=${encodeURIComponent(tokenData.error_message || tokenData.error?.message || "Gagal menukar token Instagram")}`,
          baseUrl
        )
      );
    }

    const shortLivedToken = tokenData.access_token;
    const igUserId = String(tokenData.user_id || "");

    // 2. Tukar Short-Lived Token dengan Long-Lived Token (Masa berlaku ~60 hari)
    console.log("[Instagram Callback] Exchanging short-lived token for long-lived token...");
    let longLivedToken = shortLivedToken;
    let expiresInSeconds = 5184000; // ~60 hari default

    try {
      const longTokenRes = await fetch(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${instagramAppSecret}&access_token=${shortLivedToken}`
      );
      const longTokenData = await longTokenRes.json();
      if (longTokenData.access_token) {
        longLivedToken = longTokenData.access_token;
        expiresInSeconds = longTokenData.expires_in || 5184000;
      }
    } catch (exchangeErr) {
      console.warn("[Instagram Callback] Failed to exchange long-lived token, using short-lived token:", exchangeErr);
    }

    const tokenExpiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    // 3. Ambil data profil Instagram (/me)
    console.log("[Instagram Callback] Fetching Instagram user profile...");
    let igUsername = `ig_${igUserId || Date.now().toString(36)}`;
    let igName = "Instagram Business";
    let avatarUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60";
    let resolvedId = igUserId || `ig-${Date.now().toString(36)}`;

    try {
      // Endpoint resmi Instagram Login: hanya field id, username, account_type
      const meRes = await fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${longLivedToken}`
      );
      const meData = await meRes.json();
      console.log("[Instagram Callback] Profile meData:", meData);

      if (meData && !meData.error) {
        resolvedId = String(meData.id || resolvedId);
        igUsername = meData.username || igUsername;
        igName = meData.username || igName;
      }
    } catch (profileErr) {
      console.error("[Instagram Callback] Error getting profile details:", profileErr);
    }

    // 4. Simpan ke Supabase social_accounts
    const accountRowId = `acc-ig-${resolvedId}`;
    console.log("[Instagram Callback] Saving account to Supabase:", { accountRowId, resolvedId, igUsername });
    const { error: dbError } = await supabaseServer.from("social_accounts").upsert(
      {
        id: accountRowId,
        workspace_id: "ws-1",
        platform: "instagram",
        external_account_id: String(resolvedId),
        display_name: igName,
        handle: `@${igUsername}`,
        avatar_url: avatarUrl,
        account_type: "Instagram Business",
        access_token: longLivedToken,
        token_expires_at: tokenExpiresAt,
        scopes: [
          "instagram_business_basic",
          "instagram_business_content_publish",
          "instagram_business_manage_messages",
          "instagram_business_manage_comments",
          "instagram_business_manage_insights",
        ],
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "workspace_id,platform,external_account_id" }
    );

    if (dbError) {
      console.error("[Instagram Callback] Supabase upsert error:", dbError);
      return NextResponse.redirect(
        new URL(`/?oauth_error=${encodeURIComponent(dbError.message)}`, baseUrl)
      );
    }

    console.log("[Instagram Callback] Successfully connected Instagram account:", igUsername);
    return NextResponse.redirect(
      new URL(
        `/?connected=instagram&handle=${encodeURIComponent(igUsername)}`,
        baseUrl
      )
    );
  } catch (err: any) {
    console.error("[Instagram Callback] Unexpected error:", err);
    return NextResponse.redirect(
      new URL(`/?oauth_error=${encodeURIComponent(err.message || "Terjadi kesalahan server saat otorisasi Instagram")}`, baseUrl)
    );
  }
}
