import { styled, Card, Stack, Typography } from "@mui/material";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import { theme } from "../../../constants/theme";

const DISABLED_OPACITY = 0.55;

export const StyledCard = styled(Card)({
  backgroundColor: theme.colors.cleanWhite,
  border: `1px solid ${theme.colors.softBlue}`,
  boxShadow: "none",
  borderRadius: theme.borderRadius.md,
  padding: "1rem",
  width: "100%",
  height: "100%",
  minHeight: "14rem",
  display: "flex",
  boxSizing: "border-box",
});

export const StyledCardDisabled = styled(StyledCard)({
  opacity: DISABLED_OPACITY,
  pointerEvents: "none",
});

export const StyledDropzoneRoot = styled(Stack)({
  border: `1.5px dashed ${theme.colors.freshBlue}`,
  borderRadius: theme.borderRadius.md,
  width: "100%",
  flex: 1,
  minHeight: "11rem",
  height: "100%",
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  color: theme.colors.deepTeal,
  backgroundColor: theme.colors.paleBlue,
  transition: "border-color 0.15s ease, background-color 0.15s ease",

  "&:hover": {
    borderColor: theme.colors.deepTeal,
    backgroundColor: theme.colors.surface,
  },
});

export const StyledAdditionalDropzoneRoot = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "isDisabled",
})(({ isDisabled }: { isDisabled?: boolean }) => ({
  border: `1.5px dashed ${theme.colors.freshBlue}`,
  borderRadius: theme.borderRadius.md,
  width: "100%",
  flex: 1,
  minHeight: "11rem",
  height: "100%",
  marginTop: 0,
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  color: theme.colors.deepTeal,
  backgroundColor: theme.colors.paleBlue,
  opacity: isDisabled ? DISABLED_OPACITY : 1,
  pointerEvents: isDisabled ? "none" : "auto",
}));

export const StyledDownloadDoneIcon = styled(DownloadDoneIcon)({
  fontSize: theme.fontSize.icon,
  color: theme.colors.deepTeal,
});

export const ZoneLabel = styled(Typography)({
  fontWeight: 600,
  textAlign: "center",
  color: theme.colors.graphite,
});

export const ZoneHint = styled(Typography)({
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: theme.colors.freshBlue,
});
