import { LinearProgress, Stack, Typography } from "@mui/material";
import { theme } from "@/constants/theme";

export function DownloadProgress({
  done,
  total,
}: {
  done: number;
  total: number;
}) {
  const percent =
    total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;

  return (
    <Stack sx={{ minWidth: 168, gap: "0.2rem" }}>
      <Typography sx={{ color: theme.colors.white, fontSize: "0.75rem" }}>
        {total > 0
          ? `Row ${done.toLocaleString("en-US")} of ${total.toLocaleString("en-US")}`
          : "Preparing the file…"}
      </Typography>
      <LinearProgress
        variant={total > 0 ? "determinate" : "indeterminate"}
        value={total > 0 ? percent : undefined}
        sx={{
          height: 6,
          borderRadius: 999,
          backgroundColor: "rgba(255, 255, 255, 0.28)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            backgroundColor: theme.colors.action,
          },
        }}
      />
    </Stack>
  );
}
