"use client";

import { Grid2, Stack } from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import GroupIcon from "@mui/icons-material/Group";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { useRouter } from "next/navigation";
import {
  ButtonsWrapper,
  CardCopy,
  CardHint,
  CardTitle,
  FlowDivider,
  FlowNum,
  FlowStep,
  FlowStrip,
  FlowText,
  MenuPanel,
  MetaChip,
  Root,
  SectionHeader,
  SectionHint,
  SectionLabel,
  StyledMenuButton,
  WelcomeChips,
  WelcomeCopy,
  WelcomeEyebrow,
  WelcomeHero,
  WelcomeMeta,
  WelcomeTitle,
} from "./style";

import { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
import { theme } from "@/constants/theme";
import { DashboardStartTip } from "../../composed/workflow-hints/dashboard-start-tip";

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
          <WelcomeHero>
            <WelcomeCopy>
              <WelcomeEyebrow>Dashboard</WelcomeEyebrow>
              <WelcomeTitle>
                {displayName ? `Welcome, ${displayName}` : "Welcome"}
              </WelcomeTitle>
              <WelcomeMeta>
                Choose a workspace to upload a ledger and run an analysis.
              </WelcomeMeta>
            </WelcomeCopy>
            <WelcomeChips>
              {roleLabel ? (
                <MetaChip>
                  <BadgeOutlinedIcon />
                  {roleLabel}
                </MetaChip>
              ) : null}
              {licenceLabel ? (
                <MetaChip>
                  <EventAvailableOutlinedIcon />
                  {licenceLabel}
                </MetaChip>
              ) : null}
            </WelcomeChips>
          </WelcomeHero>

          <FlowStrip>
            <FlowStep>
              <FlowNum>1</FlowNum>
              <FlowText>Upload the general ledger</FlowText>
            </FlowStep>
            <FlowDivider />
            <FlowStep>
              <FlowNum>2</FlowNum>
              <FlowText>Map columns and chart of accounts</FlowText>
            </FlowStep>
            <FlowDivider />
            <FlowStep>
              <FlowNum>3</FlowNum>
              <FlowText>Review Movement Tables and Process Analysis</FlowText>
            </FlowStep>
          </FlowStrip>

          <DashboardStartTip />

          <Stack gap={1.1}>
            <SectionHeader>
              <SectionLabel>Workspaces</SectionLabel>
              <SectionHint>Three analysis flows, same upload path</SectionHint>
            </SectionHeader>
            <ButtonsWrapper container spacing={2}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <StyledMenuButton
                  accent={theme.colors.deepTeal}
                  onClick={() => router.push("/general-analysis")}
                >
                  <span className="card-mark">
                    <TableChartIcon />
                  </span>
                  <CardCopy>
                    <CardTitle>GL Transactions Analysis</CardTitle>
                    <CardHint>Map the ledger and name each journal.</CardHint>
                  </CardCopy>
                  <ArrowForwardRoundedIcon className="card-arrow" />
                </StyledMenuButton>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
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
                  <ArrowForwardRoundedIcon className="card-arrow" />
                </StyledMenuButton>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <StyledMenuButton
                  accent={theme.colors.medium}
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
                  <ArrowForwardRoundedIcon className="card-arrow" />
                </StyledMenuButton>
              </Grid2>
            </ButtonsWrapper>
          </Stack>

          {isAdmin && (
            <Stack gap={1.1}>
              <SectionHeader>
                <SectionLabel>Administration</SectionLabel>
                <SectionHint>Account access and licences</SectionHint>
              </SectionHeader>
              <ButtonsWrapper container spacing={2}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <StyledMenuButton
                    accent={theme.colors.graphite}
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
                    <ArrowForwardRoundedIcon className="card-arrow" />
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
