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
          label="First name"
          error={!!fieldErrors.firstName}
          value={registerData.firstName}
          onChange={(e) => onChangeField("firstName", e.target.value)}
          style={styles.input}
        />
        <TextField
          label="Last name"
          error={!!fieldErrors.lastName}
          value={registerData.lastName}
          onChange={(e) => onChangeField("lastName", e.target.value)}
          style={styles.input}
        />
        <TextField
          label="Password"
          type="password"
          error={!!fieldErrors.password}
          value={registerData.password}
          onChange={(e) => onChangeField("password", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onRegister();
          }}
          style={styles.input}
        />
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
