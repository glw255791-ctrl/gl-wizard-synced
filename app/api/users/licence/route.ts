import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client"; // anon client
import { supabaseAdmin } from "@/lib/supabase/supabase-admin"; // service role

export async function PATCH(req: NextRequest) {
  try {
    // 1️⃣ Auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // 2️⃣ Validate user session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (!user || userError) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 3️⃣ Check admin role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4️⃣ Perform update
    const { id, date } = await req.json();

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ licence_valid_until: date })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
