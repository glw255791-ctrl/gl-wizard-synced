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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_BASE_URL is not set, so the invite link cannot be built." },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email,
      options: { redirectTo: `${baseUrl}/register` },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const link = data.properties?.action_link;
    if (!link) {
      return NextResponse.json(
        { error: "Supabase did not return an invite link." },
        { status: 500 }
      );
    }

    return NextResponse.json({ link });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
