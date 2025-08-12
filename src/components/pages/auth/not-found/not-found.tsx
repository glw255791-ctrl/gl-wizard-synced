import { Stack, Button, Box, Typography } from "@mui/material";
import { styles } from "../style";
import logo from "../logo.png";
import { useNavigate } from "react-router";
export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Stack style={styles.root}>
      <Stack style={styles.loginBlock}>
        <Stack style={styles.imageAndLogo}>
          <Box component={"img"} style={styles.image} src={logo} />
          <Typography style={styles.label}>GL Wizard</Typography>
        </Stack>
        <Typography style={styles.message}>
          The page you requested does not exist.
        </Typography>
        <Button style={styles.button} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Stack>
    </Stack>
  );
}
