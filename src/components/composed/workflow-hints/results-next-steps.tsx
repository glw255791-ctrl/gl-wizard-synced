"use client";

import { Stack, Typography } from "@mui/material";
import { theme } from "@/constants/theme";

const steps = [
  {
    n: "1",
    title: "Movement Tables",
    hint: "Open a category and review balances.",
  },
  {
    n: "2",
    title: "Process Analysis",
    hint: "Build a process tree with + on related lines.",
  },
  {
    n: "3",
    title: "Export",
    hint: "Download Excel from the table header or Process modal.",
  },
];

/** Shown on Results after Analyze completes. */
export function ResultsNextSteps() {
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
        What&apos;s next
      </Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={1.25}
        sx={{
          padding: "0.85rem 1rem",
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.softBlue}`,
          backgroundColor: theme.colors.surface,
        }}
      >
        {steps.map((step) => (
          <Stack
            key={step.n}
            direction="row"
            gap={0.85}
            alignItems="flex-start"
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Typography
              sx={{
                width: 26,
                height: 26,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                fontSize: "0.8rem",
                fontWeight: 700,
                backgroundColor: theme.colors.deepTeal,
                color: theme.colors.cleanWhite,
              }}
            >
              {step.n}
            </Typography>
            <Stack gap={0.15} minWidth={0}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: theme.colors.deepTeal,
                }}
              >
                {step.title}
              </Typography>
              <Typography
                sx={{ fontSize: "0.82rem", color: theme.colors.slateGray }}
              >
                {step.hint}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
