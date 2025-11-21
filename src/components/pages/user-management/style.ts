import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { colors } from "../../../assets/colors";

// Root wrapper for the page
export const RootStack = styled(Stack)({
  width: "calc(100vw - 24rem)",
  minHeight: "calc(100vh - 4rem)",
  justifyContent: "flex-start",
  gap: "1rem",
});

// For the validity date stack (row layout for license info + buttons)
export const ValidDateStack = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
});

// Expired/valid text color styles
export const RedText = styled(Typography)({
  color: colors.red,
});

export const GreenText = styled(Typography)({
  color: colors.green,
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
  backgroundColor: colors.white,
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  padding: 0,
});

// Modal inner content
export const ModalInnerContent = styled(Stack)({
  flex: 1,
  width: "100%",
  padding: 0,
  justifyContent: "flex-start",
});

// Modal header bar
export const ModalHeader = styled(Stack)({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "5px 15px",
  borderBottom: `2px solid ${colors.darker}`,
});

// Black text utility
export const BlackText = styled(Typography)({
  color: colors.black,
});

// Modal content wrapper (for spacing)
export const ModalContentWrapper = styled(Stack)({
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gap: 30,
  padding: "30px 0",
});

// For input fields' custom width
export const HalfWidthInput = styled(TextField)({
  width: "50%",
});

// Modal button row
export const ModalBtnRow = styled(Stack)({
  flexDirection: "row",
  gap: 10,
  justifyContent: "center",
  alignItems: "center",
});

// Modal Action Button
export const ModalActionButton = styled(Button)({
  height: 32,
  borderRadius: 16,
  paddingLeft: 32,
  paddingRight: 32,
  textTransform: "none",
});

// Modal input - for height and border radius (e.g., DatePicker/TextField input)
export const ModalStyledInput = styled(TextField)({
  height: 32,
  borderRadius: 16,
});

// Modal input field wrapper (width)
export const ModalInputWrapper = styled("div")({
  width: "80%",
});

// Search bar block
export const SearchBlock = styled(Stack)({
  flex: 1,
  maxHeight: "60px",
  backgroundColor: colors.lighter,
  borderRadius: 8,
  alignItems: "center",
  flexDirection: "row",
  padding: "8px 16px",
  gap: 15,
  justifyContent: "space-between",
});

// Search field wrapper
export const SearchField = styled(Stack)({
  flexDirection: "row",
  gap: 5,
  alignItems: "center",
  backgroundColor: colors.white,
  borderRadius: 16,
});

// Search TextField input style
export const SearchInput = styled(TextField)({
  borderRadius: 16,
  height: 30,
});

// "Invite user" Button
export const InviteButton = styled(Button)({
  borderRadius: 16,
  height: 32,
  backgroundColor: colors.action,
  paddingLeft: 32,
  paddingRight: 32,
  textTransform: "none",
});

// Table container style
export const StyledTableContainer = styled(Paper)({
  backgroundColor: colors.lighter,
  borderRadius: 8,
});
