import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "app/api/_supabase-admin";
import { requireAdmin } from "@/lib/auth/require-user";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) return auth.response;
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      );
    }

    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
