import { CommonProps } from "@mui/material/OverridableComponent";
import { colors } from "../../../assets/colors";

const VALUE = "value";
const RESULT = "result";
const ACCOUNT = "account";
const REVERSAL = "reversal";

export const styles: Record<string, CommonProps["style"]> = {
  root: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.medium,
  },
  tableHeader: {
    width: "calc(100vw - 28rem + 1px)",
    padding: "1rem",
    backgroundColor: colors.medium,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  downloadBtn: {
    borderRadius: 8,
    width: 200,
    backgroundColor: colors.action,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
    borderRightWidth: 1,
    borderRightColor: colors.honeydew,
    fontWeight: "initial",
    textAlign: "left",
    borderBottomWidth: 1,
    borderBottomColor: colors.honeydew,
    height: 23,
  },
  headerCell: {
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    flex: 1,
    textAlign: "left",
    padding: "0 5px",
    borderRightWidth: 1,
    borderRightColor: colors.lighter,
    fontWeight: "bold",
    justifyContent: "center",
    backgroundColor: colors.medium,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.lighter,
    height: 22,
  },
  autoSizer: {
    width: "100%",
    height: 600,
    backgroundColor: colors.medium,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  headerWrapper: { margin: 0, height: 24, marginRight: 0.5 },
  columnStyle: { margin: 0, backgroundColor: "white" },
};

export const getCellStyleByHeader = (key: string): React.CSSProperties => {
  switch (key) {
    case VALUE:
      return { textAlign: "right" };
    case RESULT:
      return {
        fontWeight: "bold",
        backgroundColor: colors.lighter,
      };
    case REVERSAL:
      return {
        fontWeight: "bold",
        backgroundColor: colors.lighter,
      };
    case ACCOUNT:
      return { fontWeight: "bold" };
    default:
      return {};
  }
};
