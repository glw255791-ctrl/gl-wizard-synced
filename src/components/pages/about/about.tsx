"use client";

import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
import {
  RootStack,
  ContentWrapper,
  Intro,
  SectionLabel,
  Panel,
  PanelTitle,
  PanelBody,
  FeatureList,
  MetaRow,
  MetaLabel,
  MetaValue,
} from "./style";

export function AboutPage() {
  const [licence, setLicence] = useState("Checking your licence…");
  const [roleLabel, setRoleLabel] = useState("");

  useEffect(() => {
    if (!supabaseBrowser) return;

    const loadLicence = async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabaseBrowser
        .from("profiles")
        .select("licence_valid_until, role")
        .eq("id", session.user.id)
        .single();

      if (!profile) return;

      setRoleLabel(
        profile.role === "admin" ? "Administrator" : "User"
      );

      if (profile.role === "admin") {
        setLicence("Does not expire");
        return;
      }

      const date = profile.licence_valid_until
        ? new Date(profile.licence_valid_until).toLocaleDateString("de-DE")
        : "";
      setLicence(date || "No licence date is set");
    };

    loadLicence();
  }, []);

  return (
    <PageWrapper>
      <RootStack>
        <Header title="About" />
        <Intro>
          GL Wizard helps finance teams review ledgers in the browser — map
          accounts, name journals, and find reversals without uploading the
          workbook to a server.
        </Intro>

        <Stack gap={1}>
          <SectionLabel>Product</SectionLabel>
          <ContentWrapper>
            <Panel>
              <PanelTitle>What it does</PanelTitle>
              <FeatureList>
                <li>
                  Upload a general ledger and chart of accounts, map columns,
                  then run GL, Reversal, or Reversal/Reclassification analysis.
                </li>
                <li>
                  Review Movement Tables, Process Analysis, and an optional
                  trial balance check on the Results step.
                </li>
                <li>
                  Built for finance teams, auditors, and consultants who prepare
                  and reconcile GL data.
                </li>
              </FeatureList>
            </Panel>

            <Panel>
              <PanelTitle>Privacy</PanelTitle>
              <PanelBody>
                Ledger files stay in your browser for the current session.
                Only account and licence data are stored for sign-in.
              </PanelBody>
              <PanelBody>
                Nothing from your Excel workbooks is sent to GL Wizard servers
                for analysis.
              </PanelBody>
            </Panel>
          </ContentWrapper>
        </Stack>

        <Stack gap={1}>
          <SectionLabel>Version and account</SectionLabel>
          <ContentWrapper>
            <Panel>
              <MetaRow>
                <MetaLabel>Version</MetaLabel>
                <MetaValue>GL Wizard 0.0.0</MetaValue>
              </MetaRow>
              <MetaRow>
                <MetaLabel>Your role</MetaLabel>
                <MetaValue>{roleLabel || "—"}</MetaValue>
              </MetaRow>
              <MetaRow>
                <MetaLabel>Licence</MetaLabel>
                <MetaValue>{licence}</MetaValue>
              </MetaRow>
            </Panel>

            <Panel>
              <PanelTitle>Support</PanelTitle>
              <PanelBody>
                For help with sign-in or a licence, ask your administrator.
              </PanelBody>
              <PanelBody>
                For how to prepare files and which analysis to use, open the
                User Manual.
              </PanelBody>
            </Panel>
          </ContentWrapper>
        </Stack>
      </RootStack>
    </PageWrapper>
  );
}
