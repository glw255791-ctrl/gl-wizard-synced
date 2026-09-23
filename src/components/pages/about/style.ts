import { styled, Stack, Typography } from "@mui/material";
import { theme } from "../../../constants/theme";

export const RootStack = styled(Stack)({
  gap: theme.gap.lg,
  width: "100%",
  minWidth: 0,
});

export const Intro = styled(Typography)({
  fontSize: "1.05rem",
  color: theme.colors.medium,
  maxWidth: 640,
  lineHeight: 1.45,
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
  flex: "1 1 300px",
  minWidth: 0,
  gap: "0.85rem",
  padding: "1.15rem 1.25rem",
  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.softBlue}`,
  borderRadius: theme.borderRadius.md,
  color: theme.colors.black,
});

export const PanelTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: "1.1rem",
  color: theme.colors.darker,
});

export const PanelBody = styled(Typography)({
  fontSize: "0.95rem",
  color: theme.colors.medium,
  lineHeight: 1.5,
});

export const FeatureList = styled("ul")({
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
});

export const MetaRow = styled(Stack)({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: theme.gap.md,
  paddingBottom: "0.55rem",
  borderBottom: `1px solid ${theme.colors.softBlue}`,

  "&:last-child": {
    borderBottom: "none",
    paddingBottom: 0,
  },
});

export const MetaLabel = styled(Typography)({
  fontSize: "0.85rem",
  fontWeight: 600,
  color: theme.colors.medium,
});

export const MetaValue = styled(Typography)({
  fontSize: "0.95rem",
  fontWeight: 600,
  color: theme.colors.darker,
  textAlign: "right",
});
