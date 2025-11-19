import { Grid2, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import { styles } from "./main-menu.style";
import { supabase } from "../../../api/api";
import { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";
import glTransactionsImage from "../../../assets/images/gl-transactions-analysis.jpg";
import reversalImage from "../../../assets/images/reversal.jpg";
import reversalReclassificationImage from "../../../assets/images/reversal-reclassification.jpg";
import userManagementImage from "../../../assets/images/user-management.jpg";

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

  const getButtonStyle = (image: string) => {
    return {
      ...styles.button,
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image})`,
      "&:hover": {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${image})`,
        fontSize: "1.21rem",
      }
    };
  };

  return (
    <PageWrapper>
      <Stack style={{ gap: "1rem", width: "calc(100vw - 24rem)" }}>
        <Header />
        <Grid2 container spacing={3} style={{ padding: '1rem' }}>
          <Grid2 size={6}>
            <Button
              sx={getButtonStyle(glTransactionsImage)}
              onClick={() => navigate("/general-analysis")}
            >
              GL Transactions Analysis
            </Button>
          </Grid2>
          <Grid2 size={6}>
            <Button
              sx={getButtonStyle(reversalImage)}
              onClick={() => navigate("/reversal-analysis")}
            >
              Reversal
            </Button>
          </Grid2>
          <Grid2 size={6}>
            <Button
              sx={getButtonStyle(reversalReclassificationImage)}
              onClick={() => navigate("/reversal-reclassification-analysis")}
            >

              Reversal/reclassification

            </Button>
          </Grid2>

          {isAdmin && (
            <Grid2 size={6}>
              <Button
                sx={getButtonStyle(userManagementImage)}
                onClick={() => navigate("/user-management")}
              >
                User management
              </Button>
            </Grid2>
          )}
        </Grid2>
      </Stack>
    </PageWrapper>
  );
}
