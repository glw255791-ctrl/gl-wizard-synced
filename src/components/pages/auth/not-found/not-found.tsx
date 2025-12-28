"use client";

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

export function NotFoundPage() {
  const router = useRouter();
  return (
    <Root>
      <LoginBlock>
        <ImageAndLogo>
          <LogoImage src={"/logo.png"} />
          <Label>GL Wizard</Label>
        </ImageAndLogo>
        <Message>The page you requested does not exist.</Message>
        <StyledButton onClick={() => router.back()}>Back</StyledButton>
      </LoginBlock>
    </Root>
  );
}
