import { styled, Backdrop, Stack, Typography, LinearProgress } from "@mui/material";
import { theme } from "../../../constants/theme";

// Styled backdrop for the loader overlay
export const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  color: theme.palette.grey[500],
  zIndex: theme.zIndex.drawer + 1,
}));

// Styled stack container for the loader content
export const LoaderContent = styled(Stack)({
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.md,
  alignItems: "stretch",
  gap: "0.35rem",
  padding: "1rem 1.15rem",
  width: "min(420px, calc(100vw - 3rem))",
  boxSizing: "border-box",
});

export const LoaderText = styled(Typography)({
  color: theme.colors.black,
  fontWeight: 600,
  fontSize: "0.95rem",
});

export const LoaderMeta = styled(Typography)({
  color: theme.colors.medium,
  fontSize: "0.85rem",
});

export const StyledLinearProgress = styled(LinearProgress)({
  marginTop: "0.45rem",
  height: 8,
  borderRadius: 999,
  backgroundColor: theme.colors.surface,

  "& .MuiLinearProgress-bar": {
    borderRadius: 999,
    backgroundColor: theme.colors.action,
  },
});
