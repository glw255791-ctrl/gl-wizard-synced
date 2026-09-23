import { useRouter } from "next/navigation";
import {
  HeaderBtnsWrapper,
  HeaderBtnsWrapperRight,
  HeaderWrapper,
  IconButtonStyled,
  Title,
  Wrapper,
} from "./style";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Tooltip from "@mui/material/Tooltip";
import { AnalysisStep } from "@/types";
import { StepRail } from "../step-rail/step-rail";

interface Props {
  title?: string;
  onPressResetBtn?: () => void;
  step?: AnalysisStep;
}

export const Header = ({ title, onPressResetBtn, step }: Props) => {
  const router = useRouter();

  return (
    <Wrapper data-page-header>
      <HeaderWrapper sx={step != null ? { marginBottom: "1.15rem" } : undefined}>
        <HeaderBtnsWrapper>
          {title && (
            <Tooltip title="Back to main menu">
              <IconButtonStyled
                aria-label="Back to main menu"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowBackIcon />
              </IconButtonStyled>
            </Tooltip>
          )}
          {onPressResetBtn && (
            <Tooltip title="Reset">
              <IconButtonStyled aria-label="Reset" onClick={onPressResetBtn}>
                <RestartAltIcon />
              </IconButtonStyled>
            </Tooltip>
          )}
        </HeaderBtnsWrapper>

        <Title>{title ?? "Main Menu"}</Title>

        <HeaderBtnsWrapperRight />
      </HeaderWrapper>
      {step != null && <StepRail step={step} />}
    </Wrapper>
  );
};
