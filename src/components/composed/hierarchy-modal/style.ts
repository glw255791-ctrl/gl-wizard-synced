import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { theme } from "../../../constants/theme";

// Modal content container (positioning the modal, centering, etc.)
export const ModalContent = styled(Stack)(() => ({
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.sm,
  justifyContent: "center",
  alignItems: "center",
  padding: `${theme.padding.lg} ${theme.padding.none}`,
}));

// Inner content of the modal (vertically stacks the parts)
export const ModalInnerContent = styled(Stack)(() => ({
  flex: 1,
  width: "100%",
  padding: theme.padding.none,
  justifyContent: "flex-start",
}));

// Modal header (title row with styling)
export const ModalHeader = styled(Stack)(() => ({
  height: "30px",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: `${theme.padding.sm} ${theme.padding.lg} ${theme.padding.lg} ${theme.padding.lg}`,
  borderBottom: `${theme.borderWidth.sm} solid ${theme.colors.gray}`,
}));

// The paragraph message (normal text in the modal)
export const Message = styled(Typography)(() => ({
  color: theme.colors.black,
  textAlign: "center",
}));

// A bold highlight/emphasis text
export const Highlight = styled(Typography)(() => ({
  color: theme.colors.black,
  fontWeight: "bold",
}));

// Modal content wrapper (for the body, aligns content)
export const ModalContentWrapper = styled(Stack)(() => ({
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gap: theme.gap.lg,
  padding: theme.padding.lg,
}));

// Title of the modal
export const Title = styled(Typography)(() => ({
  textAlign: "center",
  color: theme.colors.black,
  flex: 1,
  fontWeight: "bold",
  fontSize: theme.fontSize.xl,
}));

export const ButtonsWrapper = styled(Stack)(() => ({
  flexDirection: "row",
  gap: theme.gap.md,
  justifyContent: "center",
  alignItems: "center",
}));

export const ButtonStyled = styled(Button)({
  paddingLeft: theme.padding.lg,
  paddingRight: theme.padding.lg,
  borderRadius: theme.borderRadius.lg,
  height: theme.height.input,
  backgroundColor: theme.colors.action,
  textTransform: "none",
});
