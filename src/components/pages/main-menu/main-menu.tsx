"use client";

import { Grid2, Stack, Typography } from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import GroupIcon from "@mui/icons-material/Group";
import { useRouter } from "next/navigation";
import {
  ButtonsWrapper,
  CardCopy,
  CardHint,
  CardTitle,
  MenuPanel,
  Root,
  StyledMenuButton,
  WelcomeBlock,
  WelcomeMeta,
  WelcomeTitle,
  SectionLabel,
} from "./style";

import { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
import { theme } from "@/constants/theme";

export function MainMenu() {
  const router = useRouter();

  const [userRole, setUserRole] = useState<"user" | "admin" | undefined>(
    undefined
  );
  const [displayName, setDisplayName] = useState("");
  const [licenceLabel, setLicenceLabel] = useState("");

  useEffect(() => {
    if (!supabaseBrowser) return;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabaseBrowser
        .from("profiles")
        .select("role, full_name, licence_valid_until")
        .eq("id", session.user.id)
        .single();

      if (!profile) return;

      setUserRole(profile.role);
      setDisplayName(
        String(profile.full_name || session.user.email || "").trim()
      );

      if (profile.licence_valid_until) {
        const expires = new Date(profile.licence_valid_until);
        if (!Number.isNaN(expires.getTime())) {
          setLicenceLabel(
            `Licence until ${expires.toLocaleDateString("en-GB")}`
          );
        }
      }
    };
    checkSession();
  }, [router]);

  const isAdmin = useMemo(() => userRole === "admin", [userRole]);
  const roleLabel =
    userRole === "admin"
      ? "Administrator"
      : userRole === "user"
        ? "User"
        : "";

  return (
    <PageWrapper>
      <Root>
        <Header />
        <MenuPanel>
          <WelcomeBlock>
            <WelcomeTitle>
              {displayName ? `Welcome, ${displayName}` : "Welcome"}
            </WelcomeTitle>
            <WelcomeMeta>
              {[roleLabel, licenceLabel].filter(Boolean).join(" · ") ||
                "Choose a workspace to continue."}
            </WelcomeMeta>
          </WelcomeBlock>

          <Stack gap={1} sx={{ flex: 1, minHeight: 0 }}>
            <SectionLabel>Workspaces</SectionLabel>
            <ButtonsWrapper container spacing={2}>
              <Grid2 size={isAdmin ? 6 : 4}>
                <StyledMenuButton
                  accent={theme.colors.darker}
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
            </ButtonsWrapper>
          </Stack>

          {isAdmin && (
            <Stack gap={1}>
              <SectionLabel>Administration</SectionLabel>
              <ButtonsWrapper container spacing={2} sx={{ flex: "0 0 auto" }}>
                <Grid2 size={6}>
                  <StyledMenuButton
                    accent={theme.colors.medium}
                    compact
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
              </ButtonsWrapper>
            </Stack>
          )}
        </MenuPanel>
      </Root>
    </PageWrapper>
  );
}
