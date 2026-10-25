import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const errorDescription = req.nextUrl.searchParams.get("error_description");

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const proto = req.headers.get("x-forwarded-proto") || (isLocal ? "http" : "https");
  const baseUrl = host && !isLocal
    ? `${proto}://${host}`
    : (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes("localhost")
        ? process.env.NEXT_PUBLIC_BASE_URL
        : "https://crm-konten.giestar.web.id");

  if (error) {
    return NextResponse.redirect(
      new URL(`/?oauth_error=${encodeURIComponent(errorDescription || error)}`, baseUrl)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/?oauth_error=Authorization+code+tidak+ditemukan", baseUrl)
    );
  }

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = `${baseUrl}/api/oauth/instagram/callback`;

  try {
    // 1. Tukar auth code dengan Short-Lived Access Token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&code=${code}`
    );
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.redirect(
        new URL(
          `/?oauth_error=${encodeURIComponent(tokenData.error.message || "Gagal menukar token Meta")}`,
          baseUrl
        )
      );
    }

    const shortLivedToken = tokenData.access_token;

    // 2. Tukar Short-Lived Token dengan Long-Lived Token (Masa berlaku ~60 hari)
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`
    );
    const longTokenData = await longTokenRes.json();
    const longLivedToken = longTokenData.access_token || shortLivedToken;
    const expiresInSeconds = longTokenData.expires_in || 5184000; // ~60 hari

    const tokenExpiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    // 3. Ambil daftar Facebook Page & cari akun Instagram Business
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,picture{url},instagram_business_account{id,username,profile_picture_url,name}&access_token=${longLivedToken}`
    );
    const pagesData = await pagesRes.json();
    const pages = pagesData.data || [];

    if (pages.length === 0) {
      return NextResponse.redirect(
        new URL(
          "/?oauth_error=Tidak+ada+Facebook+Page+ditemukan.+Buat+atau+hubungkan+Facebook+Page+terlebih+dahulu.",
          baseUrl
        )
      );
    }

    let igConnected = false;
    let igUsername = "";
    let fbPageTitle = pages[0].name;

    // Simpan semua Facebook Page & Instagram yang terhubung
    for (const page of pages) {
      // Simpan Facebook Page
      await supabaseServer.from("social_accounts").upsert(
        {
          id: `acc-fb-${page.id}`,
          workspace_id: "ws-1",
          platform: "facebook",
          external_account_id: page.id,
          display_name: page.name,
          handle: page.name,
          avatar_url: page.picture?.data?.url || "",
          account_type: "Facebook Page (Verified)",
          access_token: page.access_token || longLivedToken,
          token_expires_at: tokenExpiresAt,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "workspace_id,platform,external_account_id" }
      );

      // Simpan Instagram Business jika ada
      if (page.instagram_business_account) {
        const ig = page.instagram_business_account;
        igConnected = true;
        igUsername = ig.username;

        await supabaseServer.from("social_accounts").upsert(
          {
            id: `acc-ig-${ig.id}`,
            workspace_id: "ws-1",
            platform: "instagram",
            external_account_id: ig.id,
            display_name: ig.name || ig.username,
            handle: `@${ig.username}`,
            avatar_url: ig.profile_picture_url || "",
            account_type: "Instagram Business Creator",
            access_token: page.access_token || longLivedToken,
            token_expires_at: tokenExpiresAt,
            scopes: [
              "instagram_basic",
              "instagram_content_publish",
              "pages_show_list",
              "pages_read_engagement",
            ],
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "workspace_id,platform,external_account_id" }
        );
      }
    }

    if (igConnected) {
      return NextResponse.redirect(
        new URL(
          `/?connected=instagram&handle=${encodeURIComponent(igUsername)}`,
          baseUrl
        )
      );
    } else {
      return NextResponse.redirect(
        new URL(
          `/?connected=facebook&handle=${encodeURIComponent(fbPageTitle)}&note=Instagram+belum+ditautkan+ke+Page`,
          baseUrl
        )
      );
    }
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(`/?oauth_error=${encodeURIComponent(err.message || "Terjadi kesalahan server")}`, baseUrl)
    );
  }
}
