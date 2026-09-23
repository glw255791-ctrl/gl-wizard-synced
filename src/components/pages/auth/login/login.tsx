"use client";
import {
  Root,
  LoginBlock,
  ImageAndLogo,
  LogoImage,
  Label,
  Subtitle,
  LoginButton,
  InputWrapper,
  ErrorsBlock,
  ErrorText,
} from "./style";
import { useLoginModel } from "./login-model";
import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
import { TextField } from "@mui/material";

export function LoginPage() {
  const { loginData, onChangeField, router, fieldErrors, onLogin } =
    useLoginModel();

  useEffect(() => {
    if (!supabaseBrowser) return;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();

      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  return (
    <Root>
      <LoginBlock>
        <ImageAndLogo>
          <LogoImage src={"/logo.png"} alt="GL Wizard" />
          <Label>GL Wizard</Label>
          <Subtitle>Sign in to review a ledger.</Subtitle>
        </ImageAndLogo>
        <InputWrapper>
          <TextField
            label="Email"
            type="email"
            error={!!fieldErrors.email}
            value={loginData.email}
            onChange={(e) => onChangeField("email", e.target.value)}
            fullWidth
            variant="outlined"
          />
        </InputWrapper>
        <InputWrapper>
          <TextField
            label="Password"
            type="password"
            error={!!fieldErrors.password}
            value={loginData.password}
            onChange={(e) => onChangeField("password", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onLogin();
            }}
            fullWidth
            variant="outlined"
          />
        </InputWrapper>
        <LoginButton fullWidth onClick={onLogin}>
          Login
        </LoginButton>
        <ErrorsBlock>
          {Object.values(fieldErrors).map((err, idx) => (
            <ErrorText key={idx}>{err}</ErrorText>
          ))}
        </ErrorsBlock>
      </LoginBlock>
    </Root>
  );
}
