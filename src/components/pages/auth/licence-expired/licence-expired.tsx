import { Root, LoginBlock, ImageAndLogo, LogoImage, Label, Message, StyledButton } from "../style";
import logo from "../logo.png";
import { useNavigate } from "react-router";
export function LicenceExpiredPage() {
  const navigate = useNavigate();
  return (
    <Root>
      <LoginBlock>
        <ImageAndLogo>
          <LogoImage src={logo} />
          <Label>GL Wizard</Label>
        </ImageAndLogo>
        <Message>
          Your licence has expired. Please contact administrator to renew.
        </Message>
        <StyledButton onClick={() => navigate("/login")}>
          Login
        </StyledButton>
      </LoginBlock>
    </Root>
  );
}
