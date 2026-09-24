import { LinearProgress, Stack, Typography } from "@mui/material";
import { theme } from "@/constants/theme";

export function DownloadProgress({
  done,
  total,
  tone = "onDark",
}: {
  done: number;
  total: number;
  tone?: "onDark" | "onLight";
}) {
  const percent =
    total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  const onDark = tone === "onDark";

  return (
    <Stack sx={{ minWidth: 200, gap: "0.35rem" }}>
      <Typography
        sx={{
          color: onDark ? theme.colors.white : theme.colors.darker,
          fontSize: "0.8rem",
          fontWeight: 600,
        }}
      >
        {total > 0
          ? `Preparing Excel — ${done.toLocaleString("en-US")} / ${total.toLocaleString("en-US")} rows`
          : "Preparing the file…"}
      </Typography>
      <LinearProgress
        variant={total > 0 ? "determinate" : "indeterminate"}
        value={total > 0 ? percent : undefined}
        sx={{
          height: 6,
          borderRadius: 999,
          backgroundColor: onDark
            ? "rgba(255, 255, 255, 0.28)"
            : theme.colors.softBlue,
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            backgroundColor: onDark ? theme.colors.action : theme.colors.freshBlue,
          },
        }}
      />
    </Stack>
  );
}
