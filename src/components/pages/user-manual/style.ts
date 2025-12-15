import { styled, Stack, IconButton, Typography } from "@mui/material";
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

export const ButtonsWrapper = styled(Stack)({
  gap: theme.gap.lg,
});

// Styled button stack for each download button
export const StyledButtonStack = styled(Stack)({
  flex: 1,
  height: 60,
  backgroundColor: theme.colors.lighter,
  borderRadius: theme.borderRadius.sm,
  border: `1px dashed ${theme.colors.darker}`,
  alignItems: "center",
  flexDirection: "row",
  padding: `${theme.padding.sm} ${theme.padding.lg}`,
  gap: theme.gap.lg,
  justifyContent: "space-between",
  color: theme.colors.darker,
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

// IconButton override for colored icon
export const StyledIconButton = styled(IconButton)({
  color: theme.colors.darker,
});

// Optional: If you only want a specific icon style, create this
export const StyledDownloadIcon = {
  color: theme.colors.darker,
};

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
