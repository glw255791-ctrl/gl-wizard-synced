import { styled, Stack, Typography, Button } from "@mui/material";
import { theme } from "../../../constants/theme";

export const Banner = styled(Stack)({
  height: 68,
  flexShrink: 0,
  position: "relative",
  flexDirection: "row",
  alignItems: "center",
  gap: "0.85rem",
  padding: "0 1.15rem",
  backgroundImage: `linear-gradient(90deg, ${theme.colors.deepTeal} 0%, ${theme.colors.freshBlue} 100%)`,
  color: theme.colors.cleanWhite,
  zIndex: 2,
  boxShadow: "0 3px 6px rgba(57, 66, 67, 0.28), 0 12px 24px rgba(57, 66, 67, 0.22)",
});

export const BannerLogo = styled("img")({
  height: 52,
  width: 52,
  objectFit: "contain",
  flexShrink: 0,
});

export const BannerTitle = styled(Typography)({
  fontSize: "1.35rem",
  fontWeight: 700,
  letterSpacing: "0.02em",
  color: theme.colors.cleanWhite,
});

export const BannerAccount = styled(Stack)({
  marginLeft: "auto",
  flexDirection: "row",
  alignItems: "center",
  gap: "0.35rem",
  color: theme.colors.cleanWhite,
});

export const BannerAccountName = styled(Stack)({
  alignItems: "flex-start",
  lineHeight: 1.15,
  fontSize: "0.95rem",
  fontWeight: 600,

  "& .account-meta": {
    fontSize: "0.75rem",
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.78)",
  },

  "@media (max-width: 700px)": {
    display: "none",
  },
});

export const BannerAccountButton = styled(Button)({
  minWidth: 40,
  width: 40,
  height: 40,
  borderRadius: "999px",
  color: theme.colors.cleanWhite,
  padding: 0,

  "& .MuiSvgIcon-root": {
    fontSize: 22,
  },

  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
});

export const BannerButton = styled(Button)({
  minWidth: 46,
  width: 46,
  height: 46,
  borderRadius: "999px",
  color: theme.colors.cleanWhite,
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
  backgroundColor: theme.colors.warmWhite,
});

export const Row = styled(Stack)({
  flexDirection: "row",
  width: "100%",
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  alignItems: "stretch",
  overflow: "hidden",
});

export const Left = styled(Stack, {
  shouldForwardProp: (prop) =>
    prop !== "collapsed" && prop !== "overlay" && prop !== "mobileOpen",
})<{ collapsed?: boolean; overlay?: boolean; mobileOpen?: boolean }>(
  ({ collapsed, overlay, mobileOpen }) => ({
    width: collapsed && !overlay ? 84 : 280,
    flexShrink: 0,
    backgroundImage: `linear-gradient(180deg, ${theme.colors.deepTeal} 0%, ${theme.colors.deepTeal} 55%, ${theme.colors.freshBlue} 100%)`,
    borderRight: "none",
    height: overlay ? "calc(100vh - 68px)" : "100%",
    boxSizing: "border-box",
    alignItems: collapsed && !overlay ? "center" : "stretch",
    padding: "1rem 0 4.5rem",
    overflow: "auto",
    transition: "transform 0.2s ease, width 0.2s ease",
    ...(overlay
      ? {
          position: "fixed",
          zIndex: 30,
          top: 68,
          left: 0,
          transform: mobileOpen ? "none" : "translateX(-105%)",
          boxShadow: mobileOpen ? "12px 0 32px rgba(57, 66, 67, 0.28)" : "none",
        }
      : {}),
    ...(collapsed && !overlay
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
            backgroundColor: theme.colors.warmWhite,
            color: theme.colors.graphite,
            borderTop: `3px solid ${theme.colors.freshLime}`,
            borderBottom: `3px solid ${theme.colors.freshLime}`,
            borderLeft: `3px solid ${theme.colors.freshLime}`,
            borderRight: "none",
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
  })
);

export const Content = styled(Stack)({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  justifyContent: "flex-start",
  gap: theme.gap.lg,
  padding: theme.padding.lg,
  boxSizing: "border-box",
  overflow: "auto",
  backgroundColor: theme.colors.warmWhite,

  "@media (max-width: 900px)": {
    padding: "0.75rem",
  },
});

export const MobileBackdrop = styled("button")({
  position: "fixed",
  inset: "68px 0 0 0",
  zIndex: 25,
  border: "none",
  padding: 0,
  backgroundColor: "rgba(57, 66, 67, 0.45)",
});

export const MenuBtn = styled(Button)({
  justifyContent: "flex-start",
  fontSize: "1.05rem",
  fontWeight: 600,
  backgroundColor: "transparent",
  color: theme.colors.cleanWhite,
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
    color: theme.colors.cleanWhite,
  },

  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },

  "&.nav-active": {
    color: theme.colors.graphite,
    fontWeight: 700,
    backgroundColor: theme.colors.warmWhite,
    width: "calc(100% - 0.5rem)",
    marginRight: 0,
    borderRadius: "999px 0 0 999px",
    borderTop: `3px solid ${theme.colors.freshLime}`,
    borderBottom: `3px solid ${theme.colors.freshLime}`,
    borderLeft: `3px solid ${theme.colors.freshLime}`,
    borderRight: "none",
  },

  "&.nav-active.MuiButton-contained": {
    backgroundColor: theme.colors.warmWhite,
    color: theme.colors.graphite,
    boxShadow: "none",
    borderTop: `3px solid ${theme.colors.freshLime}`,
    borderBottom: `3px solid ${theme.colors.freshLime}`,
    borderLeft: `3px solid ${theme.colors.freshLime}`,
    borderRight: "none",
  },
});

export const Title = styled(Typography)({
  fontSize: "1.35rem",
  fontWeight: 700,
  letterSpacing: "0.01em",
  color: theme.colors.graphite,
});

export const BtnGroupsWrapper = styled(Stack)({
  flex: 1,
  minHeight: 0,
  width: "100%",
  paddingTop: theme.padding.sm,
  justifyContent: "space-between",
});

export const TopBtns = styled(Stack)({
  textAlign: "left",
  gap: "0.15rem",
  padding: `${theme.padding.md} 0`,
});

export const BottomBtns = styled(Stack)({
  gap: "0.15rem",
  width: "100%",
  paddingTop: theme.padding.sm,

  "&::before": {
    content: '""',
    height: 1,
    margin: "0 0.75rem 0.35rem",
    backgroundColor: "rgba(255, 255, 255, 0.28)",
  },
});
