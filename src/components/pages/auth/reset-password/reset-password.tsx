"use client";

import { useState } from "react";
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

export function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabaseBrowser) {
      setError("Sign-in is not configured.");
      return;
    }
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
          />
        </InputWrapper>
        <ErrorsBlock>
          <ErrorText>{error}</ErrorText>
        </ErrorsBlock>
        <LoginButton type="submit" disabled={submitting} fullWidth>
          {submitting ? "Saving..." : "Save password"}
        </LoginButton>
      </LoginBlock>
    </Root>
  );
}
