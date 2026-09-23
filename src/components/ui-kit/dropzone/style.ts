import { styled, Card, Stack, Typography } from "@mui/material";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import { theme } from "../../../constants/theme";

const DISABLED_OPACITY = 0.55;

// Styled card container
export const StyledCard = styled(Card)({
  backgroundColor: theme.colors.lighter,
  border: `1px solid ${theme.colors.surface}`,
  boxShadow: "none",
  borderRadius: theme.borderRadius.sm,
  padding: theme.padding.lg,
  width: "100%",
  height: "100%",
  minHeight: "14rem",
  display: "flex",
  boxSizing: "border-box",
});

// Disabled card variant
export const StyledCardDisabled = styled(StyledCard)({
  opacity: DISABLED_OPACITY,
  pointerEvents: "none",
});

// Styled dropzone root (Stack)
export const StyledDropzoneRoot = styled(Stack)({
  border: `${theme.borderWidth.md} dashed ${theme.colors.medium}`,
  borderRadius: theme.borderRadius.sm,
  width: "100%",
  flex: 1,
  minHeight: "11rem",
  height: "100%",
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  color: theme.colors.darker,
  backgroundColor: theme.colors.surface,
});

// Styled dropzone root (Stack)
export const StyledAdditionalDropzoneRoot = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "isDisabled",
})(({ isDisabled }: { isDisabled?: boolean }) => ({
  border: `${theme.borderWidth.md} dashed ${theme.colors.medium}`,
  borderRadius: theme.borderRadius.sm,
  width: "100%",
  flex: 1,
  minHeight: "11rem",
  height: "100%",
  marginTop: 0,
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  color: theme.colors.darker,
  backgroundColor: theme.colors.surface,
  opacity: isDisabled ? DISABLED_OPACITY : 1,
  pointerEvents: isDisabled ? "none" : "auto",
}));

// Styled download done icon
export const StyledDownloadDoneIcon = styled(DownloadDoneIcon)({
  fontSize: theme.fontSize.icon,
});

export const ZoneLabel = styled(Typography)({
  fontWeight: 600,
  textAlign: "center",
});

export const ZoneHint = styled(Typography)({
  fontSize: "0.8rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: theme.colors.medium,
});
