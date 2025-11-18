import { Stack, Button, TextField, Box, Typography } from "@mui/material";
import { styles } from "./login.style";
import logo from "../logo.png";
import { useLoginModel } from "./login-model";
import { useEffect } from "react";
import { supabase } from "../../../../api/api";
export function LoginPage() {
  const { loginData, onChangeField, navigate, fieldErrors, onLogin } =
    useLoginModel();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate("/dashboard");
      }
    };

    checkSession();
  }, [navigate]);
  return (
    <Stack style={styles.root}>
      <Stack style={styles.loginBlock}>
        <Stack style={styles.imageAndLogo}>
          <Box component={"img"} style={styles.image} src={logo} />
          <Typography style={styles.label}>GL Wizard</Typography>
        </Stack>
        <TextField
          placeholder="Email"
          type="email"
          error={!!fieldErrors.email}
          value={loginData.email}
          onChange={(e) => onChangeField("email", e.target.value)}
          style={styles.inputWrapper}
          slotProps={{ input: { style: styles.input } }}
        />
        <TextField
          placeholder="Password"
          type="password"
          error={!!fieldErrors.password}
          value={loginData.password}
          onChange={(e) => onChangeField("password", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onLogin();
          }}
          style={styles.inputWrapper}
          slotProps={{ input: { style: styles.input } }}
        />
        <Button style={styles.button} onClick={onLogin}>
          Login
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
