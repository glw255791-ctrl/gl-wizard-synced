import { CSSProperties } from "react";

type StyleObject = CSSProperties;

export const styles: Record<string, StyleObject> = {
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
  message: {
    color: "black",
    textAlign: "center",
  },
  highlight: {
    color: "black",
    fontWeight: "bold",
  },
  modalContentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 15,
    padding: 15,
  },
  title: {
    textAlign: "center",
    color: "black",
    flex: 1,
    fontWeight: "bold",
    fontSize: 20,
  },
};
