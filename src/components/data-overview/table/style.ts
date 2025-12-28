import { CommonProps } from "@mui/material/OverridableComponent";
import { Button, IconButton, Stack, styled, Typography } from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRounded from "@mui/icons-material/CancelRounded";
import PushPinIcon from "@mui/icons-material/PushPin";
import DownloadIcon from "@mui/icons-material/Download";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { theme } from "../../../constants/theme";
import { AnyType } from "../../../types";

// Typography styles
export const TotalText = styled(Typography)({
  fontSize: theme.fontSize.lg,
  fontWeight: "bold",
});

export const TableTitle = styled(Typography)({
  fontSize: theme.fontSize.lg,
  fontWeight: "bold",
});

// Icon styles
export const CheckedIcon = styled(CheckCircleIcon)({
  color: theme.colors.green,
  fontSize: theme.fontSize.lg,
});

export const UncheckedIcon = styled(CancelRounded)({
  color: theme.colors.red,
  fontSize: theme.fontSize.lg,
});

export const PinIcon = styled(PushPinIcon)({
  fontSize: theme.fontSize.lg,
});

export const DownloadIconStyled = styled(DownloadIcon)({
  fontSize: theme.fontSize.lg,
});

export const QueryStatsIconStyled = styled(QueryStatsIcon)({
  fontSize: theme.fontSize.lg,
});

// Button/Stack styles
export const IconButtonStyled = styled(IconButton)({
  padding: theme.padding.none,
});

export const RowLabelWrapper = styled(Stack)({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

export const RowLabelCell = styled(Stack)({
  flexDirection: "row",
  gap: theme.gap.md,
  alignItems: "center",
});

export const TableScrollableWrapper = styled(Stack)({
  borderRadius: theme.borderRadius.sm,
  borderWidth: theme.borderWidth.sm,
  borderStyle: "solid",
  borderColor: theme.colors.medium,
});

export const TableHeaderStyled = styled(Stack)({
  width: "auto",
  padding: theme.padding.lg,
  backgroundColor: theme.colors.medium,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: 36.5,
  borderRadius: `${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0`,
});

export const ExcelDownloadButton = styled(Button)({
  paddingLeft: theme.padding.lg,
  paddingRight: theme.padding.lg,
  borderRadius: theme.borderRadius.lg,
  height: theme.height.input,
  backgroundColor: theme.colors.action,
  textTransform: "none",
});

// Miscellaneous, reusable style objects
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
  },
  autosizerWrapper: {
    width: "100%",
    overflow: "auto",
    maxHeight: theme.height.table,
    borderBottomRightRadius: theme.borderRadius.sm,
    borderBottomLeftRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.medium,
  },
};

export const ButtonsWrapper = styled(Stack)({
  flexDirection: "row",
  gap: theme.gap.md,
});

/**
 * Returns cell style object based on the column and row context.
 * @param column - The column identifier
 * @param row - The row data object
 * @param mappingValue - The mapping value for comparison
 * @param selectedRows - Optional array of selected row identifiers
 * @returns CSS properties object for the cell
 */
export const getStylesBasedOnColumn = (
  column: string,
  row: Record<string, AnyType>,
  mappingValue: string,
  selectedRows?: string[]
) => {
  const isSideHeader = column === "sideHeader";
  const isTotalColumn = column === "total";
  const isSelectedRow = selectedRows?.includes(String(row.sideHeader));
  const isBoldRow =
    isTotalColumn ||
    isSideHeader ||
    row.sideHeader === "Total" ||
    row.sideHeader === mappingValue;

  let backgroundColor: string;
  if (isSideHeader) {
    backgroundColor = isSelectedRow
      ? theme.colors.medium
      : theme.colors.lighter;
  } else {
    backgroundColor = isTotalColumn ? theme.colors.lighter : (row.bg as string);
  }

  return {
    backgroundColor,
    borderRightWidth: isSideHeader
      ? theme.borderWidth.md
      : theme.borderWidth.sm,
    borderRightColor: isSideHeader ? theme.colors.medium : theme.colors.lighter,
    borderLeftWidth: isTotalColumn
      ? theme.borderWidth.md
      : theme.borderWidth.none,
    borderLeftStyle: "solid",
    borderLeftColor: theme.colors.medium,
    fontWeight: isBoldRow ? "bold" : "initial",
    borderBottomStyle: "solid",
    borderBottomColor: theme.colors.medium,
    textAlign: isSideHeader ? "left" : "right",
    alignItems: isSideHeader ? "left" : "flex-end",
  };
};

/**
 * Returns style object for table header cells, determining
 * the bottom border and height based on the row position.
 * @param rowIndex - The current row index
 * @param fixedRowCount - The number of fixed header rows
 * @returns CSS properties object for the header cell
 */
export const getStylesBasedOnHeader = (
  rowIndex: number,
  fixedRowCount: number
) => {
  const isLastRow = rowIndex === fixedRowCount - 1;
  return {
    borderBottomWidth: isLastRow ? theme.borderWidth.md : theme.borderWidth.sm,
    borderBottomColor: isLastRow ? theme.colors.medium : theme.colors.lighter,
    height: isLastRow ? theme.height.header : theme.height.cell,
  };
};
