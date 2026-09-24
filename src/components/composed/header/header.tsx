import { useRouter } from "next/navigation";
import {
  Description,
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
import { Stack } from "@mui/material";

interface Props {
  title?: string;
  description?: string;
  onPressResetBtn?: () => void;
  step?: AnalysisStep;
}

export const Header = ({
  title,
  description,
  onPressResetBtn,
  step,
}: Props) => {
  const router = useRouter();

  return (
    <Wrapper data-page-header>
      <HeaderWrapper>
        <HeaderBtnsWrapper>
          {title && (
            <Tooltip title="Back to dashboard">
              <IconButtonStyled
                aria-label="Back to dashboard"
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

        <Stack alignItems="center" sx={{ minWidth: 0, px: 1 }}>
          <Title>{title ?? "Dashboard"}</Title>
          {description ? <Description>{description}</Description> : null}
        </Stack>

        <HeaderBtnsWrapperRight />
      </HeaderWrapper>
      {step != null && (
        <Stack sx={{ marginTop: "0.95rem" }}>
          <StepRail step={step} />
        </Stack>
      )}
    </Wrapper>
  );
};
