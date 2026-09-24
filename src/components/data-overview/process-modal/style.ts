import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { IconButton, Button, CircularProgress } from "@mui/material";
import { CommonProps } from "@mui/material/OverridableComponent";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { AnyType } from "../../../types";
import { theme } from "../../../constants/theme";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  primaryActionButtonStyles,
  secondaryActionButtonStyles,
  tableHeaderBarStyles,
} from "../../ui-kit/button-styles";
// Modal content container (positioning the modal, centering, etc.)
export const ModalContent = styled(Stack)(() => ({
  width: "min(1280px, calc(100vw - 2rem))",
  height: "min(900px, calc(100vh - 2rem))",
  backgroundColor: theme.colors.page,
  borderRadius: theme.borderRadius.md,
  justifyContent: "flex-start",
  alignItems: "stretch",
  overflow: "hidden",
  color: theme.colors.black,
  border: `${theme.borderWidth.sm} solid ${theme.colors.softBlue}`,
  boxShadow: "0 18px 48px rgba(53, 111, 115, 0.28)",
}));

export const ModalInnerContent = styled(Stack)(() => ({
  flex: 1,
  width: "100%",
  minHeight: 0,
  padding: theme.padding.none,
  justifyContent: "flex-start",
  backgroundColor: theme.colors.page,
}));

export const QueryStatsIconStyled = styled(QueryStatsIcon)({
  fontSize: 18,
  color: theme.colors.freshBlue,
});

export const AddCircleOutlineIconStyled = styled(AddCircleOutlineIcon)({
  fontSize: 18,
  color: theme.colors.darker,
});

export const RemoveCircleOutlineIconStyled = styled(RemoveCircleOutlineIcon)({
  fontSize: 18,
  color: theme.colors.medium,
});

export const EnabledSearchIconStyled = styled(CheckCircleIcon)({
  color: theme.colors.freshBlue,
});

export const DisabledSearchIconStyled = styled(RemoveCircleIcon)({
  color: theme.colors.gray,
});

export const DeleteIconStyled = styled(DeleteForeverIcon)({
  color: theme.colors.red,
});

// Modal header (title row with styling)
export const ModalHeader = styled(Stack)(() => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.85rem 1.1rem",
  backgroundColor: theme.colors.deepTeal,
  color: theme.colors.cleanWhite,
  borderBottom: `${theme.borderWidth.sm} solid ${theme.colors.freshBlue}`,
}));

// Modal content wrapper (for the body, aligns content)
export const ModalContentWrapper = styled(Stack)(() => ({
  alignItems: "stretch",
  justifyContent: "flex-start",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  width: "100%",
  gap: theme.gap.md,
  padding: "0.85rem 1rem 1rem",
  overflow: "hidden",
  backgroundColor: theme.colors.page,
  boxSizing: "border-box",
}));

// Title of the modal
export const Title = styled(Typography)(() => ({
  textAlign: "left",
  color: theme.colors.white,
  flex: 1,
  fontWeight: 700,
  fontSize: theme.fontSize.xl,
  letterSpacing: "0.01em",
}));

// Typography styles
export const TotalText = styled(Typography)({
  fontSize: theme.fontSize.lg,
  fontWeight: "bold",
});

export const TableTitle = styled(Typography)({
  fontSize: "0.95rem",
  fontWeight: 700,
  color: theme.colors.white,
  lineHeight: 1.2,
});

export const SectionLabel = styled(Typography)({
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: theme.colors.freshBlue,
});

export const SectionHeaderRow = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  width: "100%",
  minWidth: 0,
});

export const ClearSelectedButton = styled(Button)({
  ...secondaryActionButtonStyles,
  height: 28,
  minHeight: 28,
  paddingLeft: "0.75rem",
  paddingRight: "0.75rem",
  fontSize: "0.8rem",
});

export const ExportStatusText = styled(Typography)({
  fontSize: "0.82rem",
  fontWeight: 600,
  marginLeft: 4,
});

export const FilterChip = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  marginLeft: "auto",
  padding: "6px 8px 6px 12px",
  borderRadius: 20,
  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.softBlue}`,
  maxWidth: "100%",
  minWidth: 0,
});

export const FilterChipClear = styled(IconButton)({
  padding: 4,
  color: theme.colors.medium,
  "&:hover": {
    color: theme.colors.darker,
    backgroundColor: theme.colors.canvas,
  },
});

export const UncheckedIcon = styled(CancelRounded)({
  color: theme.colors.red,
  fontSize: theme.fontSize.lg,
});

// Button/Stack styles
export const IconButtonStyled = styled(IconButton)({
  padding: 2,
  flexShrink: 0,
});

export const RowLabelWrapper = styled(Stack)({
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 6,
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
});

export const RowLabelCell = styled(Stack)({
  flexDirection: "row",
  gap: 2,
  alignItems: "center",
  flexShrink: 0,
  paddingTop: 2,
});

export const AmountCell = styled(Typography)({
  flex: "0 0 auto",
  minWidth: 100,
  maxWidth: 140,
  boxSizing: "border-box",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 12.5,
  lineHeight: 1.3,
  fontVariantNumeric: "tabular-nums",
  fontWeight: 600,
  textAlign: "right",
  color: theme.colors.darker,
  paddingLeft: 8,
  paddingRight: 4,
  alignSelf: "center",
});

export const LabelText = styled(Typography)({
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
  wordBreak: "break-word",
  fontSize: 12.5,
  lineHeight: 1.35,
  color: theme.colors.black,
});

export const ProcessTableShell = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "compact",
})<{ compact?: boolean }>(({ compact }) => ({
  width: "100%",
  maxWidth: "100%",
  minWidth: compact ? 300 : 0,
  flex: compact ? "1 1 360px" : "1 1 auto",
  alignSelf: "stretch",
  minHeight: 0,
  height: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
}));

export const ProcessRowsBody = styled(Stack)({
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  flex: 1,
  minHeight: 0,
  overflowX: "hidden",
  overflowY: "auto",
  scrollbarGutter: "stable",
  backgroundColor: theme.colors.white,
  borderBottomLeftRadius: theme.borderRadius.sm,
  borderBottomRightRadius: theme.borderRadius.sm,
  boxSizing: "border-box",
});

export const ProcessRow = styled(Stack)({
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 8,
  minHeight: 34,
  paddingTop: 6,
  paddingBottom: 6,
  paddingLeft: 12,
  paddingRight: 16,
  borderBottom: `1px solid ${theme.colors.softBlue}`,
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,

  "&:last-child": {
    borderBottom: "none",
  },
});

export const TableScrollableWrapper = styled(Stack)({
  borderRadius: theme.borderRadius.sm,
  border: `1px solid ${theme.colors.softBlue}`,
  backgroundColor: theme.colors.white,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxSizing: "border-box",
  boxShadow: "0 1px 0 rgba(53, 111, 115, 0.08)",
});

export const TableHeaderStyled = styled(Stack)({
  ...tableHeaderBarStyles,
  borderRadius: `${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0`,
  flexShrink: 0,
});

export const SelectedTableWrapper = styled(Stack)({
  gap: 10,
  flexDirection: "row",
  alignItems: "stretch",
  flexWrap: "nowrap",
  overflowX: "auto",
  overflowY: "hidden",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  flex: 1,
  minHeight: 0,
  justifyContent: "flex-start",
  borderRadius: theme.borderRadius.sm,
  backgroundColor: theme.colors.surface,
  border: `${theme.borderWidth.sm} solid ${theme.colors.softBlue}`,
  padding: "0.65rem",
  boxSizing: "border-box",
});

export const SelectedSection = styled(Stack)({
  gap: 6,
  width: "100%",
  minWidth: 0,
  minHeight: 0,
  flex: "1 1 50%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
});

export const BottomSection = styled(Stack)({
  gap: 6,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  minHeight: 0,
  flex: "1 1 50%",
  overflow: "hidden",
  boxSizing: "border-box",
  alignItems: "stretch",
  display: "flex",
  flexDirection: "column",
});

export const TablesWrapper = styled(Stack)({
  gap: theme.gap.lg,
  flexDirection: "column",
  alignItems: "stretch",
  overflowX: "hidden",
  overflowY: "hidden",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  flex: 1,
  minHeight: 0,
  boxSizing: "border-box",

  "& > *": {
    width: "100%",
    maxWidth: "100%",
    flex: 1,
    minHeight: 0,
  },
});

export const AddButton = styled(Button)({
  ...primaryActionButtonStyles,
  height: 30,
  minHeight: 30,
  paddingLeft: theme.padding.md,
  paddingRight: theme.padding.md,
});

export const ExcelDownloadButton = styled(Button)({
  ...primaryActionButtonStyles,
});

export const SecondaryButton = styled(Button)({
  ...secondaryActionButtonStyles,
});

export const RemoveButton = styled(Button)({
  paddingLeft: theme.padding.md,
  paddingRight: theme.padding.md,
  borderRadius: 999,
  height: theme.height.input,
  backgroundColor: theme.colors.red,
  color: theme.colors.cleanWhite,
  textTransform: "none",
  fontWeight: 600,
});
// Miscellaneous, reusable style objects
export const styles: Record<string, CommonProps["style"]> = {
  cellBaseStyle: {
    padding: "0 10px",
    borderRightStyle: "solid",
    whiteSpace: "nowrap",
    justifyContent: "center",
    borderBottomStyle: "solid",
    fontSize: 12.5,
    overflow: "hidden",
  },
  autosizerWrapper: {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    height: 480,
    // MultiGrid owns scrolling; overflow auto here + AutoSizer loops width to infinity.
    overflow: "hidden",
    borderBottomRightRadius: theme.borderRadius.sm,
    borderBottomLeftRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.white,
  },
};

export const ButtonsWrapper = styled(Stack)({
  flexDirection: "row",
  gap: theme.gap.md,
});

/**
 * Returns cell style object based on the column and row context.
 */
export const getStylesBasedOnColumn = (
  column: string,
  row: Record<string, AnyType>,
  mappingValue: string
) => {
  const isSideHeader = column === "sideHeader";
  const isTotalColumn = column === "total";
  const isBoldRow =
    isTotalColumn ||
    isSideHeader ||
    row.sideHeader === "Total" ||
    row.sideHeader === mappingValue;

  let backgroundColor: string;
  if (isSideHeader) {
    backgroundColor =
      row.bg !== "white" ? (row.bg as string) : theme.colors.surface;
  } else {
    backgroundColor =
      isTotalColumn
        ? theme.colors.surface
        : row.bg === "white"
          ? theme.colors.white
          : (row.bg as string);
  }

  return {
    backgroundColor,
    borderRightWidth: isSideHeader
      ? theme.borderWidth.md
      : theme.borderWidth.sm,
    borderRightColor: isSideHeader ? theme.colors.freshBlue : theme.colors.softBlue,
    borderLeftWidth: isTotalColumn
      ? theme.borderWidth.md
      : theme.borderWidth.none,
    borderLeftStyle: "solid",
    borderLeftColor: theme.colors.freshBlue,
    fontWeight: isBoldRow ? "bold" : "initial",
    borderBottomStyle: "solid",
    borderBottomColor: theme.colors.softBlue,
    color: theme.colors.black,
    textAlign: isSideHeader ? "left" : "right",
  };
};

/**
 * Returns style object for table header cells, determining
 * the bottom border and height based on the row position.
 */
export const getStylesBasedOnHeader = (
  rowIndex: number,
  fixedRowCount: number
) => {
  const isLastRow = rowIndex === fixedRowCount - 1;
  return {
    borderBottomWidth: isLastRow ? theme.borderWidth.md : theme.borderWidth.sm,
    borderBottomColor: isLastRow ? theme.colors.medium : theme.colors.lighter,
    height: isLastRow ? theme.height.header : theme.height.cell,
  };
};

// Styled stack container for the loader content
export const LoaderContent = styled(Stack)({
  backgroundColor: theme.colors.surface,
  borderRadius: 36,
  flexDirection: "row",
  alignItems: "center",
  gap: theme.gap.lg,
  padding: `${theme.padding.lg} ${theme.padding.xl}`,
  border: `${theme.borderWidth.sm} solid ${theme.colors.softBlue}`,
});

// Styled typography for the loader text
export const LoaderText = styled(Typography)({
  color: theme.colors.darker,
});

// Styled circular progress indicator
export const StyledCircularProgress = styled(CircularProgress)({
  color: theme.colors.freshBlue,
});

export const ProcessTreeBranch = styled(Stack)({
  flexDirection: "row",
  alignItems: "flex-start",
  flexWrap: "nowrap",
  gap: 12,
  width: "auto",
  minWidth: 0,
  flex: "0 0 auto",
});

export const ProcessTreeChildren = styled(Stack)({
  flexDirection: "row",
  flexWrap: "wrap",
  alignContent: "flex-start",
  alignItems: "flex-start",
  gap: 10,
  flex: "0 1 auto",
  minWidth: 0,
  maxWidth: "100%",
});

export const LoaderContentWrapper = styled(Stack)({
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
});

export const ChildrenWrapper = styled(Stack)({
  flexDirection: "row",
  gap: theme.gap.sm,
  marginLeft: theme.padding.lg,
  paddingLeft: theme.padding.lg,
  borderLeft: `${theme.borderWidth.sm}px solid ${theme.colors.medium}`,
  alignItems: "center",
});
