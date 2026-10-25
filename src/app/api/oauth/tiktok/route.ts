import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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

  // Generate PKCE code_verifier (43-128 chars) and code_challenge (S256)
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  const scopes = ["user.info.basic", "video.upload", "video.publish"].join(",");

  const params = new URLSearchParams({
    client_key: clientKey,
    scope: scopes,
    response_type: "code",
    redirect_uri: redirectUri,
    state: `tt_${codeVerifier}`,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;

  const res = NextResponse.redirect(authUrl);
  res.cookies.set("tiktok_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: proto === "https",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return res;
}
