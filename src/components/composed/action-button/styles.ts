import { CSSProperties } from "react";
import { colors } from "../../../assets/colors";

type StyleObject = CSSProperties;

const BORDER_RADIUS = 8;
const CARD_PADDING = 16;
const DISABLED_OPACITY = 0.25;
const FULL_HEIGHT_OFFSET = "calc(100% - 2rem)";

export const styles: Record<string, StyleObject> = {
  card: {
    backgroundColor: colors.lighter,
    borderRadius: BORDER_RADIUS,
    padding: CARD_PADDING,
    height: FULL_HEIGHT_OFFSET,
  },
  disabledCard: {
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
    borderRadius: 16,
    height: 32,
    textTransform: "none",
    paddingLeft: 32,
    paddingRight: 32,
    backgroundColor: colors.action,
  },
};
