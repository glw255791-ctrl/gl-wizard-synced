import { colors } from "../../../assets/colors";
import { Box, Card, Stack, styled, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Card wrapper for the info panel
export const Wrapper = styled(Card)({
  backgroundColor: colors.lighter,
  borderRadius: 8,
  padding: 16,
  height: "calc(100% - 2rem)",
});

// Contains all review/info labels in a row
export const ReviewsWrapper = styled(Stack)({
  height: "100%",
  alignItems: "center",
  justifyContent: "flex-start",
  flexDirection: "row",
  gap: "1rem",
});

// Label with row alignment
export const ReviewLabel = styled(Stack)({
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: "0.25rem",
});


// Error message row layout
export const ErrorWrapper = styled(Stack)({
  flex: 2,
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: "0.25rem",
});

// Styled error icon
export const ErrorIcon = styled(ErrorOutlineIcon)({
  color: colors.red,
});

// Styled error message text
export const ErrorText = styled(Typography)({
  color: colors.red,
});

// Divider between rows
export const Divider = styled(Box)({
  width: "100%",
  height: 1,
  backgroundColor: colors.gray,
});
