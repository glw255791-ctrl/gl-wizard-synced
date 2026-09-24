"use client";

import { Button, Stack, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useRouter } from "next/navigation";
import { theme } from "@/constants/theme";
import {
  primaryActionButtonStyles,
  secondaryActionButtonStyles,
} from "../../ui-kit/button-styles";

/** End-of-Results footer: leave the wizard or start over. */
export function ResultsDoneBar({ onStartOver }: { onStartOver?: () => void }) {
  const router = useRouter();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "stretch", sm: "center" }}
      justifyContent="space-between"
      gap={1.25}
      sx={{
        padding: "0.95rem 1.1rem",
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.softBlue}`,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Stack gap={0.2} minWidth={0}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: theme.colors.deepTeal,
          }}
        >
          Done reviewing?
        </Typography>
        <Typography sx={{ fontSize: "0.86rem", color: theme.colors.slateGray }}>
          Return to the dashboard, or start over with a new upload.
        </Typography>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={1}
        sx={{ flexShrink: 0 }}
      >
        {onStartOver ? (
          <Button
            onClick={onStartOver}
            startIcon={<RestartAltIcon />}
            sx={secondaryActionButtonStyles}
          >
            Start over
          </Button>
        ) : null}
        <Button
          onClick={() => router.push("/dashboard")}
          startIcon={<HomeOutlinedIcon />}
          sx={{
            ...primaryActionButtonStyles,
            height: 40,
            minHeight: 40,
          }}
        >
          Back to dashboard
        </Button>
      </Stack>
    </Stack>
  );
}
