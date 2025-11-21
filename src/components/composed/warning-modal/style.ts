import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { colors } from "../../../assets/colors";
import { Button } from "@mui/material";

// Modal content container (positioning the modal, centering, etc.)
export const ModalContent = styled(Stack)(() => ({
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: colors.white,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  padding: "15px 0",
}));

// Inner content of the modal (vertically stacks the parts)
export const ModalInnerContent = styled(Stack)(() => ({
  flex: 1,
  width: "100%",
  padding: 0,
  justifyContent: "flex-start",
}));

// Modal header (title row with styling)
export const ModalHeader = styled(Stack)(() => ({
  height: "30px",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "5px 15px 15px 15px",
  borderBottom: `1px solid ${colors.gray}`,
}));

// The paragraph message (normal text in the modal)
export const Message = styled(Typography)(() => ({
  color: colors.black,
  textAlign: "center",
}));

// A bold highlight/emphasis text
export const Highlight = styled(Typography)(() => ({
  color: colors.black,
  fontWeight: "bold",
}));

// Modal content wrapper (for the body, aligns content)
export const ModalContentWrapper = styled(Stack)(() => ({
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gap: 15,
  padding: 15,
}));

// Title of the modal
export const Title = styled(Typography)(() => ({
  textAlign: "center",
  color: colors.black,
  flex: 1,
  fontWeight: "bold",
  fontSize: 20,
}));

export const ButtonsWrapper = styled(Stack)(() => ({
  flexDirection: "row",
  gap: 10,
  justifyContent: "center",
  alignItems: "center",
}));

export const ButtonStyled = styled(Button)({
  paddingLeft: 16,
  paddingRight: 16,
  borderRadius: 16,
  height: 32,
  backgroundColor: colors.action,
  textTransform: "none",
});