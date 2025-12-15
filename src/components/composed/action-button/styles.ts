import { Button, Stack, styled } from "@mui/material";
import { theme } from "../../../constants/theme";

export const ButtonsWrapper = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.gap.lg,
});

export const StyledButton = styled(Button)({
  borderRadius: theme.borderRadius.lg,
  height: theme.height.input,
  textTransform: "none",
  paddingLeft: theme.padding.lg,
  backgroundColor: theme.colors.action,
});
