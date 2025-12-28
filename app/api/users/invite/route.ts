import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/api/supabase-client"; // anon client
import { supabaseAdmin } from "@/api/supabase-admin"; // service role

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Get token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // 2️⃣ Validate session (WHO is calling)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (!user || userError) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 3️⃣ Check role (ARE they admin)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4️⃣ Admin action
    const { email } = await req.json();

    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
