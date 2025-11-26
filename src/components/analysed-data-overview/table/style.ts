import { CommonProps } from "@mui/material/OverridableComponent";
import { Button, IconButton, Stack, styled, Typography } from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRounded from "@mui/icons-material/CancelRounded";
import PushPinIcon from "@mui/icons-material/PushPin";
import DownloadIcon from "@mui/icons-material/Download";

import { colors } from "../../../assets/colors";
import { AnyType } from "./functions";

// Typography styles
export const TotalText = styled(Typography)({
  fontSize: 14,
  fontWeight: "bold",
});

export const TableTitle = styled(Typography)({
  fontSize: 20,
  fontWeight: "bold",
});

// Icon styles
export const CheckedIcon = styled(CheckCircleIcon)({
  color: colors.green,
  fontSize: 17,
});

export const UncheckedIcon = styled(CancelRounded)({
  color: colors.red,
  fontSize: 17,
});

export const PinIcon = styled(PushPinIcon)({
  fontSize: 16,
});

export const DownloadIconStyled = styled(DownloadIcon)({
  fontSize: 16,
});

// Button/Stack styles
export const IconButtonStyled = styled(IconButton)({
  padding: 0,
});

export const RowLabelWrapper = styled(Stack)({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

export const RowLabelCell = styled(Stack)({
  flexDirection: "row",
  gap: 5,
  alignItems: "center",
});

export const TableScrollableWrapper = styled(Stack)({
  minWidth: 1200,
  borderRadius: 8,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: colors.medium,
});

export const TableHeaderStyled = styled(Stack)({
  width: "calc(100vw - 28rem)",
  padding: "1rem",
  backgroundColor: colors.medium,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: 36.5,
  borderRadius: "6px 6px 0 0",
});

export const ExcelDownloadButton = styled(Button)({
  paddingLeft: 16,
  paddingRight: 16,
  borderRadius: 16,
  height: 32,
  backgroundColor: colors.action,
  textTransform: "none",
});

// Miscellaneous, reusable style objects
export const styles: Record<string, CommonProps["style"]> = {
  cellBaseStyle: {
    padding: "0 5px",
    borderRightStyle: "solid",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
    justifyContent: "center",
    borderBottomStyle: "solid",
    fontSize: 12,
  },
  autosizerWrapper: {
    width: "100%",
    overflow: "auto",
    maxHeight: 600,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    backgroundColor: colors.medium,
  },
};

export const ButtonsWrapper = styled(Stack)({
  flexDirection: "row",
  gap: 10,
});

/**
 * Returns cell style object based on the column and row context.
 */
export const getStylesBasedOnColumn = (
  column: string,
  row: Record<string, AnyType>,
  mappingValue: string,
  selectedRow?: string
) => {
  const isSideHeader = column === "sideHeader";
  const isTotalColumn = column === "total";
  const isSelectedRow = selectedRow && String(row.sideHeader).split('/').includes(selectedRow)
  const isBoldRow =
    isTotalColumn ||
    isSideHeader ||
    row.sideHeader === "Total" ||
    row.sideHeader === mappingValue;

  let backgroundColor: string;
  if (isSideHeader) {
    backgroundColor = isSelectedRow ? colors.medium : colors.lighter;
  } else {
    backgroundColor = isTotalColumn ? colors.lighter : (row.bg as string);
  }

  return {
    backgroundColor,
    borderRightWidth: isSideHeader ? 2 : 1,
    borderRightColor: isSideHeader ? colors.medium : colors.lighter,
    borderLeftWidth: isTotalColumn ? 2 : 0,
    borderLeftStyle: "solid",
    borderLeftColor: colors.medium,
    fontWeight: isBoldRow ? "bold" : "initial",
    borderBottomStyle: "solid",
    borderBottomColor: colors.medium,
    textAlign: isSideHeader ? "left" : "center",
  };
};

/**
 * Returns style object for table header cells, determining
 * the bottom border and height based on the row position.
 */
export const getStylesBasedOnHeader = (
  rowIndex: number,
  fixedRowCount: number
) => {
  const isLastRow = rowIndex === fixedRowCount - 1;
  return {
    borderBottomWidth: isLastRow ? 2 : 1,
    borderBottomColor: isLastRow ? colors.medium : colors.lighter,
    height: isLastRow ? 22 : 23,
  };
};
