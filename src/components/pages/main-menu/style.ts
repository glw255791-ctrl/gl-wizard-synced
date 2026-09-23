import { styled, Button, Stack, Typography, Grid2 } from "@mui/material";
import { theme } from "../../../constants/theme";

export const Root = styled(Stack)({
  flex: 1,
  width: "100%",
  minWidth: 0,
  height: "100%",
  justifyContent: "flex-start",
  gap: theme.gap.lg,
});

export const MenuPanel = styled(Stack)({
  flex: 1,
  minHeight: 0,
  backgroundColor: theme.colors.lighter,
  border: "1px solid #E4F0F0",
  borderRadius: theme.borderRadius.md,
  padding: "1.25rem",
  gap: theme.gap.md,
  boxShadow: "none",
});

export const PanelIntro = styled(Stack)({
  backgroundColor: "#E8EFCB",
  borderRadius: theme.borderRadius.sm,
  padding: "0.85rem 1rem",
  gap: "0.2rem",
});

export const PanelHeading = styled(Typography)({
  fontSize: "1.45rem",
  fontWeight: 600,
  letterSpacing: "0.01em",
  color: theme.colors.black,
});

export const PanelText = styled(Typography)({
  fontSize: "1.05rem",
  fontWeight: 400,
  color: theme.colors.medium,
  marginTop: "-0.15rem",
});

export const ButtonsWrapper = styled(Grid2)({
  flex: 1,
  alignContent: "stretch",
});

export const StyledMenuButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "bgImage" && prop !== "accent",
})(({ bgImage, accent = "#B8C96B" }: { bgImage: string; accent?: string }) => ({
  width: "100%",
  height: "calc((100vh - 18rem) / 2)",
  minHeight: "12rem",
  padding: 0,
  borderRadius: theme.borderRadius.md,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  textTransform: "none",
  overflow: "hidden",
  backgroundColor: theme.colors.lighter,
  border: "1px solid #E4F0F0",
  borderBottom: `4px solid ${accent}`,
  boxShadow: "none",
  color: theme.colors.black,

  "&:hover": {
    borderColor: accent,
    borderBottomColor: accent,
    boxShadow: "none",
    backgroundColor: theme.colors.lighter,
  },

  "& .card-photo": {
    flex: 1,
    width: "100%",
    minHeight: "8rem",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
}));

export const CardCopy = styled(Stack)({
  alignItems: "flex-start",
  gap: "0.15rem",
  padding: "0.75rem 1rem 0.85rem",
  backgroundColor: theme.colors.lighter,
});

export const CardTitle = styled(Typography)({
  fontSize: "1.15rem",
  fontWeight: 600,
  letterSpacing: "0.01em",
  color: theme.colors.black,
  textAlign: "left",
});

export const CardHint = styled(Typography)({
  fontSize: "0.95rem",
  fontWeight: 400,
  color: theme.colors.medium,
  textAlign: "left",
});

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
