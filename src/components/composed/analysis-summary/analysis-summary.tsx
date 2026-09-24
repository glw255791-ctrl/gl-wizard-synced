"use client";

import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { theme } from "@/constants/theme";
import { GlHeaders } from "@/types";

function summarize(rows: Record<string, unknown>[], headers: GlHeaders) {
  let unmapped = 0;
  const journals = new Map<string, number>();

  for (const row of rows) {
    const coa = row.coaData as Record<string, unknown> | undefined;
    const coaUnmapped = coa
      ? Object.values(coa).some((value) => value === "not mapped")
      : false;
    if (row[headers.account] === "not mapped" || coaUnmapped) unmapped += 1;

    const key = `${String(row[headers.date] ?? "")}_${String(row[headers.jen] ?? "")}`;
    const amount = Number(row[headers.value]);
    const next =
      (journals.get(key) ?? 0) + (Number.isFinite(amount) ? amount : 0);
    journals.set(key, Number(next.toFixed(2)));
  }

  let openJournals = 0;
  for (const sum of journals.values()) {
    if (sum !== 0) openJournals += 1;
  }

  return { rows: rows.length, unmapped, openJournals };
}

function Figure({ label, value }: { label: string; value: number }) {
  return (
    <Stack
      gap={0.25}
      sx={{
        flex: "1 1 120px",
        minWidth: 0,
        padding: "0.65rem 0.85rem",
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.cleanWhite,
        border: `1px solid ${theme.colors.softBlue}`,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: theme.colors.freshBlue,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: theme.colors.deepTeal,
          lineHeight: 1.2,
        }}
      >
        {value.toLocaleString("en-US")}
      </Typography>
    </Stack>
  );
}

export function AnalysisSummary({
  rows,
  headers,
}: {
  rows: Record<string, unknown>[];
  headers: GlHeaders;
}) {
  const summary = useMemo(() => summarize(rows, headers), [rows, headers]);

  return (
    <Stack gap={1}>
      <Typography
        sx={{
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: theme.colors.freshBlue,
        }}
      >
        Results overview
      </Typography>
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={1.25}
        sx={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.softBlue}`,
          borderRadius: theme.borderRadius.md,
          padding: "0.85rem 1rem",
        }}
      >
        <Figure label="Rows" value={summary.rows} />
        <Figure label="Unmapped rows" value={summary.unmapped} />
        <Figure label="Journals not at zero" value={summary.openJournals} />
      </Stack>
    </Stack>
  );
}
