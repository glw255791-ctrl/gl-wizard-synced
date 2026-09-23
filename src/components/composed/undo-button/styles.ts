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
  minHeight: theme.height.input,
  boxSizing: "border-box",
  textTransform: "none",
  padding: "0 1rem",
  boxShadow: "none",
  border: "none",
  backgroundColor: theme.colors.action,
  color: theme.colors.black,
  whiteSpace: "nowrap",

  "&:hover": {
    backgroundColor: theme.colors.action,
    boxShadow: "none",
  },
});
