import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { PickersTextField } from "@mui/x-date-pickers";
import { theme } from "../../../constants/theme";
import { primaryActionButtonStyles } from "../../ui-kit/button-styles";

export const RootStack = styled(Stack)({
  width: "100%",
  minWidth: 0,
  minHeight: 0,
  gap: theme.gap.lg,
});

export const PagePanel = styled(Stack)({
  flex: 1,
  minHeight: 0,
  gap: theme.gap.lg,
  padding: "1.25rem",
  backgroundColor: theme.colors.page,
  border: `1px solid ${theme.colors.softBlue}`,
  borderRadius: theme.borderRadius.md,
  overflow: "auto",
});

export const Toolbar = styled(Stack)({
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.gap.md,
  padding: "0.75rem 1rem",
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.softBlue}`,
  borderRadius: theme.borderRadius.md,
});

export const SearchField = styled(Stack)({
  flex: "1 1 260px",
  minWidth: 0,
  maxWidth: 420,
});

export const SearchInput = styled(TextField)({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    "& fieldset": {
      borderColor: theme.colors.softBlue,
    },
    "&:hover fieldset": {
      borderColor: theme.colors.freshBlue,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.colors.darker,
    },
  },
});

export const InviteButton = styled(Button)({
  ...primaryActionButtonStyles,
  marginLeft: "auto",
  height: 40,
  minHeight: 40,
});

export const TablePanel = styled(TableContainer)({
  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.softBlue}`,
  borderRadius: theme.borderRadius.md,
  overflow: "hidden",
  boxShadow: "none",
}) as typeof TableContainer;

export const ColumnHeaderText = styled(Typography)({
  fontWeight: 700,
  fontSize: theme.fontSize.cell,
  color: theme.colors.white,
});

export const ValidDateStack = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: theme.gap.sm,
});

export const RedText = styled(Typography)({
  color: theme.colors.red,
  fontWeight: 600,
  fontSize: theme.fontSize.cell,
});

export const GreenText = styled(Typography)({
  color: theme.colors.darker,
  fontWeight: 600,
  fontSize: theme.fontSize.cell,
});

export const ModalContentStack = styled(Stack)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(420px, calc(100vw - 2rem))",
  backgroundColor: theme.colors.page,
  borderRadius: theme.borderRadius.md,
  border: `1px solid ${theme.colors.softBlue}`,
  boxShadow: "0 18px 48px rgba(53, 111, 115, 0.28)",
  overflow: "hidden",
});

export const ModalInnerContent = styled(Stack)({
  width: "100%",
});

export const ModalHeader = styled(Stack)({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.75rem 1rem",
  backgroundColor: theme.colors.darker,
  color: theme.colors.white,
});

export const BlackText = styled(Typography)({
  color: theme.colors.white,
  fontWeight: 700,
});

export const ModalContentWrapper = styled(Stack)({
  alignItems: "stretch",
  gap: theme.gap.md,
  padding: "1rem 1.1rem 1.15rem",
});

export const ModalBtnRow = styled(Stack)({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: theme.gap.sm,
});

export const ModalActionButton = styled(Button)({
  height: 40,
  borderRadius: 16,
  paddingLeft: "1rem",
  paddingRight: "1rem",
  textTransform: "none",
  fontWeight: 600,
  backgroundColor: theme.colors.darker,
  color: theme.colors.white,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: theme.colors.freshBlue,
    boxShadow: "none",
  },
  "&.Mui-disabled": {
    backgroundColor: theme.colors.softBlue,
    color: theme.colors.white,
  },
});

export const ModalStyledInput = styled(TextField)({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: 16,
    backgroundColor: theme.colors.white,
  },
});

export const ModalStyledTextField = styled(PickersTextField)({
  height: theme.height.input,
  borderRadius: theme.borderRadius.lg,
});

export const HalfWidthInput = styled(TextField)({
  width: "50%",
});

export const ModalInputWrapper = styled("div")({
  width: "100%",
});

// Keep aliases used by older imports if any
export const SearchBlock = Toolbar;
export const StyledTableContainer = styled(Paper)({
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.md,
});
