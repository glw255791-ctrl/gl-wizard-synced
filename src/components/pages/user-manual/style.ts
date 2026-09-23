import { styled, Stack, Typography, Button } from "@mui/material";
import { theme } from "../../../constants/theme";

export const RootStack = styled(Stack)({
  gap: theme.gap.lg,
  width: "100%",
  minWidth: 0,
});

export const Intro = styled(Typography)({
  fontSize: "1rem",
  color: theme.colors.medium,
  maxWidth: 720,
});

export const SectionLabel = styled(Typography)({
  fontSize: "0.8rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: theme.colors.freshBlue,
});

export const ContentWrapper = styled(Stack)({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: theme.gap.lg,
  width: "100%",
});

export const Panel = styled(Stack)({
  flex: "1 1 320px",
  minWidth: 0,
  gap: "0.85rem",
  padding: "1.1rem 1.2rem",
  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.softBlue}`,
  borderRadius: theme.borderRadius.md,
  color: theme.colors.black,
});

export const AnalysisCard = styled(Stack)({
  flex: "1 1 220px",
  minWidth: 0,
  gap: "0.45rem",
  padding: "1rem 1.1rem",
  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.softBlue}`,
  borderLeft: `4px solid ${theme.colors.darker}`,
  borderRadius: theme.borderRadius.sm,
});

export const AnalysisTitle = styled(Typography)({
  fontSize: "1.05rem",
  fontWeight: 700,
  color: theme.colors.darker,
});

export const AnalysisMeta = styled(Typography)({
  fontSize: "0.82rem",
  fontWeight: 600,
  color: theme.colors.freshBlue,
});

export const AnalysisBody = styled(Typography)({
  fontSize: "0.92rem",
  color: theme.colors.medium,
  lineHeight: 1.45,
});

export const StyledTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: "1.1rem",
  textAlign: "left",
  color: theme.colors.darker,
});

export const StyledList = styled("ul")({
  margin: 0,
  paddingLeft: "1.15rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.55rem",
  color: theme.colors.black,
  fontSize: "0.95rem",
  lineHeight: 1.45,

  "& li::marker": {
    color: theme.colors.freshBlue,
  },

  "& ul": {
    marginTop: "0.35rem",
    paddingLeft: "1.1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
});

export const DownloadButton = styled(Button)({
  height: 44,
  borderRadius: 16,
  border: `1px solid ${theme.colors.softBlue}`,
  backgroundColor: theme.colors.surface,
  color: theme.colors.darker,
  textTransform: "none",
  fontWeight: 600,
  justifyContent: "space-between",
  padding: "0 1rem",
  boxShadow: "none",

  "&:hover": {
    backgroundColor: theme.colors.darker,
    borderColor: theme.colors.darker,
    color: theme.colors.white,
    boxShadow: "none",
  },
});

export const DownloadError = styled(Typography)({
  color: theme.colors.red,
  fontSize: "0.9rem",
});
