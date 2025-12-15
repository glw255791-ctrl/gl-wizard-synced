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
  borderRadius: theme.borderRadius.sm,
  borderWidth: theme.borderWidth.sm,
  borderStyle: "solid",
  borderColor: theme.colors.medium,
});

export const TableHeaderStyled = styled(Stack)({
  width: "calc(100vw - 28rem + 1px)",
  padding: theme.padding.lg,
  backgroundColor: theme.colors.medium,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopLeftRadius: theme.borderRadius.sm,
  borderTopRightRadius: theme.borderRadius.sm,
});

export const TableTitle = styled(Typography)({
  fontSize: theme.fontSize.xl,
  fontWeight: "bold",
});

export const ExcelDownloadButton = styled(Button)({
  paddingLeft: theme.padding.lg,
  paddingRight: theme.padding.lg,
  borderRadius: theme.borderRadius.lg,
  height: theme.height.input,
  backgroundColor: theme.colors.action,
  textTransform: "none",
});

// Styles used in table rendering
export const styles: Record<string, CommonProps["style"]> = {
  cellBaseStyle: {
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
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    flex: 1,
    textAlign: "left",
    padding: theme.padding.sm,
    borderRightWidth: theme.borderWidth.sm,
    borderRightColor: theme.colors.lighter,
    fontWeight: "bold",
    justifyContent: "center",
    backgroundColor: theme.colors.medium,
    borderTopWidth: theme.borderWidth.sm,
    borderTopStyle: "solid",
    borderTopColor: theme.colors.lighter,
    height: theme.height.header,
  },
  autoSizer: {
    width: "100%",
    height: theme.height.table,
    backgroundColor: theme.colors.medium,
    borderBottomLeftRadius: theme.borderRadius.sm,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  headerWrapper: {
    margin: 0,
    height: theme.height.headerWrapper,
    marginRight: 0.5,
  },
  columnStyle: {
    margin: 0,
    backgroundColor: theme.colors.white,
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
