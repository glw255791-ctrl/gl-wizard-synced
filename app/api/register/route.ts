import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "app/api/_supabase-admin";
import { requireUser } from "@/lib/auth/require-user";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin is not configured" },
        { status: 500 }
      );
    }

    const { password, name } = await req.json();

    if (!password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userId = auth.user.id;

    const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password }
    );
    if (pwError) throw pwError;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ full_name: name })
      .eq("id", userId);

    if (profileError) throw profileError;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
