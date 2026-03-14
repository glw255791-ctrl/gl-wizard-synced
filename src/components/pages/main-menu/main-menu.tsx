"use client";

import { Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";
import { ButtonsWrapper, Root, StyledMenuButton } from "./style";

import { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
export function MainMenu() {
  const router = useRouter();

  const [userRole, setUserRole] = useState<"user" | "admin" | undefined>(
    undefined,
  );
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();
      if (session) {
        const { data: profile, error } = await supabaseBrowser
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
  }, [router]);

  const isAdmin = useMemo(() => userRole === "admin", [userRole]);

  return (
    <PageWrapper>
      <Root>
        <Header />
        {userRole && (
          <ButtonsWrapper container spacing={3}>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                bgImage={"/images/gl-transactions-analysis.jpg"}
                onClick={() => router.push("/general-analysis")}
              >
                GL Transactions Analysis
              </StyledMenuButton>
            </Grid2>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                bgImage={"/images/reversal.jpg"}
                onClick={() => router.push("/reversal-analysis")}
              >
                Reversal
              </StyledMenuButton>
            </Grid2>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                bgImage={"/images/reversal-reclassification.jpg"}
                onClick={() =>
                  router.push("/reversal-reclassification-analysis")
                }
              >
                Reversal/reclassification
              </StyledMenuButton>
            </Grid2>
            {isAdmin && (
              <Grid2 size={6}>
                <StyledMenuButton
                  bgImage={"/images/user-management.jpg"}
                  onClick={() => router.push("/user-management")}
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
