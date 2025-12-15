import { CommonProps } from "@mui/material/OverridableComponent";
import { Accordion, Stack, styled, Typography } from "@mui/material";
import { theme } from "../../constants/theme";

// Styled components
export const SummaryWrapper = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  paddingRight: theme.spacing.xl,
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
  paddingBottom: theme.spacing.lg,
});

export const AccordionHeaderStack = styled(Stack)({
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: theme.spacing.lg,
  alignItems: "flex-end",
});

export const DropdownWrapperStack = styled(Stack)({
  width: theme.width.dropdown,
});

export const TablesStack = styled(Stack)({
  gap: theme.spacing.xl,
});

export const StyledAccordionWrapper = styled(Accordion, {
  shouldForwardProp: (prop) => prop !== "disabled",
})<{ disabled?: boolean }>(({ disabled }) => ({
  backgroundColor: theme.colors.lighter,
  borderRadius: theme.borderRadius.sm,
  opacity: disabled ? theme.opacity.disabled : 1,
  pointerEvents: disabled ? "none" : "auto",
}));

// Legacy styles object kept for backward compatibility
// Most styles have been migrated to styled components above
export const styles: Record<string, CommonProps["style"]> = {
  optionsWrapper: {
    maxHeight: theme.height.maxHeight,
    overflow: "auto",
    padding: theme.gap.md,
    marginBottom: theme.gap.lg,
  },

  optionsBtn: {
    padding: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    backgroundColor: theme.colors.medium,
    color: theme.colors.white,
  },

  topBtn: {
    position: "fixed",
    bottom: theme.position.topButton.bottom,
    right: theme.position.topButton.right,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.action,
    zIndex: theme.zIndex.topButton,
  },
};
