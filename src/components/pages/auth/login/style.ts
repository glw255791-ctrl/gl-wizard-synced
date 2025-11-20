import { styled, Stack, Typography, Button, Box } from "@mui/material";
import { colors } from "../../../../assets/colors";

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
  backgroundColor: colors.lighter,
  borderRadius: 16,
  padding: "1rem",
  gap: "1rem",
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
  color: colors.darker,
  fontWeight: "bold",
  fontSize: "1.5rem",
});

// Login button
export const LoginButton = styled(Button)({
  backgroundColor: colors.action,
  color: "white",
  fontSize: "1rem",
  textTransform: "none",
  borderRadius: 16,
  height: 32,
  paddingLeft: 32,
  paddingRight: 32,
  marginTop: "1rem",
});

// Logo+label stack
export const ImageAndLogo = styled(Stack)({
  paddingBottom: "1rem",
  justifyContent: "center",
  alignItems: "center",
});

// Text input style (for inputProps)
export const StyledInput = {
  height: 32,
  borderRadius: 16,
};

// Outer input wrapper (for Input/TextField)
export const InputWrapper = styled(Box)({
  width: "80%",
  height: 32,
  borderRadius: 16,
});

// Error block for all errors
export const ErrorsBlock = styled(Stack)({
  minHeight: "3rem",
});

// Single error text
export const ErrorText = styled(Typography)({
  fontSize: "0.75rem",
  color: "red",
});

