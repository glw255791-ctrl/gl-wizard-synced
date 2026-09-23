import { Card, IconButton, Stack, styled, Typography } from "@mui/material";
import { theme } from "../../../constants/theme";

// Container for the header section
export const Wrapper = styled(Card)({
  backgroundColor: theme.colors.lighter,
  border: "1px solid #E4F0F0",
  borderRadius: theme.borderRadius.sm,
  padding: "0.85rem 1.15rem",
  boxShadow: "none",
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
  color: theme.colors.darker,

  "& .MuiSvgIcon-root": {
    fontSize: 26,
  },
});

export const Title = styled(Typography)({
  fontWeight: 600,
  color: theme.colors.darker,
  fontSize: "1.3rem",
  letterSpacing: "0.01em",
});

// Right-aligned button group
export const HeaderBtnsWrapperRight = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  flex: 1,
  color: theme.colors.black,
});

// Display for the user name in the header
export const NameWrapper = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingRight: theme.padding.lg,
  paddingLeft: theme.padding.sm,
  fontSize: "1.05rem",
  fontWeight: 600,
});
