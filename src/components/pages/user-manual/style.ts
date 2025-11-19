import React from "react";
import { colors } from "../../../assets/colors";
export const styles: Record<string, React.CSSProperties> = {
  root: {
    gap: "1rem", width: "calc(100vw - 24rem)"
  },
  buttonsWrapper: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    height: 60,
    backgroundColor: colors.lighter,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    padding: "8px 16px",
    gap: 15,
    justifyContent: "space-between",
    color: colors.darker
  },
  icon: {
    color: colors.darker
  }
};
