import { CSSProperties } from "react";

type StyleObject = CSSProperties;

const BORDER_RADIUS = 8;
const CARD_PADDING = 16;
const DISABLED_OPACITY = 0.25;
const FULL_HEIGHT_OFFSET = "calc(100% - 2rem)";

export const styles: Record<string, StyleObject> = {
  root: {
    width: "calc(100vw - 24rem)",
    minHeight: "calc(100vh - 4rem)",
    justifyContent: "flex-start",
  },
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
  dropzoneWrapper: {
    height: "100%",
  },
  divider: {
    height: "70%",
    width: 1,
    backgroundColor: "gray",
  },
  disabled: {
    opacity: DISABLED_OPACITY,
    pointerEvents: "none",
  },
  reviewsWrapper: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    gap: "1rem",
  },
  reviewLabel: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: "0.25rem",
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
  linearProgress: {
    height: 16,
    borderRadius: BORDER_RADIUS,
    width: "100%",
  },
  button: {
    borderRadius: BORDER_RADIUS,
    width: "100%",
  },
  table: {
    backgroundColor: "white",
    borderRadius: BORDER_RADIUS,
  },
  accordionRoot: {
    borderRadius: BORDER_RADIUS,
  },
};
