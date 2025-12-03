import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ButtonsWrapper, StyledButton } from "./styles";

interface Props {
  onPressUndo: () => void;
  disabled: boolean;
}
export function UndoButton(props: Props) {
  const { onPressUndo, disabled } = props;
  return (
    <ButtonsWrapper>
      <StyledButton
        disabled={disabled}
        onClick={onPressUndo}
        variant="contained"
        endIcon={<ArrowBackIcon />}
      >
        Undo last step
      </StyledButton>
    </ButtonsWrapper>
  );
}
