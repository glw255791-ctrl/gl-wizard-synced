import { styled, Button, Stack, Typography, Grid2 } from "@mui/material";
import { theme } from "../../../constants/theme";

export const Root = styled(Stack)({
  flex: 1,
  width: "calc(100vw - 24rem)",
  height: "calc(100vh - 4rem)",
  justifyContent: "flex-start",
  gap: theme.gap.lg,
});

export const ButtonsWrapper = styled(Grid2)({
  padding: `${theme.padding.lg} ${theme.padding.sm}`,
});

export const StyledMenuButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "bgImage",
})(({ bgImage }: { bgImage: string }) => ({
  width: "100%",
  height: "15rem",
  borderRadius: `${theme.borderRadius.lg} 0 0 ${theme.borderRadius.lg}`,
  fontSize: theme.fontSize.lg,
  fontWeight: "bold",
  color: theme.colors.white,
  position: "relative",
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  justifyContent: "flex-end",
  alignItems: "flex-end",
  paddingBottom: theme.padding.lg,
  paddingRight: theme.padding.lg,
  transition: "background-image 0.5s, font-size 0.5s, border-right 0.5s",
  borderRight: `${theme.borderWidth.md} solid ${theme.colors.darker}`,
  textTransform: "none",
  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage})`,

  "&:hover": {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})`,
    borderRightWidth: 12,
  },
}));

export const MenuImage = styled("img")({
  width: 30,
  height: "auto",
});

export const LogoWrapper = styled(Stack)({
  justifyContent: "center",
  alignItems: "center",
});

export const BtnLabel = styled(Typography)({
  fontWeight: "bold",
  color: theme.colors.lighter,
  fontSize: theme.fontSize.lg,
});
