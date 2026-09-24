import { supabaseBrowser } from "@/lib/supabase/browser-client";

export async function suggestColumns(
  kind: "gl" | "coa",
  headers: string[]
): Promise<Record<string, string>> {
  if (!supabaseBrowser) {
    throw new Error("Supabase is not configured in the browser.");
  }

  const {
    data: { session },
  } = await supabaseBrowser.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Sign in again to use AI suggestions.");
  }

  const res = await fetch("/api/suggest-columns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ kind, headers }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      data && typeof data === "object" && "error" in data
        ? String((data as { error: string }).error)
        : `AI request failed (${res.status})`
    );
  }

  const mapping = (data as { mapping?: Record<string, string> }).mapping;
  if (!mapping) throw new Error("No column suggestion returned.");
  return mapping;
}
