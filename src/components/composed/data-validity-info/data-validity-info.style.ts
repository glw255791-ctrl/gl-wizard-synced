import { CommonProps } from "@mui/material/OverridableComponent";
import { colors } from "../../../assets/colors";

export const styles: Record<string, CommonProps["style"]> = {
  root: {
    backgroundColor: colors.lighter,
    borderRadius: 8,
    padding: 16,
    height: "calc(100% - 2rem)",
  },
  reviewsWrapper: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    gap: "1rem",
  },
  reviewLabel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: "0.25rem",
    flex: 2,
  },
  disabled: {
    opacity: 0.25,
    pointerEvents: "none",
  },
  widerLabel: {
    flex: 3,
  },
  errorWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
    width: "100%",
  },
  error: {
    color: "red",
  },
};
