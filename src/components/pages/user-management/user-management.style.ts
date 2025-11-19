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
    gap: 5,
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
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  modalInnerContent: {
    flex: 1,
    width: "100%",
    padding: 0,
    justifyContent: "flex-start",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 15px",
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    borderBottomColor: colors.darker
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
  modalBtnsWrapper: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtn: {
    height: 32, borderRadius: 16, paddingLeft: 32, paddingRight: 32, textTransform: "none"
  },
  modalInput: {
    height: 32, borderRadius: 16,
  },
  modalInputWrapper: {
    width: "80%",
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
    borderRadius: 16,
  },
  searchInput: {
    borderRadius: 16,
    height: 30,
  },
  btn: {
    borderRadius: 16,
    height: 32,
    backgroundColor: colors.action,
    paddingLeft: 32,
    paddingRight: 32,
    textTransform: "none",
  },
  table: {
    backgroundColor: colors.lighter,
    borderRadius: 8,
  },
};
