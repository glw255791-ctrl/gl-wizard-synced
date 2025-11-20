import { Card, IconButton, Stack, styled, Typography } from "@mui/material";
import { colors } from "../../../assets/colors";

// Container for the header section
export const Wrapper = styled(Card)({
  backgroundColor: `${colors.darker}CC`,
  borderRadius: 8,
  padding: 16,
});

// Horizontal layout for header content
export const HeaderWrapper = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-evenly",
});

// Left-aligned button group
export const HeaderBtnsWrapper = styled(Stack)({
  flexDirection: "row",
  flex: 1,
  justifyContent: "flex-start",
});

// Icon styles for header buttons
export const IconButtonStyled = styled(IconButton)({
  color: colors.lighter,
});

// Header title styles
export const Title = styled(Typography)({
  fontWeight: "bold",
  color: colors.lighter,
  fontSize: "1.25rem",
});

// Right-aligned button group
export const HeaderBtnsWrapperRight = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  flex: 1,
  color: colors.white,
});

// Display for the user name in the header
export const NameWrapper = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingRight: 15,
  paddingLeft: 5
});