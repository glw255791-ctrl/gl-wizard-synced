import { styled, Button, Stack, Typography, Grid2 } from "@mui/material";
import { colors } from "../../../assets/colors";

export const Root = styled(Stack)({
  flex: 1,
  width: "calc(100vw - 24rem)",
  height: "calc(100vh - 4rem)",
  justifyContent: "flex-start",
  gap: "1rem",
});

export const ButtonsWrapper = styled(Grid2)({
  padding: "1rem 0.5rem",
})

export const StyledMenuButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'bgImage' })(({ bgImage }: { bgImage: string }) => ({
  width: "100%",
  height: "15rem",
  borderRadius: '1rem 0 0 1rem',
  fontSize: '1.2rem',
  fontWeight: "bold",
  color: colors.white,
  position: "relative",
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  justifyContent: "flex-end",
  alignItems: "flex-end",
  paddingBottom: "1rem",
  paddingRight: "1rem",
  transition: "background-image 0.5s, font-size 0.5s, border-right 0.5s",
  borderRight: `4px solid ${colors.darker}`,
  textTransform: "none",
  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage})`,

  '&:hover': {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})`,
    borderRightWidth: 12,
  },
}));

export const MenuImage = styled("img")({
  width: 30,
  height: "auto",
});

export const MenuLabel = styled(Typography)({
  color: colors.oliveGreen,
  fontWeight: "bold",
  fontSize: "1.5rem",
});

export const LogoWrapper = styled(Stack)({
  justifyContent: "center",
  alignItems: "center",
});

export const BtnLabel = styled(Typography)({
  fontWeight: "bold",
  color: colors.lighter,
  fontSize: "1.25rem",
});
