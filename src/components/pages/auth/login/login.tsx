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
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export function LoginPage() {
  const { router, fieldErrors, onLogin, submitting, onChangeField, loginData } =
    useLoginModel();
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit =
    loginData.email.trim().length > 0 && loginData.password.trim().length > 0;

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) {
      router.replace(`/reset-password${window.location.hash}`);
      return;
    }
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
          if (!canSubmit || submitting) return;
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
          <Subtitle>Sign in to continue.</Subtitle>
        </ImageAndLogo>
        <InputWrapper>
          <TextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={loginData.email}
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
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={loginData.password}
            error={!!fieldErrors.password}
            onChange={(e) => onChangeField("password", e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </InputWrapper>
        <LoginButton
          type="submit"
          fullWidth
          disabled={!canSubmit || submitting}
          startIcon={
            submitting ? (
              <CircularProgress size={18} color="inherit" />
            ) : undefined
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
