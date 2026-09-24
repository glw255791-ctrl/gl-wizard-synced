import { supabaseBrowser } from "@/lib/supabase/browser-client";

export type NarrativeGroup = {
  items: string[];
  result: string;
  error?: string;
};

/**
 * Calls /api/infer-ledger with account label groups.
 * Returns one narrative string per group (same order).
 */
export async function suggestNarratives(
  groups: string[][]
): Promise<NarrativeGroup[]> {
  if (!supabaseBrowser) {
    throw new Error("Supabase is not configured in the browser.");
  }

  const {
    data: { session },
  } = await supabaseBrowser.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Sign in again to use AI suggestions.");
  }

  const payload = groups.map((items) => ({ items }));

  const res = await fetch("/api/infer-ledger", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: string }).error)
        : `AI request failed (${res.status})`;
    throw new Error(message);
  }

  if (!Array.isArray(data)) {
    throw new Error("Unexpected AI response.");
  }

  return data as NarrativeGroup[];
}

export async function suggestNarrative(accounts: string[]): Promise<string> {
  const unique = [...new Set(accounts.map((a) => a.trim()).filter(Boolean))];
  if (unique.length === 0) {
    throw new Error("Add at least one account line before suggesting a name.");
  }

  const [first] = await suggestNarratives([unique]);
  if (first && typeof (first as { error?: string }).error === "string") {
    throw new Error((first as { error: string }).error);
  }
  const narrative = first?.result?.trim() ?? "";
  if (!narrative || narrative.startsWith("Error")) {
    throw new Error(narrative || "No suggestion returned.");
  }
  return narrative;
}
