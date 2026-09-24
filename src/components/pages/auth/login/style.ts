import { styled, Stack, Typography, Button, Box } from "@mui/material";
import { theme } from "../../../../constants/theme";

export const Root = styled(Stack)({
  width: "100%",
  minHeight: "100vh",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.colors.lightGray,
  backgroundImage: `linear-gradient(165deg, ${theme.colors.paleBlue} 0%, ${theme.colors.warmWhite} 58%, ${theme.colors.lightGray} 100%)`,
  padding: "2rem",
  boxSizing: "border-box",
});

export const LoginBlock = styled(Stack)({
  width: "100%",
  maxWidth: 420,
  backgroundColor: theme.colors.cleanWhite,
  border: `1px solid ${theme.colors.paleBlue}`,
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
  color: theme.colors.deepTeal,
  fontWeight: 700,
  fontSize: "1.5rem",
  letterSpacing: "0.01em",
});

export const Subtitle = styled(Typography)({
  color: theme.colors.slateGray,
  fontSize: "0.95rem",
  fontWeight: 400,
});

export const LoginButton = styled(Button)({
  backgroundColor: theme.colors.freshLime,
  color: theme.colors.graphite,
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

  "&.Mui-disabled": {
    backgroundColor: theme.colors.lightGray,
    color: theme.colors.coolGray,
    opacity: 1,
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
    backgroundColor: theme.colors.cleanWhite,
    color: theme.colors.graphite,

    "& fieldset": {
      borderColor: theme.colors.softBlue,
    },

    "&:hover fieldset": {
      borderColor: theme.colors.freshBlue,
    },

    "&.Mui-focused fieldset": {
      borderColor: theme.colors.deepTeal,
      borderWidth: 1.5,
    },

    "&.Mui-error fieldset": {
      borderColor: theme.colors.red,
    },
  },

  "& .MuiOutlinedInput-input": {
    padding: "14px 44px 14px 14px",
  },

  "& .MuiInputLabel-root": {
    color: theme.colors.slateGray,

    "&.Mui-focused": {
      color: theme.colors.deepTeal,
    },

    "&.Mui-error": {
      color: theme.colors.red,
    },
  },

  "& .MuiIconButton-root": {
    color: theme.colors.slateGray,

    "&:hover": {
      color: theme.colors.deepTeal,
      backgroundColor: theme.colors.paleBlue,
    },
  },

  "& input:-webkit-autofill": {
    WebkitBoxShadow: `0 0 0 100px ${theme.colors.cleanWhite} inset`,
    WebkitTextFillColor: theme.colors.graphite,
    caretColor: theme.colors.graphite,
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
