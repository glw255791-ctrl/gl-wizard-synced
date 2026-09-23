import { styled, Stack, Typography, Button } from "@mui/material";
import { theme } from "../../../constants/theme";

// Styled root stack for the main page wrapper
export const RootStack = styled(Stack)({
  gap: theme.gap.lg,
  width: "100%",
});

// Wrapper for rows of buttons or content
export const ContentWrapper = styled(Stack)({
  flexDirection: "row",
  gap: theme.gap.lg,
});

export const ButtonsWrapper = styled(Stack)({
  gap: theme.gap.lg,
});

// Styled button stack for each download button
export const StyledButtonStack = styled(Button)({
  flex: 1,
  height: 48,
  backgroundColor: theme.colors.lighter,
  borderRadius: "999px",
  border: `1px solid ${theme.colors.surface}`,
  alignItems: "center",
  flexDirection: "row",
  padding: `0 ${theme.padding.lg}`,
  gap: theme.gap.lg,
  justifyContent: "space-between",
  color: theme.colors.black,
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "none",

  "&:hover": {
    backgroundColor: theme.colors.limeLight,
    boxShadow: "none",
  },
});

// Styled stack for text instruction blocks
export const TextWrapper = styled(Stack)({
  textAlign: "justify",
  flex: 1,
  padding: `${theme.padding.lg} ${theme.padding.xl}`,
  backgroundColor: theme.colors.lighter,
  borderRadius: theme.borderRadius.sm,
  color: theme.colors.darker,
  gap: theme.gap.lg,
});

export const StyledTitle = styled(Typography)({
  fontWeight: "bold",
  fontSize: theme.fontSize.lg,
  textAlign: "center",
});

export const StyledList = styled("ul")({
  marginTop: theme.padding.none,
  marginBottom: theme.padding.none,
  paddingLeft: theme.padding.lg,
  display: "flex",
  flexDirection: "column",
  gap: theme.gap.sm,
});
