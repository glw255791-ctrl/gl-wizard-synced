import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";

const HF_API_KEY = process.env.HF_API_KEY;
const MODEL =
  process.env.HF_MODEL?.trim() || "meta-llama/Llama-3.1-8B-Instruct:fastest";
const ROUTER_URL = "https://router.huggingface.co/v1/chat/completions";

const GL_KEYS = ["account", "jen", "date", "value"] as const;
const COA_KEYS = ["mappingValue", "displayValue", "groupingValue"] as const;

function pick(headers: string[], value: unknown) {
  const text = String(value ?? "").trim();
  return headers.includes(text) ? text : "";
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if (!auth.ok) return auth.response;

    if (!HF_API_KEY) {
      return NextResponse.json(
        { error: "HF_API_KEY is not set." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const kind = body?.kind === "coa" ? "coa" : "gl";
    const headers = Array.isArray(body?.headers)
      ? body.headers.map((item: unknown) => String(item)).filter(Boolean)
      : [];

    if (headers.length < 2) {
      return NextResponse.json(
        { error: "Need at least two column names." },
        { status: 400 }
      );
    }

    const keys = kind === "coa" ? COA_KEYS : GL_KEYS;
    const role =
      kind === "coa"
        ? `Map chart-of-accounts columns.
mappingValue = account code used to match the ledger.
displayValue = category shown on movement rows (often FS subgroup).
groupingValue = broader group (often FS group).`
        : `Map general-ledger columns.
account = account code.
jen = journal entry number.
date = posting date.
value = amount.`;

    const response = await fetch(ROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,
        max_tokens: 180,
        messages: [
          {
            role: "system",
            content:
              "Reply with JSON only. Values must be copied exactly from the header list. Use an empty string if unsure.",
          },
          {
            role: "user",
            content: `${role}

Headers:
${headers.map((header: string) => `- ${header}`).join("\n")}

JSON keys: ${keys.join(", ")}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      let message = errText.slice(0, 240) || "Hugging Face request failed.";
      try {
        const parsed = JSON.parse(errText) as {
          error?: { message?: string } | string;
        };
        if (typeof parsed.error === "string") message = parsed.error;
        else if (parsed.error?.message) message = parsed.error.message;
      } catch {
        /* keep the raw snippet */
      }
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const data = await response.json();
    const content = String(data.choices?.[0]?.message?.content ?? "");
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json(
        { error: "The model did not return a column map." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(match[0]) as Record<string, unknown>;
    const mapping = Object.fromEntries(
      keys.map((key) => [key, pick(headers, parsed[key])])
    );

    return NextResponse.json({ mapping });
  } catch (error) {
    console.error("suggest-columns:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
