import { Grid2, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import { styles } from "./main-menu.style";
import { supabase } from "../../../api/api";
import { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";

export function MainMenu() {
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (error || !profile) {
          return;
        }
        setUserRole(profile.role);
      }
    };
    checkSession();
  }, [navigate]);

  const isAdmin = useMemo(() => userRole === "admin", [userRole]);

  return (
    <PageWrapper>
      <Stack style={{ gap: "1rem", width: "calc(100vw - 24rem)" }}>
        <Header />
        <Grid2 container spacing={2}>
          <Grid2 size={6}>
            <Button
              style={styles.button}
              onClick={() => navigate("/general-analysis")}
            >
              <Typography style={styles.btnLabel}>
                GL Transactions Analysis
              </Typography>
            </Button>
          </Grid2>
          <Grid2 size={6}>
            <Button
              style={styles.button}
              onClick={() => navigate("/reversal-analysis")}
            >
              <Typography style={styles.btnLabel}>Reversal</Typography>
            </Button>
          </Grid2>
          <Grid2 size={6}>
            <Button
              style={styles.button}
              onClick={() => navigate("/reversal-reclassification-analysis")}
            >
              <Typography style={styles.btnLabel}>
                Reversal/reclassification
              </Typography>
            </Button>
          </Grid2>

          {isAdmin && (
            <Grid2 size={6}>
              <Button
                style={styles.button}
                onClick={() => navigate("/user-management")}
              >
                <Typography style={styles.btnLabel}>User management</Typography>
              </Button>
            </Grid2>
          )}
        </Grid2>
      </Stack>
    </PageWrapper>
  );
}
