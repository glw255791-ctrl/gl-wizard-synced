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
// Modal content container (positioning the modal, centering, etc.)
export const ModalContent = styled(Stack)(() => ({
  width: "min(1100px, calc(100vw - 3rem))",
  height: "min(820px, calc(100vh - 3rem))",
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
  fontSize: theme.fontSize.lg,
  color: theme.colors.freshBlue,
});

export const AddCircleOutlineIconStyled = styled(AddCircleOutlineIcon)({
  fontSize: theme.fontSize.lg,
  color: theme.colors.darker,
});

export const RemoveCircleOutlineIconStyled = styled(RemoveCircleOutlineIcon)({
  fontSize: theme.fontSize.lg,
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
  backgroundColor: theme.colors.darker,
  color: theme.colors.white,
  borderBottom: `${theme.borderWidth.sm} solid ${theme.colors.freshBlue}`,
}));

// Modal content wrapper (for the body, aligns content)
export const ModalContentWrapper = styled(Stack)(() => ({
  alignItems: "stretch",
  justifyContent: "flex-start",
  flex: 1,
  minHeight: 0,
  width: "100%",
  gap: theme.gap.md,
  padding: theme.padding.lg,
  overflow: "hidden",
  backgroundColor: theme.colors.page,
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
  fontSize: theme.fontSize.lg,
  fontWeight: "bold",
  color: theme.colors.white,
});

export const UncheckedIcon = styled(CancelRounded)({
  color: theme.colors.red,
  fontSize: theme.fontSize.lg,
});

// Button/Stack styles
export const IconButtonStyled = styled(IconButton)({
  padding: theme.padding.none,
});

export const RowLabelWrapper = styled(Stack)({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

export const RowLabelCell = styled(Stack)({
  flexDirection: "row",
  gap: theme.gap.sm,
  alignItems: "center",
});

export const TableScrollableWrapper = styled(Stack)({
  borderRadius: theme.borderRadius.sm,
  borderWidth: theme.borderWidth.sm,
  borderStyle: "solid",
  borderColor: theme.colors.softBlue,
  backgroundColor: theme.colors.white,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
  boxShadow: "0 1px 0 rgba(53, 111, 115, 0.08)",
});

export const TableHeaderStyled = styled(Stack)({
  width: "100%",
  boxSizing: "border-box",
  padding: "0.55rem 0.85rem",
  backgroundColor: theme.colors.freshBlue,
  color: theme.colors.white,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: `${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0`,
  minHeight: 40,
});

export const SelectedTableWrapper = styled(Stack)({
  gap: theme.gap.sm,
  flexDirection: "row",
  overflow: "auto",
  width: "100%",
  justifyContent: "flex-start",
  borderRadius: theme.borderRadius.sm,
  backgroundColor: theme.colors.surface,
  border: `${theme.borderWidth.sm} solid ${theme.colors.softBlue}`,
  padding: theme.padding.md,
  maxHeight: 180,
  flexShrink: 0,
});

export const AddButton = styled(Button)({
  paddingLeft: theme.padding.md,
  paddingRight: theme.padding.md,
  borderRadius: theme.borderRadius.sm,
  height: 30,
  backgroundColor: theme.colors.darker,
  color: theme.colors.white,
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.colors.freshBlue,
  },
});

export const ExcelDownloadButton = styled(Button)({
  paddingLeft: 16,
  paddingRight: 16,
  borderRadius: 16,
  height: theme.height.input,
  backgroundColor: theme.colors.darker,
  color: theme.colors.white,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: theme.colors.freshBlue,
    boxShadow: "none",
  },
  "&.Mui-disabled": {
    backgroundColor: theme.colors.softBlue,
    color: theme.colors.white,
    opacity: 0.7,
  },
});

export const SecondaryButton = styled(Button)({
  paddingLeft: 16,
  paddingRight: 16,
  borderRadius: 16,
  height: theme.height.input,
  backgroundColor: theme.colors.surface,
  color: theme.colors.darker,
  border: `${theme.borderWidth.sm} solid ${theme.colors.softBlue}`,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: theme.colors.canvas,
    borderColor: theme.colors.freshBlue,
    boxShadow: "none",
  },
  "&.Mui-disabled": {
    backgroundColor: theme.colors.canvas,
    color: theme.colors.gray,
    borderColor: theme.colors.gray,
  },
});

export const RemoveButton = styled(Button)({
  paddingLeft: theme.padding.md,
  paddingRight: theme.padding.md,
  borderRadius: theme.borderRadius.sm,
  height: theme.height.input,
  backgroundColor: theme.colors.red,
  textTransform: "none",
});
// Miscellaneous, reusable style objects
export const styles: Record<string, CommonProps["style"]> = {
  cellBaseStyle: {
    padding: `${theme.padding.none} ${theme.padding.sm}`,
    borderRightStyle: "solid",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
    justifyContent: "center",
    borderBottomStyle: "solid",
    fontSize: theme.fontSize.cell,
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

export const TablesWrapper = styled(Stack)({
  gap: theme.gap.lg,
  flexDirection: "row",
  alignItems: "stretch",
  overflowX: "auto",
  overflowY: "hidden",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  flex: 1,
  minHeight: 0,
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
