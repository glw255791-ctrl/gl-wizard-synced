import { CSSProperties } from "react";
import { colors } from "../../../assets/colors";

type StyleObject = CSSProperties;

const BORDER_RADIUS = 8;
const CARD_PADDING = 16;
const DISABLED_OPACITY = 0.25;
const FULL_HEIGHT_OFFSET = "calc(100% - 2rem)";

export const styles: Record<string, StyleObject> = {
  card: {
    backgroundColor: "white",
    borderRadius: BORDER_RADIUS,
    padding: CARD_PADDING,
    height: FULL_HEIGHT_OFFSET,
  },
  disabledCard: {
    backgroundColor: "white",
    borderRadius: BORDER_RADIUS,
    padding: CARD_PADDING,
    height: FULL_HEIGHT_OFFSET,
    opacity: DISABLED_OPACITY,
    pointerEvents: "none",
  },
  buttonsWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "1rem",
  },
  progressAndBtnWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  button: {
    borderRadius: BORDER_RADIUS,
    width: "100%",
    backgroundColor: colors.action,
  },
};
