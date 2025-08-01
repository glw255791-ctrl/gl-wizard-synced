const BORDER_RADIUS = 8;
const CARD_PADDING = 16;
const DISABLED_OPACITY = 0.25;
const FULL_HEIGHT_OFFSET = "calc(100% - 2rem)";

export const styles = {
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
  root: {
    border: "2px dashed #ccc",
    borderRadius: "8px",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
};
