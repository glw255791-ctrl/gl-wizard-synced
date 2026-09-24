"use client";

import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { theme } from "@/constants/theme";
import { secondaryActionButtonStyles } from "../../ui-kit/button-styles";
import { suggestColumns } from "@/lib/ai/suggest-columns";

export function SuggestColumns({
  kind,
  headers,
  onApply,
}: {
  kind: "gl" | "coa";
  headers: string[];
  onApply: (mapping: Record<string, string>) => void;
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Record<string, string> | null>(null);

  const labels: Record<string, string> =
    kind === "gl"
      ? {
          account: "Account",
          jen: "Journal",
          date: "Date",
          value: "Value",
        }
      : {
          mappingValue: "Match",
          displayValue: "Display",
          groupingValue: "Group",
        };

  return (
    <Stack gap={0.75}>
      <Button
        disabled={busy || headers.length < 2}
        startIcon={<AutoAwesomeIcon />}
        onClick={async () => {
          setBusy(true);
          setStatus("Suggesting columns…");
          setPending(null);
          try {
            const mapping = await suggestColumns(kind, headers);
            const filled = Object.values(mapping).filter(Boolean);
            if (filled.length === 0) {
              setStatus("No confident match. Pick the columns manually.");
              return;
            }
            setPending(mapping);
            setStatus("Review the suggestion, then apply.");
          } catch (err) {
            setStatus(err instanceof Error ? err.message : "Suggestion failed.");
          } finally {
            setBusy(false);
          }
        }}
        sx={{ ...secondaryActionButtonStyles, alignSelf: "flex-start" }}
      >
        {busy ? "Suggesting…" : "Suggest columns"}
      </Button>
      {pending ? (
        <Stack gap={0.4}>
          {Object.entries(labels).map(([key, label]) =>
            pending[key] ? (
              <Typography key={key} sx={{ fontSize: "0.82rem", color: theme.colors.graphite }}>
                {label}: {pending[key]}
              </Typography>
            ) : null
          )}
          <Button
            onClick={() => {
              onApply(pending);
              setStatus("Applied. Change any dropdown if it looks wrong.");
              setPending(null);
            }}
            sx={{ ...secondaryActionButtonStyles, alignSelf: "flex-start", height: 32, minHeight: 32 }}
          >
            Apply mapping
          </Button>
        </Stack>
      ) : null}
      {status ? (
        <Typography sx={{ fontSize: "0.8rem", color: theme.colors.slateGray }}>
          {status}
        </Typography>
      ) : null}
    </Stack>
  );
}
