import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import { ButtonsWrapper, StyledButton, CardStyled } from "./styles";

interface Props {
  onPressAnalyzeData: () => void;
  disabled: boolean;
}
export function ActionButton(props: Props) {
  const { onPressAnalyzeData, disabled } = props;
  return (
    <CardStyled
      disabled={disabled}
    >
      <ButtonsWrapper>
        <StyledButton
          onClick={onPressAnalyzeData}
          variant="contained"
          endIcon={<TroubleshootIcon />}
        >
          Generate
        </StyledButton>
      </ButtonsWrapper>
    </CardStyled>
  );
}
