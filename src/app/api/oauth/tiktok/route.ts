import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${baseUrl}/api/oauth/tiktok/callback`;

  if (!clientKey || clientKey === "your_tiktok_client_key_here") {
    return NextResponse.json(
      {
        status: "need_configuration",
        message: "TIKTOK_CLIENT_KEY belum diisi di file .env.local",
        redirectUri,
      },
      { status: 400 }
    );
  }

  const scopes = ["user.info.basic", "video.upload", "video.publish"].join(",");

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${encodeURIComponent(
    scopes
  )}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=sph_tiktok_oauth`;

  return NextResponse.redirect(authUrl);
}
