import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const appId = process.env.META_APP_ID;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const proto = req.headers.get("x-forwarded-proto") || (isLocal ? "http" : "https");
  const baseUrl = host
    ? `${proto}://${host}`
    : (process.env.NEXT_PUBLIC_BASE_URL || "https://crm-konten.giestar.web.id");
  const redirectUri = `${baseUrl}/api/oauth/instagram/callback`;

  if (!appId || appId === "your_meta_app_id_here") {
    // Return friendly setup instructions if Meta App ID is not yet filled in .env.local
    return NextResponse.json(
      {
        status: "need_configuration",
        message:
          "META_APP_ID belum diisi di file .env.local. Masukkan App ID dari developers.facebook.com ke .env.local terlebih dahulu.",
        redirectUri,
      },
      { status: 400 }
    );
  }

  const scopes = [
    "instagram_basic",
    "instagram_content_publish",
    "pages_show_list",
    "pages_read_engagement",
  ].join(",");

  const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes)}&response_type=code`;

  return NextResponse.redirect(authUrl);
}
