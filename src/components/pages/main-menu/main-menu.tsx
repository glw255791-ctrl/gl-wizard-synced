"use client";

import { Grid2 } from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import GroupIcon from "@mui/icons-material/Group";
import { useRouter } from "next/navigation";
import { ButtonsWrapper, CardCopy, CardHint, CardTitle, MenuPanel, PanelHeading, PanelIntro, PanelText, Root, StyledMenuButton } from "./style";

import { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
import { theme } from "@/constants/theme";
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
        <MenuPanel>
            <PanelIntro>
              <PanelHeading>Main Menu</PanelHeading>
              <PanelText>Open a ledger review, or manage accounts.</PanelText>
            </PanelIntro>
            <ButtonsWrapper container spacing={2}>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                accent={theme.colors.action}
                onClick={() => router.push("/general-analysis")}
              >
                <span className="card-mark">
                  <TableChartIcon />
                </span>
                <CardCopy>
                  <CardTitle>GL Transactions Analysis</CardTitle>
                  <CardHint>Map the ledger and name each journal.</CardHint>
                </CardCopy>
              </StyledMenuButton>
            </Grid2>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                accent={theme.colors.freshBlue}
                onClick={() => router.push("/reversal-analysis")}
              >
                <span className="card-mark">
                  <RepeatOnIcon />
                </span>
                <CardCopy>
                  <CardTitle>Reversal</CardTitle>
                  <CardHint>Find entries that cancel each other.</CardHint>
                </CardCopy>
              </StyledMenuButton>
            </Grid2>
            <Grid2 size={isAdmin ? 6 : 4}>
              <StyledMenuButton
                accent={theme.colors.softBlue}
                onClick={() =>
                  router.push("/reversal-reclassification-analysis")
                }
              >
                <span className="card-mark">
                  <ShuffleOnIcon />
                </span>
                <CardCopy>
                  <CardTitle>Reversal/Reclassification</CardTitle>
                  <CardHint>Group moves on the same account.</CardHint>
                </CardCopy>
              </StyledMenuButton>
            </Grid2>
            {isAdmin && (
              <Grid2 size={6}>
                <StyledMenuButton
                  accent={theme.colors.yellow}
                  onClick={() => router.push("/user-management")}
                >
                  <span className="card-mark">
                    <GroupIcon />
                  </span>
                  <CardCopy>
                    <CardTitle>User Management</CardTitle>
                    <CardHint>Invite people and extend licences.</CardHint>
                  </CardCopy>
                </StyledMenuButton>
              </Grid2>
            )}
            </ButtonsWrapper>
          </MenuPanel>
      </Root>
    </PageWrapper>
  );
}
