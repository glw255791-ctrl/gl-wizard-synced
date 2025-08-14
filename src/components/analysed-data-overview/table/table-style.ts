import { CommonProps } from "@mui/material/OverridableComponent";

import { colors } from "../../../assets/colors";
import { AnyType } from "./functions";
export const styles: Record<string, CommonProps["style"]> = {
  root: {},
  tableScrollableWrapper: {
    minWidth: 1200,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.medium,
  },
  tableContainer: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    overflowY: "hidden",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    height: 30,
  },
  headerTableCell: {
    width: 150,
    minWidth: 150,
    maxWidth: 150,
    padding: "2px 4px",
    flex: 1,
    fontSize: 10,
    borderBottom: `1px solid ${colors.medium}`,
    borderRight: `1px solid ${colors.medium}`,
    display: "flex",
    backgroundColor: colors.powderBlue,
    alignItems: "center",
  },
  headerTableCellText: {
    fontSize: 10,
    cursor: "pointer",
  },
  headerCheckboxCell: {
    width: 150,
    minWidth: 150,
    maxWidth: 150,
    padding: "2px 4px",
    flex: 1,
    borderBottom: `1px solid ${colors.medium}`,
    borderRight: `1px solid ${colors.medium}`,
    backgroundColor: colors.powderBlue,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  tableRowOverview: {
    display: "flex",
  },
  tableHeader: {
    width: "calc(100vw - 28rem)",
    padding: "1rem",
    backgroundColor: colors.medium,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.lighter,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  selectedRow: {
    backgroundColor: colors.fairyTale,
  },
  excelBtn: {
    width: 200,
    borderRadius: 8,
    backgroundColor: colors.action,
  },
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
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  autosizerWrapper: {
    width: "100%",
    overflow: "auto",
    maxHeight: 600,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
  },
  checkedIcon: { color: "green", fontSize: 17 },
  uncheckedIcon: { color: "red", fontSize: 17 },
  rowLabelCell: { flexDirection: "row", gap: 5, alignItems: "center" },
  cellDownloadBtn: { color: colors.action, fontSize: 16 },
  iconBtn: { padding: 0 },
  rowLabelWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

export const getStylesBasedOnColumn = (
  column: string,
  row: Record<string, AnyType>,
  mappingValue: string,
  selectedRow?: string
) => {
  const isSideHeader = column === "sideHeader";
  const isTotalColumn = column === "total";
  const isSelectedRow = selectedRow === row.sideHeader;
  const isBoldRow =
    isTotalColumn ||
    isSideHeader ||
    row.sideHeader === "Total" ||
    row.sideHeader === mappingValue;

  return {
    backgroundColor: isSideHeader
      ? isSelectedRow
        ? colors.medium
        : colors.lighter
      : ((isTotalColumn ? colors.lighter : row.bg) as string),

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

export const getStylesBasedOnHeader = (
  rowIndex: number,
  sortedDataDisplayHeader: Record<string, AnyType>[]
) => {
  const lastIndex = Object.keys(sortedDataDisplayHeader[0]).length - 1;
  const isLastRow = rowIndex === lastIndex;

  return {
    borderBottomWidth: isLastRow ? 2 : 1,
    borderBottomColor: isLastRow ? colors.medium : colors.lighter,
    height: isLastRow ? 22 : 23,
  };
};
