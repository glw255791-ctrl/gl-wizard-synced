import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { colors } from "../../../assets/colors";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { IconButton, Button, CircularProgress } from "@mui/material";
import { CommonProps } from "@mui/material/OverridableComponent";
import { AnyType } from "../table/functions";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// Modal content container (positioning the modal, centering, etc.)
export const ModalContent = styled(Stack)(() => ({
  flex: 1,
  backgroundColor: colors.white,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  margin: 30,
  height: "calc(100vh - 60px)",
  color: colors.black,
}));

// Inner content of the modal (vertically stacks the parts)
export const ModalInnerContent = styled(Stack)(() => ({
  flex: 1,
  width: "100%",
  height: 400,
  padding: 0,
  justifyContent: "flex-start",
}));

export const QueryStatsIconStyled = styled(QueryStatsIcon)({
  fontSize: 16,
});

export const EnabledSearchIconStyled = styled(CheckCircleIcon)({
  color: colors.green,
});

export const DisabledSearchIconStyled = styled(RemoveCircleIcon)({
  color: colors.gray,
});

export const DeleteIconStyled = styled(DeleteForeverIcon)({
  color: colors.red,
});

// Modal header (title row with styling)
export const ModalHeader = styled(Stack)(() => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 10,
  borderBottom: `1px solid ${colors.gray}`,
}));

// Modal content wrapper (for the body, aligns content)
export const ModalContentWrapper = styled(Stack)(() => ({
  alignItems: "center",
  justifyContent: "space-between",
  flex: 1,
  gap: 15,
  padding: 15,
  height: 400,
}));

// Title of the modal
export const Title = styled(Typography)(() => ({
  textAlign: "center",
  color: colors.black,
  flex: 1,
  fontWeight: "bold",
  fontSize: 20,
}));

// Typography styles
export const TotalText = styled(Typography)({
  fontSize: 14,
  fontWeight: "bold",
});

export const TableTitle = styled(Typography)({
  fontSize: 14,
  fontWeight: "bold",
});

export const UncheckedIcon = styled(CancelRounded)({
  color: colors.red,
  fontSize: 17,
});

// Button/Stack styles
export const IconButtonStyled = styled(IconButton)({
  padding: 0,
});

export const RowLabelWrapper = styled(Stack)({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

export const RowLabelCell = styled(Stack)({
  flexDirection: "row",
  gap: 5,
  alignItems: "center",
});

export const TableScrollableWrapper = styled(Stack)({
  borderRadius: 8,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: colors.medium,
  backgroundColor: colors.medium,
});

export const TableHeaderStyled = styled(Stack)({
  width: "auto",
  padding: "0.5rem",
  backgroundColor: colors.medium,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "6px 6px 0 0",
  height: 16,
});

export const SelectedTableWrapper = styled(Stack)({
  gap: 5,
  flexDirection: "row",
  overflowX: "auto",
  width: "calc(100vw - 8rem)",
  paddingBottom: 8,
  justifyContent: "flex-start",
  alignItems: "center",
  borderRadius: 8,
  backgroundColor: colors.lighter,
  padding: 10,
});

export const AddButton = styled(Button)({
  paddingLeft: 8,
  paddingRight: 8,
  borderRadius: 8,
  height: 30,
  backgroundColor: colors.green,
  textTransform: "none",
});

export const ExcelDownloadButton = styled(Button)({
  paddingLeft: 16,
  paddingRight: 16,
  borderRadius: 16,
  height: 32,
  backgroundColor: colors.action,
  textTransform: "none",
});

export const RemoveButton = styled(Button)({
  paddingLeft: 8,
  paddingRight: 8,
  borderRadius: 8,
  height: 30,
  backgroundColor: colors.red,
  textTransform: "none",
});
// Miscellaneous, reusable style objects
export const styles: Record<string, CommonProps["style"]> = {
  cellBaseStyle: {
    padding: "0 5px",
    borderRightStyle: "solid",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
    justifyContent: "center",
    borderBottomStyle: "solid",
    fontSize: 12,
  },
  autosizerWrapper: {
    width: 400,
    height: 150,
    overflow: "auto",
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    backgroundColor: colors.medium,
  },
};

export const ButtonsWrapper = styled(Stack)({
  flexDirection: "row",
  gap: 10,
});

/**
 * Returns cell style object based on the column and row context.
 */
export const getStylesBasedOnColumn = (
  column: string,
  row: Record<string, AnyType>,
  mappingValue: string,
  selectedRows?: string[]
) => {
  const isSideHeader = column === "sideHeader";
  const isTotalColumn = column === "total";
  const isSelectedRow = selectedRows?.includes(String(row.sideHeader));
  const isBoldRow =
    isTotalColumn ||
    isSideHeader ||
    row.sideHeader === "Total" ||
    row.sideHeader === mappingValue;

  let backgroundColor: string;
  if (isSideHeader) {
    backgroundColor = isSelectedRow ? colors.medium : colors.lighter;
  } else {
    backgroundColor = isTotalColumn ? colors.lighter : (row.bg as string);
  }

  return {
    backgroundColor,
    borderRightWidth: isSideHeader ? 2 : 1,
    borderRightColor: isSideHeader ? colors.medium : colors.lighter,
    borderLeftWidth: isTotalColumn ? 2 : 0,
    borderLeftStyle: "solid",
    borderLeftColor: colors.medium,
    fontWeight: isBoldRow ? "bold" : "initial",
    borderBottomStyle: "solid",
    borderBottomColor: colors.medium,
    textAlign: isSideHeader ? "left" : "center",
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
    borderBottomWidth: isLastRow ? 2 : 1,
    borderBottomColor: isLastRow ? colors.medium : colors.lighter,
    height: isLastRow ? 22 : 23,
  };
};

// Styled stack container for the loader content
export const LoaderContent = styled(Stack)({
  backgroundColor: colors.lighter,
  borderRadius: 45,
  flexDirection: "row",
  alignItems: "center",
  gap: 15,
  padding: "15px 20px",
});

// Styled typography for the loader text
export const LoaderText = styled(Typography)({
  color: colors.medium,
});

// Styled circular progress indicator
export const StyledCircularProgress = styled(CircularProgress)({
  color: colors.medium,
});

export const TablesWrapper = styled(Stack)({
  gap: 33,
  flexDirection: "row",
  overflowX: "auto",
  width: "calc(100vw - 8rem)",
  paddingBottom: 8,
  height: 200,
});

export const LoaderContentWrapper = styled(Stack)({
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
});

export const ChildrenWrapper = styled(Stack)({
  flexDirection: "row",
  gap: 5,
  marginLeft: 20,
  paddingLeft: 20,
  borderLeft: `2px solid ${colors.medium}`,
  alignItems: "center",
});
