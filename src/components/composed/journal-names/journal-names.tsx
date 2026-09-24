"use client";

import { useMemo, useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { theme } from "@/constants/theme";
import { secondaryActionButtonStyles } from "../../ui-kit/button-styles";
import { toResultPath } from "../../data-overview/table/functions";
import { suggestNarratives } from "@/lib/ai/suggest-narrative";

type Group = { path: string; accounts: string[]; count: number };

function unnamedGroups(rows: Record<string, unknown>[]): Group[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const path = toResultPath(row.result);
    const accounts = path.split("/").map((part) => part.trim()).filter(Boolean);
    if (accounts.length < 2) continue;
    counts.set(path, (counts.get(path) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([path, count]) => ({
      path,
      accounts: path.split("/").map((part) => part.trim()).filter(Boolean),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export function JournalNames({
  rows,
  busy,
  onApply,
}: {
  rows: Record<string, unknown>[];
  busy?: boolean;
  onApply: (inputs: string[], narrative: string) => Promise<void> | void;
}) {
  const groups = useMemo(() => unnamedGroups(rows), [rows]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  if (groups.length === 0) return null;

  return (
    <Stack
      gap={1}
      sx={{
        padding: "0.9rem 1rem",
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.softBlue}`,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
        <Typography sx={{ fontWeight: 700, color: theme.colors.deepTeal }}>
          Name unnamed journals
        </Typography>
        <Button
          disabled={loading || busy}
          startIcon={<AutoAwesomeIcon />}
          sx={secondaryActionButtonStyles}
          onClick={async () => {
            setLoading(true);
            setStatus("Suggesting names…");
            try {
              const results = await suggestNarratives(
                groups.map((group) => group.accounts)
              );
              const next: Record<string, string> = {};
              groups.forEach((group, index) => {
                const narrative = results[index]?.result?.trim();
                if (narrative) next[group.path] = narrative;
              });
              setDrafts(next);
              setStatus("Edit a name, then accept. This re-runs the analysis.");
            } catch (err) {
              setStatus(err instanceof Error ? err.message : "Suggestion failed.");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Suggesting…" : "Suggest names"}
        </Button>
      </Stack>
      <Typography sx={{ fontSize: "0.84rem", color: theme.colors.slateGray }}>
        Groups still labeled only by their accounts. A suggestion is a short description of the journal.
      </Typography>
      {groups.map((group) => (
        <Stack key={group.path} gap={0.4}>
          <Typography sx={{ fontSize: "0.8rem", color: theme.colors.medium }}>
            {group.count.toLocaleString("en-US")} rows · {group.path}
          </Typography>
          {drafts[group.path] != null ? (
            <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
              <TextField
                size="small"
                fullWidth
                value={drafts[group.path]}
                onChange={(event) =>
                  setDrafts((prev) => ({ ...prev, [group.path]: event.target.value }))
                }
              />
              <Button
                disabled={busy || !drafts[group.path]?.trim()}
                sx={{ ...secondaryActionButtonStyles, flexShrink: 0 }}
                onClick={() => void onApply(group.accounts, drafts[group.path].trim())}
              >
                Accept
              </Button>
            </Stack>
          ) : null}
        </Stack>
      ))}
      {status ? (
        <Typography sx={{ fontSize: "0.8rem", color: theme.colors.slateGray }}>
          {status}
        </Typography>
      ) : null}
    </Stack>
  );
}
