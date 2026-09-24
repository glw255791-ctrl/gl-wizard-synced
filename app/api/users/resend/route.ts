import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/require-user";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) return auth.response;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
    if (!supabaseUrl || !anonKey || !baseUrl) {
      return NextResponse.json(
        { error: "Supabase URL, anon key, or site URL is not set." },
        { status: 500 }
      );
    }

    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, anonKey);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/reset-password`,
    });

    if (error) {
      console.error("resetPasswordForEmail:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("resend:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
