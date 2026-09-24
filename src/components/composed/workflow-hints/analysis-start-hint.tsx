"use client";

import { Stack, Typography, Button } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { useRouter } from "next/navigation";
import { theme } from "@/constants/theme";
import { secondaryActionButtonStyles } from "../../ui-kit/button-styles";

/** Shown on analysis pages before any file is uploaded. */
export function AnalysisStartHint({
  title = "Start with your general ledger",
  body = "Drop an Excel GL on the left, map the four columns, then add the chart of accounts. Optional dictionary helps name journals.",
}: {
  title?: string;
  body?: string;
}) {
  const router = useRouter();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "stretch", sm: "center" }}
      gap={1.5}
      sx={{
        padding: "0.9rem 1.1rem",
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.softBlue}`,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Stack
        sx={{
          width: 40,
          height: 40,
          borderRadius: 12,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          backgroundColor: theme.colors.paleBlue,
          color: theme.colors.deepTeal,
        }}
      >
        <UploadFileOutlinedIcon />
      </Stack>
      <Stack gap={0.25} sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 700,
            color: theme.colors.deepTeal,
            fontSize: "0.95rem",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{ fontSize: "0.86rem", color: theme.colors.slateGray }}
        >
          {body}
        </Typography>
      </Stack>
      <Button
        onClick={() => router.push("/user-manual")}
        startIcon={<MenuBookOutlinedIcon />}
        sx={{
          ...secondaryActionButtonStyles,
          alignSelf: { xs: "stretch", sm: "center" },
        }}
      >
        User Manual
      </Button>
    </Stack>
  );
}
