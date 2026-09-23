"use client";

import { Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";
import { ButtonsWrapper, CardCopy, CardHint, CardTitle, MenuPanel, PanelHeading, PanelIntro, PanelText, Root, StyledMenuButton } from "./style";

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
    if (!supabaseBrowser) return;

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
          <MenuPanel>
            <PanelIntro>
              <PanelHeading>Workspace</PanelHeading>
              <PanelText>Open a ledger review, or manage accounts.</PanelText>
            </PanelIntro>
            <ButtonsWrapper container spacing={2}>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                bgImage={"/images/gl-transactions-analysis.jpg"}
                accent="#B8C96B"
                onClick={() => router.push("/general-analysis")}
              >
                <span className="card-photo" />
                <CardCopy>
                  <CardTitle>GL Transactions Analysis</CardTitle>
                  <CardHint>Map the ledger and name each journal.</CardHint>
                </CardCopy>
              </StyledMenuButton>
            </Grid2>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                bgImage={"/images/reversal.jpg"}
                accent="#5A9298"
                onClick={() => router.push("/reversal-analysis")}
              >
                <span className="card-photo" />
                <CardCopy>
                  <CardTitle>Reversal</CardTitle>
                  <CardHint>Find entries that cancel each other.</CardHint>
                </CardCopy>
              </StyledMenuButton>
            </Grid2>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                bgImage={"/images/reversal-reclassification.jpg"}
                accent="#A9C8C9"
                onClick={() =>
                  router.push("/reversal-reclassification-analysis")
                }
              >
                <span className="card-photo" />
                <CardCopy>
                  <CardTitle>Reversal/reclassification</CardTitle>
                  <CardHint>Group moves on the same account.</CardHint>
                </CardCopy>
              </StyledMenuButton>
            </Grid2>
            {isAdmin && (
              <Grid2 size={6}>
                <StyledMenuButton
                  bgImage={"/images/user-management.jpg"}
                accent="#E8D75A"
                  onClick={() => router.push("/user-management")}
                >
                  <span className="card-photo" />
                  <CardCopy>
                    <CardTitle>User management</CardTitle>
                    <CardHint>Invite people and extend licences.</CardHint>
                  </CardCopy>
                </StyledMenuButton>
              </Grid2>
            )}
            </ButtonsWrapper>
          </MenuPanel>
        )}
      </Root>
    </PageWrapper>
  );
}
