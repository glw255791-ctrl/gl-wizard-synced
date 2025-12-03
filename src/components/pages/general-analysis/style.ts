import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { Card } from "@mui/material";
import { colors } from "../../../assets/colors";

export const RootStack = styled(Stack)(() => ({
  width: "calc(100vw - 24rem)",
  minHeight: "calc(100vh - 4rem)",
  justifyContent: "flex-start",
}));

export const CardStyled = styled(Card)(() => ({
  backgroundColor: colors.lighter,
  borderRadius: 8,
  padding: 16,
  flexDirection: "row",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
}));
