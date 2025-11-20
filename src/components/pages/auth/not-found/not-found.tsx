import {
  Root,
  LoginBlock,
  ImageAndLogo,
  LogoImage,
  Label,
  Message,
  StyledButton,
} from "../style";
import logo from "../logo.png";
import { useNavigate } from "react-router";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Root>
      <LoginBlock>
        <ImageAndLogo>
          <LogoImage src={logo} />
          <Label>GL Wizard</Label>
        </ImageAndLogo>
        <Message>
          The page you requested does not exist.
        </Message>
        <StyledButton onClick={() => navigate(-1)}>
          Back
        </StyledButton>
      </LoginBlock>
    </Root>
  );
}
