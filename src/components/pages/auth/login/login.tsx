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
import { TextField, CircularProgress } from "@mui/material";

export function LoginPage() {
  const { router, fieldErrors, onLogin, submitting, onChangeField } =
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
      <LoginBlock
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          onLogin({
            email: String(data.get("email") ?? ""),
            password: String(data.get("password") ?? ""),
          });
        }}
      >
        <ImageAndLogo>
          <LogoImage src={"/logo.png"} alt="GL Wizard" />
          <Label>GL Wizard</Label>
          <Subtitle>Sign in to review a ledger.</Subtitle>
        </ImageAndLogo>
        <InputWrapper>
          <TextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={!!fieldErrors.email}
            onChange={(e) => onChangeField("email", e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </InputWrapper>
        <InputWrapper>
          <TextField
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            error={!!fieldErrors.password}
            onChange={(e) => onChangeField("password", e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </InputWrapper>
        <LoginButton
          type="submit"
          fullWidth
          disabled={submitting}
          startIcon={
            submitting ? <CircularProgress size={18} color="inherit" /> : undefined
          }
        >
          {submitting ? "Signing in..." : "Login"}
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
