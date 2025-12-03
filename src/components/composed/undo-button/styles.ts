import { colors } from "../../../assets/colors";
import { Button, Stack, styled } from "@mui/material";

export const ButtonsWrapper = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
});

export const StyledButton = styled(Button)({
  borderRadius: 16,
  height: 32,
  textTransform: "none",
  paddingLeft: 32,
  paddingRight: 32,
  backgroundColor: colors.action,
});
