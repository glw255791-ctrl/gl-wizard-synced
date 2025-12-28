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
