import { styled, Stack, Typography } from "@mui/material";
import { theme } from "../../../constants/theme";

// Styled root stack for the main page wrapper
export const RootStack = styled(Stack)({
  gap: theme.gap.lg,
  width: "calc(100vw - 24rem)",
});

// Wrapper for rows of buttons or content
export const ContentWrapper = styled(Stack)({
  flexDirection: "row",
  gap: theme.gap.lg,
});

// Styled stack for text instruction blocks
export const TextWrapper = styled(Stack)({
  textAlign: "justify",
  flex: 1,
  padding: `${theme.padding.lg} ${theme.padding.xl}`,
  backgroundColor: theme.colors.lighter,
  borderRadius: theme.borderRadius.sm,
  color: theme.colors.darker,
  gap: theme.gap.md,
});

export const StyledTitle = styled(Typography)({
  fontWeight: "bold",
  fontSize: theme.fontSize.lg,
  textAlign: "center",
});

export const StyledList = styled("ul")({
  marginTop: theme.padding.none,
  marginBottom: theme.padding.none,
  paddingLeft: theme.padding.xl,
  display: "flex",
  flexDirection: "column",
  gap: theme.gap.md,
});
