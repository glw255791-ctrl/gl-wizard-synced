import { theme } from "../../constants/theme";

/** Primary action: Fresh Lime pill (use on teal banners and light surfaces). */
export const primaryActionButtonStyles = {
  paddingLeft: "1rem",
  paddingRight: "1rem",
  borderRadius: 999,
  height: 36,
  minHeight: 36,
  backgroundColor: theme.colors.freshLime,
  color: theme.colors.graphite,
  textTransform: "none" as const,
  fontWeight: 600,
  boxShadow: "none",
  border: `1px solid ${theme.colors.deepTeal}`,
  whiteSpace: "nowrap" as const,
  flexShrink: 0,

  "&:hover": {
    backgroundColor: theme.colors.limeSoft,
    boxShadow: "none",
    borderColor: theme.colors.deepTeal,
  },

  "&.Mui-disabled": {
    backgroundColor: theme.colors.lightGray,
    color: theme.colors.coolGray,
    borderColor: theme.colors.softBlue,
    opacity: 1,
  },

  "& .MuiSvgIcon-root": {
    color: theme.colors.graphite,
  },
};

/** Secondary action: pale surface with teal border. */
export const secondaryActionButtonStyles = {
  paddingLeft: "1rem",
  paddingRight: "1rem",
  borderRadius: 999,
  height: 36,
  minHeight: 36,
  backgroundColor: theme.colors.cleanWhite,
  color: theme.colors.deepTeal,
  border: `1px solid ${theme.colors.softBlue}`,
  textTransform: "none" as const,
  fontWeight: 600,
  boxShadow: "none",
  whiteSpace: "nowrap" as const,
  flexShrink: 0,

  "&:hover": {
    backgroundColor: theme.colors.paleBlue,
    borderColor: theme.colors.freshBlue,
    boxShadow: "none",
  },

  "&.Mui-disabled": {
    backgroundColor: theme.colors.lightGray,
    color: theme.colors.coolGray,
    borderColor: theme.colors.softBlue,
    opacity: 1,
  },
};

/** Shared teal table / panel header bar. */
export const tableHeaderBarStyles = {
  position: "relative" as const,
  zIndex: 2,
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "0.65rem 1rem",
  minHeight: 52,
  backgroundColor: theme.colors.deepTeal,
  color: theme.colors.cleanWhite,
  flexDirection: "row" as const,
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.gap.md,
};
