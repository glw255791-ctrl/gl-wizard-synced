import {
  styled,
  Button,
  Stack,
  Typography,
  Grid2,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { theme } from "../../../constants/theme";

export const Root = styled(Stack)({
  flex: 1,
  width: "100%",
  minWidth: 0,
  minHeight: 0,
  height: "100%",
  justifyContent: "flex-start",
  gap: theme.gap.lg,
});

export const MenuPanel = styled(Stack)({
  flex: 1,
  minHeight: 0,
  backgroundColor: theme.colors.page,
  border: `1px solid ${theme.colors.softBlue}`,
  borderRadius: theme.borderRadius.md,
  padding: "1.25rem 1.35rem 1.5rem",
  gap: "1.35rem",
  boxShadow: "none",
  overflow: "auto",
});

export const WelcomeHero = styled(Stack)({
  position: "relative",
  overflow: "hidden",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1.25rem",
  flexWrap: "wrap",
  padding: "1.35rem 1.5rem",
  borderRadius: theme.borderRadius.md,
  backgroundImage: `linear-gradient(135deg, ${theme.colors.deepTeal} 0%, ${theme.colors.freshBlue} 100%)`,
  color: theme.colors.cleanWhite,
  border: "none",

  "&::after": {
    content: '""',
    position: "absolute",
    right: "-2.5rem",
    top: "-2.5rem",
    width: "11rem",
    height: "11rem",
    borderRadius: "50%",
    background: "rgba(184, 201, 107, 0.22)",
    pointerEvents: "none",
  },

  "&::before": {
    content: '""',
    position: "absolute",
    right: "4rem",
    bottom: "-3.5rem",
    width: "8rem",
    height: "8rem",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.08)",
    pointerEvents: "none",
  },
});

export const WelcomeCopy = styled(Stack)({
  position: "relative",
  zIndex: 1,
  gap: "0.35rem",
  minWidth: 0,
  flex: "1 1 240px",
});

export const WelcomeEyebrow = styled(Typography)({
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: theme.colors.freshLime,
});

export const WelcomeTitle = styled(Typography)({
  fontSize: "1.55rem",
  fontWeight: 700,
  letterSpacing: "0.01em",
  lineHeight: 1.2,
  color: theme.colors.cleanWhite,
});

export const WelcomeMeta = styled(Typography)({
  fontSize: "0.95rem",
  fontWeight: 400,
  color: "rgba(255, 255, 255, 0.82)",
  maxWidth: 420,
});

export const WelcomeChips = styled(Stack)({
  position: "relative",
  zIndex: 1,
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "0.5rem",
  alignItems: "center",
});

export const MetaChip = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.4rem 0.75rem",
  borderRadius: 999,
  backgroundColor: "rgba(255, 255, 255, 0.14)",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  color: theme.colors.cleanWhite,
  fontSize: "0.8rem",
  fontWeight: 600,
  whiteSpace: "nowrap",

  "& .MuiSvgIcon-root": {
    fontSize: "1rem",
    color: theme.colors.freshLime,
  },
});

export const SectionHeader = styled(Stack)({
  flexDirection: "row",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "0.75rem",
  flexWrap: "wrap",
});

export const SectionLabel = styled(Typography)({
  fontSize: "0.8rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: theme.colors.freshBlue,
});

export const SectionHint = styled(Typography)({
  fontSize: "0.85rem",
  color: theme.colors.medium,
});

export const ButtonsWrapper = styled(Grid2)({
  alignContent: "stretch",

  "& > .MuiGrid2-root": {
    display: "flex",
  },
});

export const StyledMenuButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "accent" && prop !== "compact",
})(
  ({
    accent = theme.colors.deepTeal,
    compact = false,
  }: {
    accent?: string;
    compact?: boolean;
  }) => ({
    width: "100%",
    height: "100%",
    minHeight: compact ? 88 : 132,
    padding: compact ? "0.85rem 1rem" : "1.1rem 1.15rem",
    borderRadius: theme.borderRadius.md,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "1rem",
    textTransform: "none",
    overflow: "hidden",
    backgroundColor: theme.colors.cleanWhite,
    border: `1px solid ${theme.colors.softBlue}`,
    boxShadow: "none",
    color: theme.colors.graphite,
    textAlign: "left",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",

    "&:hover": {
      borderColor: accent,
      boxShadow: `0 10px 28px rgba(53, 111, 115, 0.12)`,
      backgroundColor: theme.colors.cleanWhite,
      transform: "translateY(-2px)",

      "& .card-mark": {
        backgroundColor: accent,
        color: theme.colors.cleanWhite,
      },

      "& .card-arrow": {
        color: accent,
        transform: "translateX(3px)",
      },
    },

    "& .card-mark": {
      flex: "0 0 auto",
      width: compact ? 48 : 56,
      height: compact ? 48 : 56,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.paleBlue,
      color: accent,
      transition: "background-color 0.15s ease, color 0.15s ease",
    },

    "& .card-mark .MuiSvgIcon-root": {
      fontSize: compact ? "1.55rem" : "1.85rem",
    },

    "& .card-arrow": {
      marginLeft: "auto",
      color: theme.colors.coolGray,
      fontSize: "1.35rem",
      transition: "color 0.15s ease, transform 0.15s ease",
      flexShrink: 0,
    },
  })
);

export const CardCopy = styled(Stack)({
  alignItems: "flex-start",
  gap: "0.2rem",
  minWidth: 0,
  flex: 1,
});

export const CardTitle = styled(Typography)({
  fontSize: "1.05rem",
  fontWeight: 700,
  letterSpacing: "0.01em",
  color: theme.colors.deepTeal,
  textAlign: "left",
  lineHeight: 1.25,
});

export const CardHint = styled(Typography)({
  fontSize: "0.86rem",
  fontWeight: 400,
  color: theme.colors.medium,
  textAlign: "left",
  lineHeight: 1.35,
});

export const FlowStrip = styled(Stack)({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "0.65rem",
  padding: "0.85rem 1rem",
  borderRadius: theme.borderRadius.md,
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.softBlue}`,
});

export const FlowStep = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  gap: "0.55rem",
  flex: "1 1 160px",
  minWidth: 0,
});

export const FlowNum = styled(Typography)({
  width: 26,
  height: 26,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  fontSize: "0.8rem",
  fontWeight: 700,
  backgroundColor: theme.colors.deepTeal,
  color: theme.colors.cleanWhite,
});

export const FlowText = styled(Typography)({
  fontSize: "0.85rem",
  fontWeight: 600,
  color: theme.colors.graphite,
  lineHeight: 1.3,
});

export const FlowDivider = styled("span")({
  display: "none",
  width: 18,
  height: 2,
  borderRadius: 999,
  backgroundColor: theme.colors.softBlue,
  flexShrink: 0,

  "@media (min-width: 900px)": {
    display: "block",
  },
});

// Kept for any leftover imports / dialogs
export const WelcomeBlock = styled(Stack)({
  gap: "0.15rem",
});

export const QuickLinksRow = styled(Stack)({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: theme.gap.md,
});

export const QuickLink = styled("button")({
  all: "unset",
  boxSizing: "border-box",
  cursor: "pointer",
  display: "flex",
  alignItems: "flex-start",
  gap: "0.65rem",
  minWidth: 200,
  flex: "1 1 200px",
  padding: "0.75rem 0.9rem",
  borderRadius: theme.borderRadius.sm,
  border: `1px solid ${theme.colors.softBlue}`,
  backgroundColor: theme.colors.white,
  color: theme.colors.darker,

  "&:hover": {
    borderColor: theme.colors.freshBlue,
    backgroundColor: theme.colors.surface,
  },

  "& .MuiSvgIcon-root": {
    marginTop: 2,
    color: theme.colors.freshBlue,
  },

  "& span": {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  "& strong": {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: theme.colors.darker,
  },

  "& em": {
    fontStyle: "normal",
    fontSize: "0.8rem",
    color: theme.colors.medium,
  },
});

export const TodoDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    width: "min(440px, calc(100vw - 2rem))",
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.softBlue}`,
    backgroundColor: theme.colors.page,
    boxShadow: "0 18px 48px rgba(53, 111, 115, 0.28)",
  },
});

export const TodoDialogTitle = styled(DialogTitle)({
  fontSize: "1.1rem",
  fontWeight: 700,
  color: theme.colors.darker,
  padding: "1rem 1.15rem 0.35rem",
});

export const TodoDialogBody = styled(DialogContent)({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  padding: "0.5rem 1.15rem 0.25rem",
});

export const TodoDialogActions = styled(DialogActions)({
  padding: "0.75rem 1.15rem 1rem",
});

export const TodoPrimaryButton = styled("button")({
  all: "unset",
  boxSizing: "border-box",
  cursor: "pointer",
  padding: "0.45rem 1rem",
  borderRadius: 16,
  backgroundColor: theme.colors.darker,
  color: theme.colors.white,
  fontSize: "0.9rem",
  fontWeight: 600,

  "&:hover": {
    backgroundColor: theme.colors.freshBlue,
  },
});
