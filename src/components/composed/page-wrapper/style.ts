import React from "react";
import { colors } from "../../../assets/colors";
export const styles: Record<string, React.CSSProperties> = {
  root: {
    width: "calc(100vw - 5rem)",
    height: "calc(100vh - 4rem)",
    justifyContent: "flex-start",
    gap: "1rem",
    padding: "1rem",
  },
  row: {
    flexDirection: "row",
    gap: "1rem",
  },
  left: {
    width: 300,
    backgroundColor: `${colors.darker}CC`,
    borderRadius: 8,
    height: "calc(100% - 3rem)",
    minHeight: "calc(100vh - 5rem)",
    alignItems: "center",
    padding: "1rem 0",
  },
  content: {
    minHeight: "calc(100vh - 5rem)",
    justifyContent: "flex-start",
    gap: "1rem",
    paddingBottom: "1rem",
  },
  menuBtn: {
    justifyContent: "flex-start",
    fontSize: "0.99rem",
    backgroundColor: `${colors.darker}CC`,
    color: colors.lighter,
    width: "100%",
    textTransform: "unset",
    borderRadius: 0,
    height: 45,
    transition: "font-size 0.5s",
    borderBottom: '2px solid transparent',
    borderLeft: '4px solid transparent',

  },
  menuBtnActive: {
    color: "white",
    fontWeight: "bold",
    borderLeft: '4px solid #E5F1F1',
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: colors.lighter,
  },
  btnGroupsWrapper: {
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
    paddingTop: "1rem",
  },
  topBtns: {
    textAlign: "left",
    gap: 2,
    padding: "1.5rem 0",
    flex: 1,
  },
  bottomBtns: {
    gap: 2
  },
};
