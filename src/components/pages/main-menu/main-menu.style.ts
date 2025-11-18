import React from "react";
import { colors } from "../../../assets/colors";
export const styles: Record<string, React.CSSProperties> = {
  root: {
    flex: 1,
    height: "calc(100vh - 4rem)",
    justifyContent: "flex-start",
    gap: "2rem",
    padding: "2rem",
  },
  button: {
    width: "100%",
    height: "15rem",
    borderRadius: 16,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    backgroundColor: colors.lighter,
  },
  image: {
    width: 30,
    height: "auto",
  },
  label: {
    color: "#3d9970",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  btnLabel: {
    fontWeight: "bold",
    color: colors.darker,
    fontSize: "1.25rem",
  },
};
