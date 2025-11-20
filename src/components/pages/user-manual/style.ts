import { styled, Stack, IconButton, Typography } from "@mui/material";
import { colors } from "../../../assets/colors";

// Styled root stack for the main page wrapper
export const RootStack = styled(Stack)({
  gap: "1rem",
  width: "calc(100vw - 24rem)"
});

// Wrapper for rows of buttons or content
export const ButtonsWrapper = styled(Stack)({
  flexDirection: "row",
  gap: 16,
});

// Styled button stack for each download button
export const StyledButtonStack = styled(Stack)({
  flex: 1,
  height: 60,
  backgroundColor: colors.lighter,
  borderRadius: 8,
  alignItems: "center",
  flexDirection: "row",
  padding: "8px 16px",
  gap: 15,
  justifyContent: "space-between",
  color: colors.darker,
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

// IconButton override for colored icon
export const StyledIconButton = styled(IconButton)({
  color: colors.darker,
});

// Optional: If you only want a specific icon style, create this
export const StyledDownloadIcon = {
  color: colors.darker,
};

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