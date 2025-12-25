import HeightIcon from "@mui/icons-material/Height";
import { ButtonsWrapper, StyledButton } from "./styles";

interface Props {
  onPress: () => void;
  disabled: boolean;
}
export function HierarchyButton(props: Props) {
  const { onPress, disabled } = props;
  return (
    <ButtonsWrapper>
      <StyledButton
        disabled={disabled}
        onClick={onPress}
        variant="contained"
        endIcon={<HeightIcon />}
      >
        Set item hierarchy
      </StyledButton>
    </ButtonsWrapper>
  );
}
