import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "app/api/_supabase-admin";
import { requireAdmin } from "@/lib/auth/require-user";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin is not configured" },
      { status: 500 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, licence_valid_until, role");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    (data ?? []).map(({ full_name, email, licence_valid_until, id, role }) => ({
        name: full_name,
        email,
        licencevaliduntil: licence_valid_until,
        id,
        role,
      }))
  );
}
