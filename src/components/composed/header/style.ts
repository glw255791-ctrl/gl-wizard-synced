import { Card, IconButton, Stack, styled, Typography } from "@mui/material";
import { theme } from "../../../constants/theme";

// Container for the header section
export const Wrapper = styled(Card)({
  backgroundColor: `${theme.colors.darker}CC`,
  borderRadius: theme.borderRadius.sm,
  padding: theme.padding.lg,
});

// Horizontal layout for header content
export const HeaderWrapper = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-evenly",
});

// Left-aligned button group
export const HeaderBtnsWrapper = styled(Stack)({
  flexDirection: "row",
  flex: 1,
  justifyContent: "flex-start",
});

// Icon styles for header buttons
export const IconButtonStyled = styled(IconButton)({
  color: theme.colors.lighter,
});

// Header title styles
export const Title = styled(Typography)({
  fontWeight: "bold",
  color: theme.colors.lighter,
  fontSize: theme.fontSize.xl,
});

// Right-aligned button group
export const HeaderBtnsWrapperRight = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  flex: 1,
  color: theme.colors.white,
});

// Display for the user name in the header
export const NameWrapper = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingRight: theme.padding.lg,
  paddingLeft: theme.padding.sm,
});
