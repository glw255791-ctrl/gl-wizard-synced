"use client";

import { Stack, Typography, Button } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { useRouter } from "next/navigation";
import { theme } from "@/constants/theme";
import { secondaryActionButtonStyles } from "../../ui-kit/button-styles";

/** Compact getting-started tip on the dashboard. */
export function DashboardStartTip() {
  const router = useRouter();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "stretch", sm: "center" }}
      justifyContent="space-between"
      gap={1.25}
      sx={{
        padding: "0.85rem 1.1rem",
        borderRadius: theme.borderRadius.md,
        border: `1px dashed ${theme.colors.softBlue}`,
        backgroundColor: theme.colors.cleanWhite,
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
          First time here?
        </Typography>
        <Typography sx={{ fontSize: "0.86rem", color: theme.colors.slateGray }}>
          Pick a workspace below, upload a GL Excel file, map columns, then open
          Movement Tables and Process Analysis on Results.
        </Typography>
      </Stack>
      <Button
        onClick={() => router.push("/user-manual")}
        startIcon={<MenuBookOutlinedIcon />}
        sx={{
          ...secondaryActionButtonStyles,
          flexShrink: 0,
          alignSelf: { xs: "stretch", sm: "center" },
        }}
      >
        Open User Manual
      </Button>
    </Stack>
  );
}
