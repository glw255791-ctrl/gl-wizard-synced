import { styled, Card, Stack } from "@mui/material";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import { colors } from "../../../assets/colors";

const BORDER_RADIUS = 8;
const CARD_PADDING = 16;
const DISABLED_OPACITY = 0.25;
const FULL_HEIGHT_OFFSET = "calc(100% - 2rem)";

// Styled card container
export const StyledCard = styled(Card)({
  backgroundColor: colors.lighter,
  borderRadius: BORDER_RADIUS,
  padding: CARD_PADDING,
  height: FULL_HEIGHT_OFFSET,
});

// Disabled card variant
export const StyledCardDisabled = styled(StyledCard)({
  opacity: DISABLED_OPACITY,
  pointerEvents: "none",
});

// Styled dropzone root (Stack)
export const StyledDropzoneRoot = styled(Stack)({
  border: `2px dashed ${colors.medium}`,
  borderRadius: "8px",
  height: "100%",
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  color: colors.darker,
  backgroundColor: colors.white,
});

// Styled dropzone root (Stack)
export const StyledAdditionalDropzoneRoot = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "isDisabled",
})(({ isDisabled }: { isDisabled?: boolean }) => ({
  border: `2px dashed ${colors.medium}`,
  borderRadius: "8px",
  height: "44.5%",
  marginTop: 16,
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  color: colors.darker,
  backgroundColor: colors.white,
  opacity: isDisabled ? DISABLED_OPACITY : 1,
  pointerEvents: isDisabled ? "none" : "auto",
}));

// Styled download done icon
export const StyledDownloadDoneIcon = styled(DownloadDoneIcon)({
  fontSize: "5rem",
});
