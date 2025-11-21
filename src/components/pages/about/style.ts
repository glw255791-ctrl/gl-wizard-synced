import { styled, Stack, Typography } from "@mui/material";
import { colors } from "../../../assets/colors";

// Styled root stack for the main page wrapper
export const RootStack = styled(Stack)({
  gap: "1rem",
  width: "calc(100vw - 24rem)"
});

// Wrapper for rows of buttons or content
export const ContentWrapper = styled(Stack)({
  flexDirection: "row",
  gap: 16,
});

// Styled stack for text instruction blocks
export const TextWrapper = styled(Stack)({
  textAlign: "justify",
  flex: 1,
  padding: '15px 30px',
  backgroundColor: colors.lighter,
  borderRadius: 8,
  color: colors.darker,
  gap: 10,
});

export const StyledTitle = styled(Typography)({
  fontWeight: 'bold',
  fontSize: 18,
  textAlign: 'center',
});

export const StyledList = styled('ul')({
  marginTop: 0,
  marginBottom: 0,
  paddingLeft: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});