/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const HF_API_KEY = process.env.HF_API_KEY;
const MODEL = "Qwen/Qwen2.5-72B-Instruct"; // Excellent, clean, concise
// Alternatives if rate-limited: 'Qwen/Qwen2.5-32B-Instruct' or 'Qwen/Qwen2.5-7B-Instruct'
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

export async function POST(request: NextRequest) {
  try {
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
            max_tokens: 100,
            temperature: 0.2,
            stop: ["\n", ".", "Accounts:", "Examples:", "Narrative:"],
          }),
        });
        if (!response.ok) {
          const err = await response.text();
          console.error("HF API error:", err);
          return { items: group.items, result: "Error generating narrative" };
        }

        const data = await response.json();
        let narrative: string =
          data.choices?.[0]?.message?.content?.trim() || "";

        // Cleanup
        if (narrative.startsWith("Narrative:")) {
          narrative = narrative.slice(10).trim();
        }
        narrative = narrative.split("\n")[0].trim();
        narrative = narrative.replace(/[.!?]$/, ""); // Remove trailing punctuation

        return { items: group.items, result: narrative };
      })
    );

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
