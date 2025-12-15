import { Box, Card, Stack, styled, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { theme } from "../../../constants/theme";

// Card wrapper for the info panel
export const Wrapper = styled(Card)({
  backgroundColor: theme.colors.lighter,
  borderRadius: theme.borderRadius.sm,
  padding: theme.padding.lg,
  height: "calc(100% - 2rem)",
});

// Contains all review/info labels in a row
export const ReviewsWrapper = styled(Stack)({
  height: "100%",
  alignItems: "center",
  justifyContent: "flex-start",
  flexDirection: "row",
  gap: theme.gap.md,
});

// Label with row alignment
export const ReviewLabel = styled(Stack)({
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: theme.gap.sm,
});

// Error message row layout
export const ErrorWrapper = styled(Stack)({
  flex: 2,
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: theme.gap.sm,
});

// Styled error icon
export const ErrorIcon = styled(ErrorOutlineIcon)({
  color: theme.colors.red,
});

// Styled error message text
export const ErrorText = styled(Typography)({
  color: theme.colors.red,
});

// Divider between rows
export const Divider = styled(Box)({
  width: "100%",
  height: 1,
  backgroundColor: theme.colors.gray,
});
