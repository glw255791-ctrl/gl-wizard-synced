import {
  Root,
  LoginBlock,
  ImageAndLogo,
  LogoImage,
  Label,
  Message,
  StyledButton,
} from "../style";
import { useRouter } from "next/navigation";
export function LicenceExpiredPage() {
  const router = useRouter();
  return (
    <Root>
      <LoginBlock>
        <ImageAndLogo>
          <LogoImage src={"/logo.png"} />
          <Label>GL Wizard</Label>
        </ImageAndLogo>
        <Message>
          Your licence has expired. Please contact administrator to renew.
        </Message>
        <StyledButton onClick={() => router.push("/login")}>Login</StyledButton>
      </LoginBlock>
    </Root>
  );
}
