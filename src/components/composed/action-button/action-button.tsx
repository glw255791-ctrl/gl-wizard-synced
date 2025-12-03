import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import { ButtonsWrapper, StyledButton } from "./styles";

interface Props {
  onPressAnalyzeData: () => void;
  disabled: boolean;
}
export function ActionButton(props: Props) {
  const { onPressAnalyzeData, disabled } = props;
  return (
    <ButtonsWrapper>
      <StyledButton
        disabled={disabled}
        onClick={onPressAnalyzeData}
        variant="contained"
        endIcon={<TroubleshootIcon />}
      >
        Generate
      </StyledButton>
    </ButtonsWrapper>
  );
}
