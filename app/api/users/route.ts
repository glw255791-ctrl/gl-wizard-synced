import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, licence_valid_until, role");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    data
      .filter((u) => u.role !== "admin")
      .map(({ full_name, email, licence_valid_until, id, role }) => ({
        name: full_name,
        email,
        licencevaliduntil: licence_valid_until,
        id,
        role,
      }))
  );
}
