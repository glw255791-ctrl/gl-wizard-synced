import { CommonProps } from "@mui/material/OverridableComponent";
import { colors } from "../../../assets/colors";

const VALUE = "value";
const RESULT = "result";
const ACCOUNT = "account";

export const styles: Record<string, CommonProps["style"]> = {
  root: {
    borderRadius: 8,
    border: `1px solid ${colors.vistaBlue}`,
  },
  tableHeader: {
    width: "calc(100vw - 10rem)",
    padding: "1rem",
    backgroundColor: colors.vistaBlue,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `2px solid ${colors.tifanyBlue}`,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  downloadBtn: {
    borderRadius: 8,
    width: 200,
    backgroundColor: "#1D6F42",
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
    borderRightColor: colors.honeydew,
    fontWeight: "bold",
    justifyContent: "center",
    backgroundColor: colors.powderBlue,
    borderBottomColor: "gray",
    borderBottomWidth: 2,
    height: 22,
  },
  autoSizer: {
    width: "100%",
    height: 600,
  },
  headerWrapper: { margin: 0, height: 24 },
  columnStyle: { margin: 0 },
};

export const getCellStyleByHeader = (key: string): React.CSSProperties => {
  switch (key) {
    case VALUE:
      return { textAlign: "right" };
    case RESULT:
      return {
        fontWeight: "bold",
        backgroundColor: colors.powderBlue,
      };
    case ACCOUNT:
      return { fontWeight: "bold" };
    default:
      return {};
  }
};
