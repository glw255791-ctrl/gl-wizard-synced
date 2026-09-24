"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@mui/material";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
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
} from "../login/style";

async function ensureRecoverySession() {
  if (!supabaseBrowser) return false;

  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (accessToken && refreshToken) {
    const { error } = await supabaseBrowser.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
    window.history.replaceState(null, "", "/reset-password");
    return true;
  }

  const code = new URLSearchParams(window.location.search).get("code");
  if (code) {
    const { error } = await supabaseBrowser.auth.exchangeCodeForSession(code);
    if (error) throw error;
    window.history.replaceState(null, "", "/reset-password");
    return true;
  }

  const {
    data: { session },
  } = await supabaseBrowser.auth.getSession();
  return Boolean(session);
}

export function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    ensureRecoverySession()
      .then((ok) => {
        setReady(ok);
        if (!ok) {
          setError("This reset link is missing or expired. Send a new one.");
        }
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Could not open the reset link."
        );
      });
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabaseBrowser || !ready) return;
    if (password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError("");
    const { error: updateError } = await supabaseBrowser.auth.updateUser({
      password,
    });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <Root>
      <LoginBlock component="form" onSubmit={onSubmit}>
        <ImageAndLogo>
          <LogoImage src="/logo.png" alt="GL Wizard" />
          <Label>GL Wizard</Label>
          <Subtitle>Choose a new password for this account.</Subtitle>
        </ImageAndLogo>
        <InputWrapper>
          <TextField
            label="New password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
            variant="outlined"
            disabled={!ready}
          />
        </InputWrapper>
        <InputWrapper>
          <TextField
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            fullWidth
            variant="outlined"
            disabled={!ready}
          />
        </InputWrapper>
        <ErrorsBlock>
          <ErrorText>{error}</ErrorText>
        </ErrorsBlock>
        <LoginButton type="submit" disabled={submitting || !ready} fullWidth>
          {submitting ? "Saving..." : "Save password"}
        </LoginButton>
      </LoginBlock>
    </Root>
  );
}
