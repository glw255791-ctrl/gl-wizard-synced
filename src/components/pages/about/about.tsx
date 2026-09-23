"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
import {
  RootStack,
  ContentWrapper,
  TextWrapper,
  StyledTitle,
  StyledList,
} from "./style";

export function AboutPage() {
  const [licence, setLicence] = useState("Checking your licence…");

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

      if (profile.role === "admin") {
        setLicence("Administrator accounts do not expire.");
        return;
      }

      const date = profile.licence_valid_until
        ? new Date(profile.licence_valid_until).toLocaleDateString("de-DE")
        : "";
      setLicence(
        date
          ? `Your licence is valid until ${date}.`
          : "No licence date is set."
      );
    };

    loadLicence();
  }, []);

  return (
    <PageWrapper>
      <RootStack>
        <Header title="About GL Wizard" />
        <ContentWrapper>
          <TextWrapper>
            <StyledList>
              <li>
                Upload a general ledger and a chart of accounts, map the
                columns, and review journals, reversals, and reclassifications.
              </li>
              <li>
                The ledger stays in the browser. Accounts and licences are the
                only data stored for sign-in.
              </li>
              <li>
                It is meant for finance teams, auditors, and consultants who
                prepare and reconcile GL data.
              </li>
            </StyledList>
          </TextWrapper>
          <TextWrapper>
            <StyledTitle>Version and support</StyledTitle>
            <StyledList>
              <li>GL Wizard 0.0.0</li>
              <li>{licence}</li>
              <li>For help with sign-in or a licence, ask your administrator.</li>
            </StyledList>
          </TextWrapper>
        </ContentWrapper>
      </RootStack>
    </PageWrapper>
  );
}
