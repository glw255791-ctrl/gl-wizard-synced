import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { PickersTextField } from "@mui/x-date-pickers";
import { theme } from "../../../constants/theme";

// Root wrapper for the page
export const RootStack = styled(Stack)({
  width: "calc(100vw - 24rem)",
  minHeight: "calc(100vh - 4rem)",
  justifyContent: "flex-start",
  gap: theme.gap.lg,
});

// For the validity date stack (row layout for license info + buttons)
export const ValidDateStack = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.gap.sm,
});

// Expired/valid text color styles
export const RedText = styled(Typography)({
  color: theme.colors.red,
});

export const GreenText = styled(Typography)({
  color: theme.colors.green,
});

// Header cell styles for table
export const ColumnHeaderText = styled(Typography)({
  fontWeight: "bold",
});

// Modal outer content style
export const ModalContentStack = styled(Stack)({
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.lg,
  justifyContent: "center",
  alignItems: "center",
  padding: theme.padding.none,
});

// Modal inner content
export const ModalInnerContent = styled(Stack)({
  flex: 1,
  width: "100%",
  padding: theme.padding.none,
  justifyContent: "flex-start",
});

// Modal header bar
export const ModalHeader = styled(Stack)({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: `${theme.padding.sm} ${theme.padding.lg}`,
  borderBottom: `${theme.borderWidth.sm} solid ${theme.colors.darker}`,
});

// Black text utility
export const BlackText = styled(Typography)({
  color: theme.colors.darker,
});

// Modal content wrapper (for spacing)
export const ModalContentWrapper = styled(Stack)({
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gap: theme.gap.lg,
  padding: `${theme.padding.lg} ${theme.padding.none}`,
});

// For input fields' custom width
export const HalfWidthInput = styled(TextField)({
  width: "50%",
});

// Modal button row
export const ModalBtnRow = styled(Stack)({
  flexDirection: "row",
  gap: theme.gap.sm,
  justifyContent: "center",
  alignItems: "center",
});

// Modal Action Button
export const ModalActionButton = styled(Button)({
  height: theme.height.input,
  borderRadius: theme.borderRadius.lg,
  paddingLeft: theme.padding.lg,
  paddingRight: theme.padding.lg,
  textTransform: "none",
});

// Modal input - for height and border radius (e.g., DatePicker/TextField input)
export const ModalStyledInput = styled(TextField)({
  height: theme.height.input,
  borderRadius: theme.borderRadius.lg,
});

export const ModalStyledTextField = styled(PickersTextField)({
  height: theme.height.input,
  borderRadius: theme.borderRadius.lg,
});
// Modal input field wrapper (width)
export const ModalInputWrapper = styled("div")({
  width: "80%",
});

// Search bar block
export const SearchBlock = styled(Stack)({
  flex: 1,
  maxHeight: "60px",
  backgroundColor: theme.colors.lighter,
  borderRadius: theme.borderRadius.sm,
  alignItems: "center",
  flexDirection: "row",
  padding: `${theme.padding.sm} ${theme.padding.lg}`,
  gap: theme.gap.lg,
  justifyContent: "space-between",
});

// Search field wrapper
export const SearchField = styled(Stack)({
  flexDirection: "row",
  gap: theme.gap.sm,
  alignItems: "center",
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.lg,
});

// Search TextField input style
export const SearchInput = styled(TextField)({
  borderRadius: theme.borderRadius.lg,
  height: theme.height.input,
});

// "Invite user" Button
export const InviteButton = styled(Button)({
  borderRadius: theme.borderRadius.lg,
  height: theme.height.input,
  backgroundColor: theme.colors.action,
  paddingLeft: theme.padding.lg,
  paddingRight: theme.padding.lg,
  textTransform: "none",
});

// Table container style
export const StyledTableContainer = styled(Paper)({
  backgroundColor: theme.colors.lighter,
  borderRadius: theme.borderRadius.sm,
});
