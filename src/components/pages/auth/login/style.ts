import { styled, Stack, Typography, Button, Box } from "@mui/material";
import { theme } from "../../../../constants/theme";

// Page root wrapper
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

// Title label
export const Label = styled(Typography)({
  color: theme.colors.darker,
  fontWeight: "bold",
  fontSize: theme.fontSize.xl,
});

// Login button
export const LoginButton = styled(Button)({
  backgroundColor: theme.colors.action,
  color: theme.colors.white,
  fontSize: theme.fontSize.lg,
  textTransform: "none",
  borderRadius: theme.borderRadius.lg,
  height: theme.height.input,
  paddingLeft: theme.padding.lg,
  paddingRight: theme.padding.lg,
  marginTop: theme.padding.lg,
});

// Logo+label stack
export const ImageAndLogo = styled(Stack)({
  paddingBottom: theme.padding.lg,
  justifyContent: "center",
  alignItems: "center",
});

// Text input style (for inputProps)
export const StyledInput = {
  height: theme.height.input,
  borderRadius: theme.borderRadius.lg,
};

// Outer input wrapper (for Input/TextField)
export const InputWrapper = styled(Box)({
  width: "80%",
  height: theme.height.input,
  borderRadius: theme.borderRadius.lg,
});

// Error block for all errors
export const ErrorsBlock = styled(Stack)({
  minHeight: "3rem",
});

// Single error text
export const ErrorText = styled(Typography)({
  fontSize: theme.fontSize.md,
  color: theme.colors.red,
});
