import { styled, Stack, Typography, Button } from "@mui/material";
import { colors } from "../../../assets/colors";

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
  backgroundColor: colors.lighter,
  borderRadius: 16,
  padding: "2rem",
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

// Label style
export const Label = styled(Typography)({
  color: colors.darker,
  fontWeight: "bold",
  fontSize: "1.5rem",
});

// Message style
export const Message = styled(Typography)({
  color: colors.darker,
  fontSize: "1rem",
  paddingBottom: "1rem",
});

// Button style
export const StyledButton = styled(Button)({
  backgroundColor: colors.action,
  color: colors.white,
  fontSize: "1rem",
  borderRadius: 16,
  height: 32,
  paddingLeft: 32,
  paddingRight: 32,
  textTransform: "none",
});

// Image and logo stack
export const ImageAndLogo = styled(Stack)({
  paddingBottom: "1rem",
  justifyContent: "center",
  alignItems: "center",
});
