import { CommonProps } from "@mui/material/OverridableComponent";
import { theme } from "../../../constants/theme";
import { Button, Stack, styled, Typography } from "@mui/material";
import CancelRounded from "@mui/icons-material/CancelRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Column keys for consistent use throughout
const VALUE = "value";
const RESULT = "result";
const ACCOUNT = "account";
const REVERSAL = "reversal";

// Styled icons
export const CheckedIcon = styled(CheckCircleIcon)({
  color: theme.colors.green,
  fontSize: theme.fontSize.lg,
});

export const UncheckedIcon = styled(CancelRounded)({
  color: theme.colors.gray,
  fontSize: theme.fontSize.lg,
});

// Styled containers and elements
export const ReversalCellWrapper = styled(Stack)({
  flex: 1,
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "row",
  gap: theme.gap.md,
});

export const LabelText = styled(Typography)({
  fontSize: theme.fontSize.cell,
});

export const Wrapper = styled(Stack)({
  position: "relative",
  borderRadius: theme.borderRadius.sm,
  borderWidth: theme.borderWidth.sm,
  borderStyle: "solid",
  borderColor: theme.colors.softBlue,
  overflow: "hidden",
});

export const ExportStatusOverlay = styled(Stack)({
  position: "absolute",
  left: "50%",
  top: 56,
  transform: "translateX(-50%)",
  zIndex: 5,
  minWidth: 280,
  maxWidth: "min(420px, calc(100% - 2rem))",
  padding: "0.85rem 1rem",
  borderRadius: theme.borderRadius.md,
  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.softBlue}`,
  boxShadow: "0 10px 28px rgba(53, 111, 115, 0.22)",
  gap: "0.35rem",
});

export const TableHeaderStyled = styled(Stack)({
  position: "relative",
  zIndex: 2,
  width: "100%",
  boxSizing: "border-box",
  padding: theme.padding.lg,
  backgroundColor: theme.colors.darker,
  color: theme.colors.white,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopLeftRadius: theme.borderRadius.sm,
  borderTopRightRadius: theme.borderRadius.sm,
});

export const TableTitle = styled(Typography)({
  fontSize: theme.fontSize.xl,
  fontWeight: "bold",
  color: theme.colors.white,
});

export const ExcelDownloadButton = styled(Button)({
  paddingLeft: theme.padding.lg,
  paddingRight: theme.padding.lg,
  borderRadius: theme.borderRadius.lg,
  height: theme.height.input,
  backgroundColor: theme.colors.action,
  color: theme.colors.black,
  textTransform: "none",
});

// Styles used in table rendering
export const styles: Record<string, CommonProps["style"]> = {
  cellBaseStyle: {
    boxSizing: "border-box",
    width: "100%",
    padding: theme.padding.sm,
    borderRightStyle: "solid",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
    justifyContent: "center",
    borderBottomStyle: "solid",
    fontSize: theme.fontSize.cell,
    borderRightWidth: theme.borderWidth.sm,
    borderRightColor: theme.colors.lighter,
    fontWeight: "initial",
    textAlign: "left",
    borderBottomWidth: theme.borderWidth.sm,
    borderBottomColor: theme.colors.lighter,
    height: theme.height.cell,
  },
  headerCell: {
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    flexDirection: "row",
    alignItems: "center",
    textAlign: "left",
    padding: theme.padding.sm,
    borderRightWidth: theme.borderWidth.sm,
    borderRightColor: theme.colors.lighter,
    fontWeight: "bold",
    justifyContent: "flex-start",
    backgroundColor: theme.colors.darker,
    color: theme.colors.white,
    borderTopWidth: theme.borderWidth.sm,
    borderTopStyle: "solid",
    borderTopColor: theme.colors.lighter,
  },
  autoSizer: {
    width: "100%",
    height: theme.height.table,
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: theme.borderRadius.sm,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  headerWrapper: {
    margin: 0,
    padding: 0,
    height: theme.height.headerWrapper,
    display: "flex",
    alignItems: "stretch",
    boxSizing: "border-box",
  },
  columnStyle: {
    margin: 0,
    padding: 0,
    backgroundColor: theme.colors.white,
    boxSizing: "border-box",
  },
};

/**
 * Returns cell style based on the column key/header type
 * @param key - The column key to determine styling for
 * @returns CSS properties object for the cell
 */
export const getCellStyleByHeader = (key: string): React.CSSProperties => {
  switch (key) {
    case VALUE:
      return { textAlign: "right" };
    case RESULT:
    case REVERSAL:
      return {
        fontWeight: "bold",
        backgroundColor: theme.colors.lighter,
      };
    case ACCOUNT:
      return { fontWeight: "bold" };
    default:
      return {};
  }
};
