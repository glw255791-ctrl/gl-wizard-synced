import { colors } from "../../../assets/colors";
import React from "react";
export const styles: Record<string, React.CSSProperties> = {
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  headerBtnsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  card: {
    backgroundColor: "#4F6367",
    borderRadius: 8,
    padding: 16,
    marginTop: 5
  },
  title: {
    fontWeight: "bold",
    color: colors.lighter,
    fontSize: "1.25rem",
  },

  name: {
    fontWeight: "bold",
    paddingRight: "1rem",
    color: colors.lighter,
    paddingTop: 2,
    paddingLeft: 3,
  },

  root: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start",
  },
};
