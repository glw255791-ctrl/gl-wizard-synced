import { CommonProps } from "@mui/material/OverridableComponent";
import { colors } from "../../../assets/colors";
import { Button, Stack, styled, Typography } from "@mui/material";
import CancelRounded from "@mui/icons-material/CancelRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Column keys for consistent use throughout
const VALUE = "value";
const RESULT = "result";
const ACCOUNT = "account";
const REVERSAL = "reversal";

// Styled icons
export const CheckedIcon = styled(CheckCircleIcon)({
  color: colors.green,
  fontSize: 22,
});

export const UncheckedIcon = styled(CancelRounded)({
  color: colors.gray,
  fontSize: 22,
});

// Styled containers and elements
export const ReversalCellWrapper = styled(Stack)({
  flex: 1,
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "row",
  gap: 5,
});

export const LabelText = styled(Typography)({
  fontSize: 14,
});

export const Wrapper = styled(Stack)({
  borderRadius: 8,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: colors.medium,
});

export const TableHeaderStyled = styled(Stack)({
  width: "calc(100vw - 28rem + 1px)",
  padding: "1rem",
  backgroundColor: colors.medium,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopLeftRadius: 7,
  borderTopRightRadius: 7,
});

export const TableTitle = styled(Typography)({
  fontSize: 20,
  fontWeight: "bold",
});

export const ExcelDownloadButton = styled(Button)({
  paddingLeft: 16,
  paddingRight: 16,
  borderRadius: 16,
  height: 32,
  backgroundColor: colors.action,
  textTransform: "none",
});

// Styles used in table rendering
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
    borderRightWidth: 1,
    borderRightColor: colors.honeydew,
    fontWeight: "initial",
    textAlign: "left",
    borderBottomWidth: 1,
    borderBottomColor: colors.honeydew,
    height: 23,
  },
  headerCell: {
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    flex: 1,
    textAlign: "left",
    padding: "0 5px",
    borderRightWidth: 1,
    borderRightColor: colors.lighter,
    fontWeight: "bold",
    justifyContent: "center",
    backgroundColor: colors.medium,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.lighter,
    height: 22,
  },
  autoSizer: {
    width: "100%",
    height: 600,
    backgroundColor: colors.medium,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  headerWrapper: {
    margin: 0,
    height: 24,
    marginRight: 0.5,
  },
  columnStyle: {
    margin: 0,
    backgroundColor: colors.white,
  },
};

// Cell style by column key
export const getCellStyleByHeader = (key: string): React.CSSProperties => {
  switch (key) {
    case VALUE:
      return { textAlign: "right" };
    case RESULT:
    case REVERSAL:
      return {
        fontWeight: "bold",
        backgroundColor: colors.lighter,
      };
    case ACCOUNT:
      return { fontWeight: "bold" };
    default:
      return {};
  }
};
