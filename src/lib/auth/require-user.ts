import { NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/supabase-client";
import { supabaseAdmin } from "app/api/_supabase-admin";

type AuthFailure = { ok: false; response: NextResponse };
type AuthSuccess = { ok: true; user: User };

export async function requireUser(
  req: NextRequest
): Promise<AuthFailure | AuthSuccess> {
  const header = req.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!supabase || !supabaseAdmin) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      ),
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (!user || error) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid session" }, { status: 401 }),
    };
  }

  return { ok: true, user };
}

export async function requireAdmin(
  req: NextRequest
): Promise<AuthFailure | AuthSuccess> {
  const auth = await requireUser(req);
  if (!auth.ok) return auth;
  if (!supabaseAdmin) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      ),
    };
  }

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .single();

  if (error || profile?.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return auth;
}
