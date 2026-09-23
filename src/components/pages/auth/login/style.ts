import { styled, Stack, Typography, Button, Box } from "@mui/material";
import { theme } from "../../../../constants/theme";

export const Root = styled(Stack)({
  width: "100%",
  minHeight: "100vh",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.colors.canvas,
  backgroundImage: `linear-gradient(165deg, ${theme.colors.surface} 0%, ${theme.colors.page} 58%, ${theme.colors.canvas} 100%)`,
  padding: "2rem",
  boxSizing: "border-box",
});

export const LoginBlock = styled(Stack)({
  width: "100%",
  maxWidth: 420,
  backgroundColor: theme.colors.lighter,
  border: `1px solid ${theme.colors.surface}`,
  borderRadius: theme.borderRadius.lg,
  padding: "2rem 2rem 1.5rem",
  gap: "1rem",
  justifyContent: "center",
  alignItems: "stretch",
  boxShadow: "none",
});

export const LogoImage = styled("img")({
  height: "4.5rem",
  width: "4.5rem",
});

export const Label = styled(Typography)({
  color: theme.colors.darker,
  fontWeight: 700,
  fontSize: "1.5rem",
  letterSpacing: "0.01em",
});

export const Subtitle = styled(Typography)({
  color: theme.colors.medium,
  fontSize: "0.95rem",
  fontWeight: 400,
});

export const LoginButton = styled(Button)({
  backgroundColor: theme.colors.action,
  color: theme.colors.black,
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "999px",
  height: 44,
  marginTop: "0.25rem",
  boxShadow: "none",

  "&:hover": {
    backgroundColor: theme.colors.limeSoft,
    boxShadow: "none",
  },
});

export const ImageAndLogo = styled(Stack)({
  gap: "0.35rem",
  paddingBottom: "0.5rem",
  justifyContent: "center",
  alignItems: "center",
});

export const InputWrapper = styled(Box)({
  width: "100%",

  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    minHeight: 52,
    backgroundColor: theme.colors.white,
  },

  "& .MuiOutlinedInput-input": {
    padding: "14px 44px 14px 14px",
  },

  "& input:-webkit-autofill": {
    WebkitBoxShadow: `0 0 0 100px ${theme.colors.white} inset`,
    WebkitTextFillColor: theme.colors.black,
    caretColor: theme.colors.black,
  },

  "& input::-webkit-credentials-auto-fill-button": {
    marginRight: 4,
  },
});

export const ErrorsBlock = styled(Stack)({
  minHeight: "1.25rem",
  alignItems: "center",
});

export const ErrorText = styled(Typography)({
  fontSize: "0.875rem",
  color: theme.colors.red,
});
