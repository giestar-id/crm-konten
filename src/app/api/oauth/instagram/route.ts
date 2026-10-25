import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const instagramAppId =
    process.env.INSTAGRAM_APP_ID ||
    (process.env.META_APP_ID && process.env.META_APP_ID !== "29466741993012816"
      ? process.env.META_APP_ID
      : "1435512674602696");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const proto = req.headers.get("x-forwarded-proto") || (isLocal ? "http" : "https");
  const baseUrl = host
    ? `${proto}://${host}`
    : (process.env.NEXT_PUBLIC_BASE_URL || "https://crm-konten.giestar.web.id");
  const redirectUri = `${baseUrl}/api/oauth/instagram/callback`;

  if (!instagramAppId || instagramAppId === "your_meta_app_id_here") {
    return NextResponse.json(
      {
        status: "need_configuration",
        message: "INSTAGRAM_APP_ID belum diisi di file .env.local",
        redirectUri,
      },
      { status: 400 }
    );
  }

  // Scopes resmi Instagram Business Login
  const scopes = [
    "instagram_business_basic",
    "instagram_business_content_publish",
    "instagram_business_manage_messages",
    "instagram_business_manage_comments",
    "instagram_business_manage_insights",
  ].join(",");

  const authUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=${instagramAppId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scopes)}`;

  return NextResponse.redirect(authUrl);
}
