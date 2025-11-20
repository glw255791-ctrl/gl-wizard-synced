import { styled, Backdrop, Stack, Typography, CircularProgress } from "@mui/material";
import { colors } from "../../../assets/colors";

// Styled backdrop for the loader overlay
export const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  color: colors.vistaBlue,
  zIndex: theme.zIndex.drawer + 1,
}));

// Styled stack container for the loader content
export const LoaderContent = styled(Stack)({
  backgroundColor: colors.white,
  borderRadius: 45,
  flexDirection: "row",
  alignItems: "center",
  gap: 15,
  padding: "15px 20px",
});

// Styled typography for the loader text
export const LoaderText = styled(Typography)({
  color: colors.medium,
});

// Styled circular progress indicator
export const StyledCircularProgress = styled(CircularProgress)({
  color: colors.medium,
});

