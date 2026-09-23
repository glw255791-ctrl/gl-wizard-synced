"use client";

import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { theme } from "@/constants/theme";
import { GlHeaders } from "@/types";

function summarize(
  rows: Record<string, unknown>[],
  headers: GlHeaders
) {
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
    <Stack gap={0.25}>
      <Typography variant="body2" color={theme.colors.medium}>
        {label}
      </Typography>
      <Typography fontWeight={700} color={theme.colors.black}>
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
    <Stack
      direction="row"
      gap={4}
      sx={{
        backgroundColor: theme.colors.lighter,
        border: `1px solid ${theme.colors.surface}`,
        borderRadius: theme.borderRadius.sm,
        padding: "0.85rem 1.15rem",
      }}
    >
      <Figure label="Rows" value={summary.rows} />
      <Figure label="Unmapped rows" value={summary.unmapped} />
      <Figure label="Journals not at zero" value={summary.openJournals} />
    </Stack>
  );
}
