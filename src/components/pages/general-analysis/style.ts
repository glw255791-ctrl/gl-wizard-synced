import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { Card } from "@mui/material";
import { theme } from "../../../constants/theme";

export const RootStack = styled(Stack)(() => ({
  width: "100%",
  minHeight: 0,
  justifyContent: "flex-start",
}));

export const CardStyled = styled(Card)(() => ({
  backgroundColor: theme.colors.lighter,
  border: `1px solid ${theme.colors.surface}`,
  boxShadow: "none",
  borderRadius: theme.borderRadius.sm,
  "&&": {
    padding: "0.7rem 1rem",
    overflow: "visible",
  },
  flexDirection: "row",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.gap.lg,

  "& > :first-child": {
    flex: "1 1 auto",
    minWidth: 0,
  },

  "& > :last-child": {
    flexShrink: 0,
    marginLeft: "auto",
  },
}));
