import { Grid2, Stack, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { styles } from "./main-menu.style";
import { Header } from "../../composed/header/header";
// import { supabase } from "../../../api/api";
import { useEffect, useState } from "react";
import { colors } from "../../../assets/colors";

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
      <Stack style={{ flexDirection: "row" }}>
        <Stack
          style={{
            width: 300,
            backgroundColor: colors.darker,
            borderRadius: 8,
            height: "calc(100vh - 4rem)",
            alignItems: "center",
          }}
        ></Stack>
        <Stack
          style={{
            width: "100%",
            minHeight: "calc(100vh - 4rem)",
            justifyContent: "flex-start",
            padding: "0 1rem 1rem 1rem",
            gap: "1rem",
          }}
        >
          <Header />
          <Grid2 container spacing={2}>
            <Grid2 size={6}>
              <Button
                style={styles.button}
                onClick={() => navigate("/general-analysis")}
              >
                <Typography variant="h5" color="#333633" fontWeight={"bold"}>
                  General analysis
                </Typography>
              </Button>
            </Grid2>
            <Grid2 size={6}>
              <Button
                style={styles.button}
                onClick={() => navigate("/reversal-analysis")}
              >
                <Typography variant="h5" color="#333633" fontWeight={"bold"}>
                  Reversal
                </Typography>
              </Button>
            </Grid2>
            <Grid2 size={6}>
              <Button
                style={styles.button}
                onClick={() => navigate("/reversal-reclassification-analysis")}
              >
                <Typography variant="h5" color="#333633" fontWeight={"bold"}>
                  Reversal/reclassification
                </Typography>
              </Button>
            </Grid2>

            {userRole === "ADMIN" && (
              <Grid2 size={6}>
                <Button
                  style={styles.button}
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
      </Stack>
    </Stack>
  );
}
