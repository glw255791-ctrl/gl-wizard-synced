/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "app/api/_supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { userId, password, name } = await req.json();

    if (!userId || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. set password
    const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password }
    );
    if (pwError) throw pwError;

    // 2. update profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ full_name: name })
      .eq("id", userId);

    if (profileError) throw profileError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Registration failed" },
      { status: 500 }
    );
  }
}
