import { Grid2, Stack, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { colors } from "../../../assets/colors";
import logo from "./logo.png";
import { styles } from "./main-menu.style";
import { Header } from "../../composed/header/header";
// import { supabase } from "../../../api/api";
import { useEffect, useState } from "react";

export function MainMenu() {
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState<"USER" | "ADMIN">("USER");
  useEffect(() => {
    setUserRole("USER");
    // const checkSession = async () => {
    //   const {
    //     data: { session },
    //   } = await supabase.auth.getSession();
    //   if (session) {
    //     const { data: profile, error } = await supabase
    //       .from("profiles")
    //       .select("user_role")
    //       .eq("id", session.user.id)
    //       .single();
    //     if (error || !profile) {
    //       return;
    //     }
    //     setUserRole(profile.user_role);
    //   }
    // };
    // checkSession();
  }, [navigate]);

  return (
    <Stack style={styles.root}>
      <Header />
      <Grid2 container spacing={2}>
        <Grid2 size={4}>
          <Stack style={{ ...styles.button, ...styles.logoWrapper }}>
            <Box component={"img"} style={styles.image} src={logo} />
            <Typography style={styles.label}>GL Wizard</Typography>
          </Stack>
        </Grid2>
        <Grid2 size={8}>
          <Button
            style={{ ...styles.button, backgroundColor: colors.powderBlue }}
            onClick={() => navigate("/general-analysis")}
          >
            <Typography variant="h5" color="#333633" fontWeight={"bold"}>
              General analysis
            </Typography>
          </Button>
        </Grid2>
        <Grid2 size={userRole === "ADMIN" ? 4 : 6}>
          <Button
            style={{ ...styles.button, backgroundColor: colors.tifanyBlue }}
            onClick={() => navigate("/reversal-analysis")}
          >
            <Typography variant="h5" color="#333633" fontWeight={"bold"}>
              Reversal
            </Typography>
          </Button>
        </Grid2>
        <Grid2 size={userRole === "ADMIN" ? 4 : 6}>
          <Button
            style={{ ...styles.button, backgroundColor: colors.vistaBlue }}
            onClick={() => navigate("/reversal-reclassification-analysis")}
          >
            <Typography variant="h5" color="#333633" fontWeight={"bold"}>
              Reversal/reclassification
            </Typography>
          </Button>
        </Grid2>

        {userRole === "ADMIN" && (
          <Grid2 size={4}>
            <Button
              style={{ ...styles.button, backgroundColor: colors.honeydew }}
              onClick={() => navigate("/user-management")}
            >
              <Typography variant="h5" color="#333633" fontWeight={"bold"}>
                User management
              </Typography>
            </Button>
          </Grid2>
        )}
      </Grid2>
    </Stack>
  );
}
