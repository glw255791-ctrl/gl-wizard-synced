import {
  styled,
  Backdrop,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { theme } from "../../../constants/theme";

// Styled backdrop for the loader overlay
export const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  color: theme.palette.grey[500],
  zIndex: theme.zIndex.drawer + 1,
}));

// Styled stack container for the loader content
export const LoaderContent = styled(Stack)({
  backgroundColor: theme.colors.white,
  borderRadius: 36,
  flexDirection: "row",
  alignItems: "center",
  gap: theme.gap.lg,
  padding: theme.padding.lg,
});

// Styled typography for the loader text
export const LoaderText = styled(Typography)({
  color: theme.colors.medium,
});

// Styled circular progress indicator
export const StyledCircularProgress = styled(CircularProgress)({
  color: theme.colors.medium,
});
