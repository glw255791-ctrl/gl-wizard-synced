"use client";

import {
  Root,
  LoginBlock,
  ImageAndLogo,
  LogoImage,
  Label,
  Subtitle,
  StyledButton,
  InputWrapper,
  ErrorsBlock,
  ErrorText,
} from "./style";
import { useRegisterModel } from "./register-model";
import { CircularProgress, TextField } from "@mui/material";

export function RegisterPage() {
  const { onRegister, onChangeField, fieldErrors, registerData, submitting } =
    useRegisterModel();

  return (
    <Root>
      <LoginBlock>
        <ImageAndLogo>
          <LogoImage src={"/logo.png"} alt="GL Wizard" />
          <Label>GL Wizard</Label>
          <Subtitle>Set a name and password for this account.</Subtitle>
        </ImageAndLogo>
        <InputWrapper>
          <TextField
            label="Name"
            error={!!fieldErrors.name}
            value={registerData.name}
            onChange={(e) => onChangeField("name", e.target.value)}
            fullWidth
            variant="outlined"
          />
        </InputWrapper>
        <InputWrapper>
          <TextField
            label="Password"
            type="password"
            error={!!fieldErrors.password}
            value={registerData.password}
            onChange={(e) => onChangeField("password", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onRegister();
            }}
            fullWidth
            variant="outlined"
          />
        </InputWrapper>
        <StyledButton
          fullWidth
          disabled={submitting}
          onClick={onRegister}
          startIcon={
            submitting ? <CircularProgress size={18} color="inherit" /> : undefined
          }
        >
          {submitting ? "Saving..." : "Register"}
        </StyledButton>
        <ErrorsBlock>
          {Object.values(fieldErrors).map((err, idx) => (
            <ErrorText key={idx}>{err}</ErrorText>
          ))}
        </ErrorsBlock>
      </LoginBlock>
    </Root>
  );
}
