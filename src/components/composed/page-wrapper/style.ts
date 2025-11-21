import { styled, Stack, Typography, Button } from "@mui/material";
import { colors } from "../../../assets/colors";

// Main container for the page
export const Root = styled(Stack)({
  width: "calc(100vw - 5rem)",
  height: "calc(100vh - 4rem)",
  justifyContent: "flex-start",
  gap: "1rem",
  padding: "1rem",
});

// Row wrapper for side-by-side layout
export const Row = styled(Stack)({
  flexDirection: "row",
  gap: "1rem",
});

// Sidebar (left navigation)
export const Left = styled(Stack)({
  width: 300,
  backgroundColor: `${colors.darker}CC`,
  borderRadius: 8,
  height: "calc(100% - 3rem)",
  minHeight: "calc(100vh - 5rem)",
  maxHeight: "calc(100vh - 5rem)",
  alignItems: "center",
  padding: "1rem 0",
});

// Content area
export const Content = styled(Stack)({
  minHeight: "calc(100vh - 5rem)",
  justifyContent: "flex-start",
  gap: "1rem",
  paddingBottom: "1rem",
});

// Styled menu button
export const MenuBtn = styled(Button)({
  justifyContent: "flex-start",
  fontSize: "0.99rem",
  backgroundColor: `${colors.darker}CC`,
  color: colors.lighter,
  width: "100%",
  textTransform: "unset",
  borderRadius: 0,
  height: 45,
  transition: "font-size 0.5s",
  borderBottom: '2px solid transparent',
  borderLeft: '4px solid transparent',
});

// Active menu button style
export const MenuBtnActive = styled(MenuBtn)({
  color: colors.white,
  fontWeight: "bold",
  borderLeft: `4px solid ${colors.lighter}`,
});

// Page title
export const Title = styled(Typography)({
  fontSize: "2rem",
  fontWeight: "bold",
  color: colors.lighter,
});

// Wrapper around both button areas
export const BtnGroupsWrapper = styled(Stack)({
  flex: 1,
  justifyContent: "space-between",
  width: "100%",
  paddingTop: "1rem",
});

// Top group of buttons
export const TopBtns = styled(Stack)({
  textAlign: "left",
  gap: 2,
  padding: "1.5rem 0",
  flex: 1,
});

// Bottom group of buttons
export const BottomBtns = styled(Stack)({
  gap: 2
});
