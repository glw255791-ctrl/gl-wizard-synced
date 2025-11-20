import { CommonProps } from "@mui/material/OverridableComponent";
import { Stack, styled, Typography } from "@mui/material";
import { colors } from "../../assets/colors";

// Styled components
export const SummaryWrapper = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  paddingRight: 30,
  justifyContent: "space-between",
});

export const Title = styled(Typography)({
  fontWeight: "bold",
});

export const AccordionContent = styled(Stack)({
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-end",
  paddingBottom: 15,
});

// Centralized style object for layout and overrides
export const styles: Record<string, CommonProps["style"]> = {
  root: {},

  accordionRoot: {
    backgroundColor: colors.lighter,
    borderRadius: 8,
  },

  disabled: {
    opacity: 0.25,
    pointerEvents: "none",
  },

  accordionContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 15,
  },

  accordionHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 15,
    alignItems: "flex-end",
  },

  dropdownWrapper: {
    width: 250,
  },

  tablesStack: {
    gap: 30,
  },

  button: {
    borderRadius: 8,
  },

  summaryWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingRight: 30,
    justifyContent: "space-between",
  },

  optionsWrapper: {
    maxHeight: 200,
    overflow: "auto",
    padding: 5,
    marginBottom: 10,
  },

  optionsBtn: {
    padding: 2,
    fontSize: 11,
    backgroundColor: colors.medium,
    color: "white",
  },

  topBtn: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    borderRadius: 8,
    backgroundColor: colors.action,
    zIndex: 100,
  },
};
