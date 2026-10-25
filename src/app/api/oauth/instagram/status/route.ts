import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("social_accounts")
      .select("id, platform, external_account_id, display_name, handle, avatar_url, token_expires_at, status")
      .eq("platform", "instagram")
      .eq("workspace_id", "ws-1")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ connected: false, error: error.message });
    }

    if (!data) {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
      connected: true,
      account: data,
    });
  } catch (err: any) {
    return NextResponse.json({ connected: false, error: err.message });
  }
}
