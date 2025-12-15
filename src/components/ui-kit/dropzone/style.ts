import { styled, Card, Stack } from "@mui/material";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import { theme } from "../../../constants/theme";

const DISABLED_OPACITY = 0.25;
const FULL_HEIGHT_OFFSET = "calc(100% - 2rem)";

// Styled card container
export const StyledCard = styled(Card)({
  backgroundColor: theme.colors.lighter,
  borderRadius: theme.borderRadius.sm,
  padding: theme.padding.lg,
  height: FULL_HEIGHT_OFFSET,
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
  height: "100%",
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  color: theme.colors.darker,
  backgroundColor: theme.colors.white,
});

// Styled dropzone root (Stack)
export const StyledAdditionalDropzoneRoot = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "isDisabled",
})(({ isDisabled }: { isDisabled?: boolean }) => ({
  border: `${theme.borderWidth.md} dashed ${theme.colors.medium}`,
  borderRadius: theme.borderRadius.sm,
  height: "44.5%",
  marginTop: theme.padding.lg,
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  color: theme.colors.darker,
  backgroundColor: theme.colors.white,
  opacity: isDisabled ? DISABLED_OPACITY : 1,
  pointerEvents: isDisabled ? "none" : "auto",
}));

// Styled download done icon
export const StyledDownloadDoneIcon = styled(DownloadDoneIcon)({
  fontSize: theme.fontSize.icon,
});
