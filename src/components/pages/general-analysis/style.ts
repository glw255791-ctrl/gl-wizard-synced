import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { Card } from "@mui/material";
import { theme } from "../../../constants/theme";

export const RootStack = styled(Stack)(() => ({
  width: "calc(100vw - 24rem)",
  minHeight: "calc(100vh - 4rem)",
  justifyContent: "flex-start",
}));

export const CardStyled = styled(Card)(() => ({
  backgroundColor: theme.colors.lighter,
  borderRadius: theme.borderRadius.sm,
  padding: theme.padding.lg,
  flexDirection: "row",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.gap.lg,
}));
