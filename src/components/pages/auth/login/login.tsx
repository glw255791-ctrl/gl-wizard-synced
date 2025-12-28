"use client";
import {
  Root,
  LoginBlock,
  ImageAndLogo,
  LogoImage,
  Label,
  LoginButton,
  InputWrapper,
  StyledInput,
  ErrorsBlock,
  ErrorText,
} from "./style";
import { useLoginModel } from "./login-model";
import { useEffect } from "react";
import { supabase } from "@/api/supabase-client";
import { TextField } from "@mui/material";

export function LoginPage() {
  const { loginData, onChangeField, router, fieldErrors, onLogin } =
    useLoginModel();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

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
          <LogoImage src={"/logo.png"} />
          <Label>GL Wizard</Label>
        </ImageAndLogo>
        <InputWrapper>
          <TextField
            placeholder="Email"
            type="email"
            error={!!fieldErrors.email}
            value={loginData.email}
            onChange={(e) => onChangeField("email", e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{ input: { style: StyledInput } }}
          />
        </InputWrapper>
        <InputWrapper>
          <TextField
            placeholder="Password"
            type="password"
            error={!!fieldErrors.password}
            value={loginData.password}
            onChange={(e) => onChangeField("password", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onLogin();
            }}
            fullWidth
            variant="outlined"
            slotProps={{ input: { style: StyledInput } }}
          />
        </InputWrapper>
        <LoginButton onClick={onLogin}>Login</LoginButton>
        <ErrorsBlock>
          {Object.values(fieldErrors).map((err, idx) => (
            <ErrorText key={idx}>{err}</ErrorText>
          ))}
        </ErrorsBlock>
      </LoginBlock>
    </Root>
  );
}
