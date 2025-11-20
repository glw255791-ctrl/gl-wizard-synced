import { Grid2 } from "@mui/material";
import { useNavigate } from "react-router";
import {
  ButtonsWrapper,
  Root,
  StyledMenuButton,
} from "./style";
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

  const [userRole, setUserRole] = useState<"user" | "admin" | undefined>(undefined);
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
      <Root>
        <Header />
        {userRole && (
          <ButtonsWrapper container spacing={3}>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                bgImage={glTransactionsImage}
                onClick={() => navigate("/general-analysis")}

              >
                GL Transactions Analysis
              </StyledMenuButton>
            </Grid2>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                bgImage={reversalImage}
                onClick={() => navigate("/reversal-analysis")}

              >
                Reversal
              </StyledMenuButton>
            </Grid2>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                bgImage={reversalReclassificationImage}
                onClick={() => navigate("/reversal-reclassification-analysis")}

              >
                Reversal/reclassification
              </StyledMenuButton>
            </Grid2>
            {isAdmin && (
              <Grid2 size={6}>
                <StyledMenuButton
                  bgImage={userManagementImage}
                  onClick={() => navigate("/user-management")}

                >
                  User management
                </StyledMenuButton>
              </Grid2>
            )}
          </ButtonsWrapper>
        )}
      </Root>
    </PageWrapper>
  );
}
