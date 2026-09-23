import { styled, Stack, Typography, Button } from "@mui/material";
import { theme } from "../../../constants/theme";

export const Banner = styled(Stack)({
  height: 68,
  flexShrink: 0,
  flexDirection: "row",
  alignItems: "center",
  gap: "0.85rem",
  padding: "0 1.15rem",
  backgroundImage: "linear-gradient(90deg, #356F73 0%, #5A9298 100%)",
  color: theme.colors.white,
  borderBottom: "4px solid #B8C96B",
});

export const BannerLogoWrap = styled("span")({
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor: theme.colors.white,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

export const BannerLogo = styled("img")({
  height: 34,
  width: 34,
  objectFit: "contain",
});

export const BannerTitle = styled(Typography)({
  fontSize: "1.35rem",
  fontWeight: 700,
  letterSpacing: "0.02em",
  color: theme.colors.white,
});

export const BannerButton = styled(Button)({
  minWidth: 46,
  width: 46,
  height: 46,
  borderRadius: "999px",
  color: theme.colors.white,
  padding: 0,
  margin: "0 0 0.5rem 0.65rem",
  alignSelf: "flex-start",

  "& .MuiSvgIcon-root": {
    fontSize: 28,
  },

  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
});

export const Root = styled(Stack)({
  width: "100%",
  height: "100vh",
  overflow: "hidden",
  boxSizing: "border-box",
  justifyContent: "flex-start",
  backgroundColor: "#E5E9E8",
});

export const Row = styled(Stack)({
  flexDirection: "row",
  width: "100%",
  flex: 1,
  minWidth: 0,
  minHeight: "calc(100vh - 68px)",
  alignItems: "stretch",
});

export const Left = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})<{ collapsed?: boolean }>(({ collapsed }) => ({
  width: collapsed ? 84 : 280,
  flexShrink: 0,
  backgroundImage: "linear-gradient(180deg, #356F73 0%, #2F6368 55%, #5A9298 100%)",
  borderRight: "none",
  height: "calc(100vh - 68px)",
  boxSizing: "border-box",
  alignItems: collapsed ? "center" : "stretch",
  padding: "1rem 0",
  overflow: "hidden",
  transition: "width 0.2s ease",

  ...(collapsed
    ? {
        "& .MuiButton-root": {
          width: 52,
          minWidth: 52,
          height: 52,
          margin: "0 auto",
          padding: 0,
          justifyContent: "center",
        },
        "& .nav-active": {
          width: "calc(100% - 0.35rem)",
          minWidth: 0,
          marginLeft: "0.35rem",
          marginRight: 0,
          padding: 0,
          borderRadius: "999px 0 0 999px",
          backgroundColor: "#E5E9E8",
          color: theme.colors.black,
          justifyContent: "center",
        },
        "& .MuiButton-startIcon": {
          margin: 0,
        },
        "& .MuiSvgIcon-root": {
          fontSize: 26,
        },
      }
    : {}),
}));

export const Content = styled(Stack)({
  flex: 1,
  minWidth: 0,
  minHeight: "calc(100vh - 68px)",
  justifyContent: "flex-start",
  gap: theme.gap.lg,
  padding: theme.padding.lg,
  boxSizing: "border-box",
});

export const MenuBtn = styled(Button)({
  justifyContent: "flex-start",
  fontSize: "1.05rem",
  fontWeight: 600,
  backgroundColor: "transparent",
  color: theme.colors.white,
  width: "calc(100% - 1rem)",
  margin: "0 0.5rem",
  textTransform: "unset",
  borderRadius: "999px",
  height: 48,
  boxShadow: "none",
  border: "none",

  "& .MuiSvgIcon-root": {
    fontSize: 24,
  },

  "& .MuiButton-startIcon": {
    marginRight: 12,
  },

  "&.MuiButton-contained": {
    backgroundColor: "transparent",
    boxShadow: "none",
    color: theme.colors.white,
  },

  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
});

export const MenuBtnActive = styled(MenuBtn)({
  color: theme.colors.black,
  fontWeight: 700,
  backgroundColor: "#E5E9E8",
  width: "calc(100% - 0.5rem)",
  marginRight: 0,
  borderRadius: "999px 0 0 999px",

  "&.MuiButton-contained": {
    backgroundColor: "#E5E9E8",
    color: theme.colors.black,
    boxShadow: "none",
  },
});

export const Title = styled(Typography)({
  fontSize: "1.35rem",
  fontWeight: 700,
  letterSpacing: "0.01em",
  color: theme.colors.black,
});

export const BtnGroupsWrapper = styled(Stack)({
  flex: 1,
  minHeight: 0,
  width: "100%",
  paddingTop: theme.padding.sm,
  gap: theme.gap.md,
});

export const TopBtns = styled(Stack)({
  textAlign: "left",
  gap: "0.15rem",
  padding: `${theme.padding.md} 0`,
});

export const BottomBtns = styled(Stack)({
  gap: "0.15rem",
  paddingTop: theme.padding.sm,
  borderTop: "1px solid rgba(255, 255, 255, 0.28)",
  margin: "0 0.75rem",
});
