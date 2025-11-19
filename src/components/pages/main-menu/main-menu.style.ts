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
    borderRadius: '1rem 0 0 1rem',
    fontSize: '1.2rem',
    fontWeight: "bold",
    color: "white",
    position: "relative",
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: "1rem",
    paddingRight: "1rem",
    transition: "background-image 0.5s, font-size 0.5s, border-right 0.5s",
    borderRight: `4px solid ${colors.darker}`,
    textTransform: "none",
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
    color: colors.lighter,
    fontSize: "1.25rem",
  },
};
