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
export function LogoutPage() {
  const router = useRouter();
  return (
    <Root>
      <LoginBlock>
        <ImageAndLogo>
          <LogoImage src={"/logo.png"} />
          <Label>GL Wizard</Label>
        </ImageAndLogo>
        <Message>You have succesfully logged out.</Message>
        <StyledButton onClick={() => router.push("/login")}>Login</StyledButton>
      </LoginBlock>
    </Root>
  );
}
