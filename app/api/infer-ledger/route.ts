/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";

const HF_API_KEY = process.env.HF_API_KEY;
/** Prefer a small routed model; `:fastest` picks an available Inference Provider. */
const MODEL =
  process.env.HF_MODEL?.trim() || "meta-llama/Llama-3.1-8B-Instruct:fastest";
const ROUTER_URL = "https://router.huggingface.co/v1/chat/completions";

const systemPrompt = `You are an expert accounting AI that infers business transactions from GL accounts. 
Respond with ONLY the concise transaction narrative as a single sentence. 
Do NOT include reasoning, explanations, thinking steps, tags, introductions, or punctuation at the end. 
Output nothing else.`;

const examples = [
  {
    accounts: ["Trade receivables", "Revenue from the sale of merchandise"],
    narrative: "Sale of goods on credit",
  },
  {
    accounts: ["Cash and cash equivalents", "Long-term financial investments"],
    narrative: "Proceeds from sale of long-term financial investments",
  },
];

function extractHfError(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as {
      error?: { message?: string } | string;
      message?: string;
    };
    const nested =
      typeof parsed.error === "string"
        ? parsed.error
        : parsed.error?.message || parsed.message;
    if (nested) return nested;
  } catch {
    /* ignore */
  }
  const trimmed = body.trim().slice(0, 240);
  if (trimmed) return trimmed;
  return `Hugging Face request failed (${status})`;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if (!auth.ok) return auth.response;

    if (!HF_API_KEY) {
      return NextResponse.json(
        {
          error:
            "HF_API_KEY is not set. Add it to .env.local to enable AI suggestions.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of groups with { items: string[] }" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      body.map(async (group: any) => {
        if (!group.items || !Array.isArray(group.items)) {
          return { items: group.items || [], result: "" };
        }

        const accountsList = group.items
          .map((item: string) => `- ${item}`)
          .join("\n");

        const userPrompt = `${examples
          .map(
            (ex) =>
              `Accounts:\n${ex.accounts
                .map((a) => `- ${a}`)
                .join("\n")}\nNarrative: ${ex.narrative}`
          )
          .join("\n\n")}

Accounts:
${accountsList}

Narrative:`;

        const response = await fetch(ROUTER_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            max_tokens: 80,
            temperature: 0.2,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("HF API error:", response.status, errText);
          const message = extractHfError(response.status, errText);
          return {
            items: group.items,
            result: "",
            error: message,
          };
        }

        const data = await response.json();
        let narrative: string =
          data.choices?.[0]?.message?.content?.trim() || "";

        if (narrative.startsWith("Narrative:")) {
          narrative = narrative.slice(10).trim();
        }
        narrative = narrative.split("\n")[0].trim();
        narrative = narrative.replace(/[.!?]$/, "");

        return { items: group.items, result: narrative };
      })
    );

    const firstError = results.find(
      (item) => typeof item.error === "string" && item.error
    );
    if (firstError?.error && results.every((item) => !item.result)) {
      return NextResponse.json(
        { error: firstError.error },
        { status: 502 }
      );
    }

    return NextResponse.json(results, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Inference error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
