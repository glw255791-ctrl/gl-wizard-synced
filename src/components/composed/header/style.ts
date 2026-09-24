import { Card, IconButton, Stack, styled, Typography } from "@mui/material";
import { theme } from "../../../constants/theme";

// Container for the header section
export const Wrapper = styled(Card)({
  backgroundColor: theme.colors.cleanWhite,
  border: `1px solid ${theme.colors.softBlue}`,
  borderRadius: theme.borderRadius.md,
  padding: "0.95rem 1.15rem 1.05rem",
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
  fontWeight: 700,
  color: theme.colors.deepTeal,
  fontSize: "1.3rem",
  letterSpacing: "0.01em",
  textAlign: "center",
});

export const Description = styled(Typography)({
  fontSize: "0.92rem",
  fontWeight: 400,
  color: theme.colors.slateGray,
  textAlign: "center",
  maxWidth: 520,
  margin: "0.15rem auto 0",
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

