import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";


export const RootStack = styled(Stack)(() => ({
  width: "calc(100vw - 24rem)",
  minHeight: "calc(100vh - 4rem)",
  justifyContent: "flex-start",
}));
