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
export function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <Root>
      <LoginBlock>
        <ImageAndLogo>
          <LogoImage src={logo} />
          <Label>GL Wizard</Label>
        </ImageAndLogo>
        <Message>
          You are not authorized or your session expired.
        </Message>
        <StyledButton onClick={() => navigate("/login")}>
          Login
        </StyledButton>
      </LoginBlock>
    </Root>
  );
}
