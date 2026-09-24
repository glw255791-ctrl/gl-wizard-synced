import { Card, IconButton, Stack, styled, Typography } from "@mui/material";
import { theme } from "../../../constants/theme";

// Container for the header section
export const Wrapper = styled(Card)({
  backgroundColor: theme.colors.cleanWhite,
  border: `1px solid ${theme.colors.paleBlue}`,
  borderRadius: theme.borderRadius.sm,
  padding: "0.85rem 1.15rem",
  boxShadow: "none",
  flexShrink: 0,
});

// Horizontal layout for header content
export const HeaderWrapper = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

// Left-aligned button group
export const HeaderBtnsWrapper = styled(Stack)({
  flexDirection: "row",
  flex: 1,
  justifyContent: "flex-start",
});

// Icon styles for header buttons
export const IconButtonStyled = styled(IconButton)({
  color: theme.colors.deepTeal,

  "& .MuiSvgIcon-root": {
    fontSize: 26,
  },
});

export const Title = styled(Typography)({
  fontWeight: 600,
  color: theme.colors.deepTeal,
  fontSize: "1.3rem",
  letterSpacing: "0.01em",
});

// Right-aligned button group
export const HeaderBtnsWrapperRight = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  flex: 1,
  gap: "0.15rem",
  color: theme.colors.graphite,
});

