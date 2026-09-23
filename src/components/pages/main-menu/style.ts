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
  padding: "1.25rem",
  gap: theme.gap.lg,
  boxShadow: "none",
  overflow: "hidden",
});

export const WelcomeBlock = styled(Stack)({
  gap: "0.15rem",
});

export const WelcomeTitle = styled(Typography)({
  fontSize: "1.35rem",
  fontWeight: 700,
  letterSpacing: "0.01em",
  color: theme.colors.darker,
});

export const WelcomeMeta = styled(Typography)({
  fontSize: "0.95rem",
  fontWeight: 400,
  color: theme.colors.medium,
});

export const SectionLabel = styled(Typography)({
  fontSize: "0.8rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: theme.colors.freshBlue,
});

export const ButtonsWrapper = styled(Grid2)({
  flex: 1,
  minHeight: 0,
  alignContent: "stretch",

  "& > .MuiGrid2-root": {
    display: "flex",
    minHeight: 0,
  },
});

export const StyledMenuButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "accent" && prop !== "compact",
})(
  ({
    accent = theme.colors.darker,
    compact = false,
  }: {
    accent?: string;
    compact?: boolean;
  }) => ({
    width: "100%",
    height: "100%",
    minHeight: compact ? 120 : 0,
    padding: 0,
    borderRadius: theme.borderRadius.md,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    textTransform: "none",
    overflow: "hidden",
    backgroundColor: theme.colors.white,
    border: `1px solid ${theme.colors.softBlue}`,
    borderBottom: `4px solid ${accent}`,
    boxShadow: "none",
    color: theme.colors.black,

    "&:hover": {
      borderColor: accent,
      borderBottomColor: accent,
      boxShadow: "none",
      backgroundColor: theme.colors.white,
    },

    "& .card-mark": {
      flex: compact ? "0 0 auto" : 1,
      width: "100%",
      minHeight: compact ? "3.5rem" : "7.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
      color: theme.colors.darker,
    },

    "& .card-mark .MuiSvgIcon-root": {
      fontSize: compact ? "2.25rem" : "4rem",
    },
  })
);

export const CardCopy = styled(Stack)({
  alignItems: "flex-start",
  gap: "0.15rem",
  padding: "0.75rem 1rem 0.85rem",
  backgroundColor: theme.colors.white,
});

export const CardTitle = styled(Typography)({
  fontSize: "1.1rem",
  fontWeight: 600,
  letterSpacing: "0.01em",
  color: theme.colors.darker,
  textAlign: "left",
});

export const CardHint = styled(Typography)({
  fontSize: "0.9rem",
  fontWeight: 400,
  color: theme.colors.medium,
  textAlign: "left",
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
