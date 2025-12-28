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
export function UnauthorizedPage() {
  const router = useRouter();
  return (
    <Root>
      <LoginBlock>
        <ImageAndLogo>
          <LogoImage src={"/logo.png"} />
          <Label>GL Wizard</Label>
        </ImageAndLogo>
        <Message>You are not authorized or your session expired.</Message>
        <StyledButton onClick={() => router.push("/login")}>Login</StyledButton>
      </LoginBlock>
    </Root>
  );
}
