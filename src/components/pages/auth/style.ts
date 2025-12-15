import { styled, Stack, Typography, Button } from "@mui/material";
import { theme } from "../../../constants/theme";

// Root container
export const Root = styled(Stack)({
  width: "calc(100vw - 6rem)",
  minHeight: "calc(100vh - 4rem)",
  justifyContent: "center",
  alignItems: "center",
});

// Login block container
export const LoginBlock = styled(Stack)({
  width: 400,
  backgroundColor: theme.colors.lighter,
  borderRadius: theme.borderRadius.lg,
  padding: theme.padding.lg,
  gap: theme.gap.lg,
  justifyContent: "center",
  alignItems: "center",
});

// Logo image style
export const LogoImage = styled("img")({
  height: "8rem",
  width: "8rem",
  marginBottom: "-0.5rem",
});

// Label style
export const Label = styled(Typography)({
  color: theme.colors.darker,
  fontWeight: "bold",
  fontSize: theme.fontSize.xl,
});

// Message style
export const Message = styled(Typography)({
  color: theme.colors.darker,
  fontSize: theme.fontSize.lg,
  paddingBottom: theme.padding.lg,
});

// Button style
export const StyledButton = styled(Button)({
  backgroundColor: theme.colors.action,
  color: theme.colors.white,
  fontSize: theme.fontSize.lg,
  borderRadius: theme.borderRadius.lg,
  height: theme.height.input,
  paddingLeft: theme.padding.lg,
  paddingRight: theme.padding.lg,
  textTransform: "none",
});

// Image and logo stack
export const ImageAndLogo = styled(Stack)({
  paddingBottom: theme.padding.lg,
  justifyContent: "center",
  alignItems: "center",
});
