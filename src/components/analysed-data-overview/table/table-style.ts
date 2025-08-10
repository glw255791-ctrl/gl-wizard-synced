import { CommonProps } from "@mui/material/OverridableComponent";

import { colors } from "../../../assets/colors";
import { AnyType } from "./functions";
export const styles: Record<string, CommonProps["style"]> = {
  root: {},
  tableScrollableWrapper: {
    minWidth: 1200,
    borderRadius: 8,
    border: "1px solid #B8E0D2",
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
  headerSideCell: {
    fontWeight: "bold",
    width: 150,
    minWidth: 150,
    maxWidth: 150,
    padding: "2px 4px",
    flex: 1,
    fontSize: 10,
    borderBottom: `1px solid ${colors.powderBlue}`,
    borderRight: `1px solid ${colors.powderBlue}`,
    display: "flex",
    backgroundColor: colors.vistaBlue,
    alignItems: "center",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    height: 30,
  },
  totalCell: {
    width: 150,
    minWidth: 150,
    maxWidth: 150,
    borderRight: `1px solid ${colors.powderBlue}`,
    flexDirection: "row",
    borderBottom: `1px solid ${colors.powderBlue}`,
    display: "flex",
    textAlign: "start",
    alignItems: "center",
    fontWeight: "bold",
    padding: 4,
    backgroundColor: colors.vistaBlue,
  },
  headerTableCell: {
    width: 150,
    minWidth: 150,
    maxWidth: 150,
    padding: "2px 4px",
    flex: 1,
    fontSize: 10,
    borderBottom: `1px solid ${colors.vistaBlue}`,
    borderRight: `1px solid ${colors.vistaBlue}`,
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
    borderBottom: `1px solid ${colors.vistaBlue}`,
    borderRight: `1px solid ${colors.vistaBlue}`,
    backgroundColor: colors.powderBlue,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  tableCell: {
    width: 150,
    minWidth: 150,
    maxWidth: 150,
    borderRight: `1px solid ${colors.vistaBlue}`,
    flexDirection: "row",
    borderBottom: `1px solid ${colors.vistaBlue}`,
    display: "flex",
    textAlign: "start",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 4,
  },
  tableRowOverview: {
    display: "flex",
  },
  tableHeader: {
    width: "calc(100vw - 10rem)",
    padding: "1rem",
    backgroundColor: `${colors.vistaBlue}`,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `2px solid ${colors.tifanyBlue}`,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  selectedRow: {
    backgroundColor: colors.fairyTale,
  },
  excelBtn: {
    backgroundClip: colors.excelBtn,
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
    height: 600,
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
        ? colors.fairyTale
        : colors.powderBlue
      : ((isTotalColumn ? colors.powderBlue : row.bg) as string),

    borderRightWidth: isSideHeader ? 2 : 1,
    borderRightColor: isSideHeader ? "gray" : colors.honeydew,
    fontWeight: isBoldRow ? "bold" : "initial",
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
    borderBottomColor: isLastRow ? "gray" : colors.honeydew,
    height: isLastRow ? 22 : 23,
  };
};
