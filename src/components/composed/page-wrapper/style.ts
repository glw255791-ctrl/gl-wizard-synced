import { styled, Stack, Typography, Button } from "@mui/material";
import { theme } from "../../../constants/theme";

// Main container for the page
export const Root = styled(Stack)({
  width: "calc(100vw - 5rem)",
  height: "calc(100vh - 4rem)",
  justifyContent: "flex-start",
  gap: theme.gap.lg,
  padding: theme.padding.lg,
});

// Row wrapper for side-by-side layout
export const Row = styled(Stack)({
  flexDirection: "row",
  gap: theme.gap.lg,
});

// Sidebar (left navigation)
export const Left = styled(Stack)({
  width: 300,
  backgroundColor: `${theme.colors.darker}CC`,
  borderRadius: theme.borderRadius.sm,
  height: "calc(100% - 3rem)",
  minHeight: "calc(100vh - 5rem)",
  maxHeight: "calc(100vh - 5rem)",
  alignItems: "center",
  padding: `${theme.padding.lg} ${theme.padding.none}`,
});

// Content area
export const Content = styled(Stack)({
  minHeight: "calc(100vh - 5rem)",
  justifyContent: "flex-start",
  gap: theme.gap.xl,
  paddingBottom: theme.padding.xl,
});

// Styled menu button
export const MenuBtn = styled(Button)({
  justifyContent: "flex-start",
  fontSize: theme.fontSize.lg,
  backgroundColor: `${theme.colors.darker}CC`,
  color: theme.colors.lighter,
  width: "100%",
  textTransform: "unset",
  borderRadius: 0,
  height: 45,
  transition: "font-size 0.5s",
  borderBottom: `${theme.borderWidth.md} solid transparent`,
  borderLeft: `${theme.borderWidth.lg} solid transparent`,
});

// Active menu button style
export const MenuBtnActive = styled(MenuBtn)({
  color: theme.colors.white,
  fontWeight: "bold",
  borderLeft: `${theme.borderWidth.lg} solid ${theme.colors.lighter}`,
});

// Page title
export const Title = styled(Typography)({
  fontSize: theme.fontSize.xl,
  fontWeight: "bold",
  color: theme.colors.lighter,
});

// Wrapper around both button areas
export const BtnGroupsWrapper = styled(Stack)({
  flex: 1,
  justifyContent: "space-between",
  width: "100%",
  paddingTop: theme.padding.lg,
});

// Top group of buttons
export const TopBtns = styled(Stack)({
  textAlign: "left",
  gap: theme.gap.sm,
  padding: `${theme.padding.lg} ${theme.padding.none}`,
  flex: 1,
});

// Bottom group of buttons
export const BottomBtns = styled(Stack)({
  gap: theme.gap.sm,
});
