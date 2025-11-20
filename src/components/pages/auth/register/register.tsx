import {
  Root,
  LoginBlock,
  ImageAndLogo,
  LogoImage,
  Label,
  StyledButton,
  InputWrapper,
  StyledInput,
  ErrorsBlock,
  ErrorText,
} from "./style";
import logo from "../logo.png";
import { useRegisterModel } from "./register-model";

import { TextField } from "@mui/material";

export function RegisterPage() {
  const { onRegister, onChangeField, fieldErrors, registerData } =
    useRegisterModel();

  return (
    <Root>
      <LoginBlock>
        <ImageAndLogo>
          <LogoImage src={logo} />
          <Label>GL Wizard</Label>
        </ImageAndLogo>
        <InputWrapper>
          <TextField
            placeholder="Name"
            error={!!fieldErrors.name}
            value={registerData.name}
            onChange={(e) => onChangeField("name", e.target.value)}
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
            value={registerData.password}
            onChange={(e) => onChangeField("password", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onRegister();
            }}
            fullWidth
            variant="outlined"
            slotProps={{ input: { style: StyledInput } }}
          />
        </InputWrapper>
        <StyledButton onClick={onRegister}>
          Register
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
