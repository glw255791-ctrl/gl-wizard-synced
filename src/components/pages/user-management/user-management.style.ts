import { CommonProps } from "@mui/material/OverridableComponent";
import { colors } from "../../../assets/colors";

export const styles: Record<string, CommonProps["style"]> = {
  root: {
    width: "calc(100vw - 24rem)",
    minHeight: "calc(100vh - 4rem)",
    justifyContent: "flex-start",
    gap: "1rem",
  },
  validDate: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  red: {
    color: "red",
  },
  green: {
    color: "green",
  },
  columnHeader: {
    fontWeight: "bold",
  },
  modalContent: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: "15px 0",
  },
  modalInnerContent: {
    flex: 1,
    width: "100%",
    padding: 0,
    justifyContent: "flex-start",
  },
  modalHeader: {
    height: "30px",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 15px 15px 15px",
    borderBottom: "1px solid gray",
  },
  black: {
    color: "black",
  },
  modalContentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 30,
    padding: "30px 0",
  },
  input: {
    width: "50%",
  },
  searchBlock: {
    flex: 1,
    maxHeight: "60px",
    backgroundColor: colors.lighter,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    padding: "8px 16px",
    gap: 15,
    justifyContent: "space-between",
  },
  searchField: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
  },
  searchInput: {
    borderRadius: 8,
    height: 40,
  },
  btn: {
    borderRadius: 8,
    backgroundColor: colors.action,
    width: 200,
  },
  table: {
    backgroundColor: colors.lighter,
    borderRadius: 8,
  },
};
