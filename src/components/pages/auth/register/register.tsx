import { Stack, Button, TextField, Box, Typography } from "@mui/material";
import { styles } from "./register.style";
import logo from "../logo.png";
import { useRegisterModel } from "./register-model";
// import { supabase } from "../../../../api/api";

export function RegisterPage() {
  const { onRegister, onChangeField, fieldErrors, registerData } =
    useRegisterModel();

  return (
    <Stack style={styles.root}>
      <Stack style={styles.loginBlock}>
        <Stack style={styles.imageAndLogo}>
          <Box component={"img"} style={styles.image} src={logo} />
          <Typography style={styles.label}>GL Wizard</Typography>
        </Stack>
        <TextField
          placeholder="Name"
          error={!!fieldErrors.name}
          value={registerData.name}
          onChange={(e) => onChangeField("name", e.target.value)}
          style={styles.inputWrapper}
          slotProps={{ input: { style: styles.input } }}
        />
        <TextField
          placeholder="Password"
          type="password"
          error={!!fieldErrors.password}
          value={registerData.password}
          onChange={(e) => onChangeField("password", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onRegister();
          }}
          slotProps={{ input: { style: styles.input } }}
          style={styles.inputWrapper} />
        <Button style={styles.button} onClick={onRegister}>
          Register
        </Button>
        <Stack style={styles.errors}>
          {Object.values(fieldErrors).map((err) => (
            <Typography style={styles.error}>{err}</Typography>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
