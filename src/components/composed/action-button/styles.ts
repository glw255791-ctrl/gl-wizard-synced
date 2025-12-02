import { colors } from "../../../assets/colors";
import { Button, Card, Stack, styled } from "@mui/material";


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

export const CardStyled = styled(Card, { shouldForwardProp: (prop) => prop !== 'disabled' })(({ disabled }: { disabled: boolean }) => ({
  backgroundColor: colors.lighter,
  borderRadius: 8,
  padding: 16,
  height: "calc(100% - 2rem)",
  ...(disabled && {
    opacity: 0.25,
    pointerEvents: "none",
  }),
}));

