"use client";

import { Stack } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";

import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";
import {
  RootStack,
  PagePanel,
  ContentWrapper,
  Panel,
  StyledTitle,
  StyledList,
  Intro,
  SectionLabel,
  AnalysisCard,
  AnalysisTitle,
  AnalysisMeta,
  AnalysisBody,
  DownloadButton,
  DownloadError,
} from "./style";

async function fetchAndDownloadFile(url: string, downloadName: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("File not found");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.href = blobUrl;
    tempLink.download = downloadName;
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobUrl);
    return true;
  } catch {
    return false;
  }
}

const analyses = [
  {
    title: "GL Transactions Analysis",
    meta: "Groups by journal + date · uses dictionary",
    body: "Names each balanced journal process from the dictionary or CoA display values, then builds Movement tables and Process Analysis.",
  },
  {
    title: "Reversal",
    meta: "Groups by journal + date · uses dictionary",
    body: "Finds chunks inside the same journal that sum to zero and marks them as reversals that cancel each other.",
  },
  {
    title: "Reversal / Reclassification",
    meta: "Groups by account + date · no dictionary",
    body: "Looks for zero-sum moves on the same account and date, with optional CoA filters. Labels them reversal/reclassification.",
  },
];

export function UserManualPage() {
  const [downloadError, setDownloadError] = useState("");

  const download = async (url: string, name: string) => {
    setDownloadError("");
    const ok = await fetchAndDownloadFile(url, name);
    if (!ok) {
      setDownloadError("Could not download that file. Try again in a moment.");
    }
  };

  return (
    <PageWrapper>
      <RootStack>
        <Header title="User Manual" />
        <PagePanel>
        <Intro>
          Prepare clean Excel files, choose the right analysis, then map columns
          and review the results.
        </Intro>

        <Stack gap={1}>
          <SectionLabel>Which analysis to use</SectionLabel>
          <ContentWrapper>
            {analyses.map((item) => (
              <AnalysisCard key={item.title}>
                <AnalysisTitle>{item.title}</AnalysisTitle>
                <AnalysisMeta>{item.meta}</AnalysisMeta>
                <AnalysisBody>{item.body}</AnalysisBody>
              </AnalysisCard>
            ))}
          </ContentWrapper>
        </Stack>

        <Stack gap={1}>
          <SectionLabel>Getting started</SectionLabel>
          <ContentWrapper>
            <Panel>
              <StyledTitle>General usage</StyledTitle>
              <StyledList>
                <li>
                  Upload a general ledger, a chart of accounts, and an optional
                  dictionary. Map the columns and check the validity bar before
                  Analyze.
                </li>
                <li>
                  On Results, use Movement Tables and Process Analysis. Undo
                  brings the upload and mapping fields back.
                </li>
                <li>
                  Download the templates on the right when you need a starting
                  CoA or dictionary.
                </li>
              </StyledList>
            </Panel>

            <Panel>
              <StyledTitle>Templates</StyledTitle>
              <Stack gap={1}>
                <DownloadButton
                  onClick={() =>
                    download("/assets/files/serbia-coa.xlsx", "Serbia_CoA.xlsx")
                  }
                  endIcon={<DownloadIcon />}
                >
                  Serbia CoA
                </DownloadButton>
                <DownloadButton
                  onClick={() =>
                    download(
                      "/assets/files/international-coa.xlsx",
                      "International_CoA.xlsx"
                    )
                  }
                  endIcon={<DownloadIcon />}
                >
                  International CoA
                </DownloadButton>
                <DownloadButton
                  onClick={() =>
                    download("/assets/files/dictionary.xlsx", "Dictionary.xlsx")
                  }
                  endIcon={<DownloadIcon />}
                >
                  Mapping Dictionary
                </DownloadButton>
                {downloadError ? (
                  <DownloadError>{downloadError}</DownloadError>
                ) : null}
              </Stack>
            </Panel>
          </ContentWrapper>
        </Stack>

        <Stack gap={1}>
          <SectionLabel>Import rules</SectionLabel>
          <ContentWrapper>
            <Panel>
              <StyledTitle>General ledger (GL)</StyledTitle>
              <StyledList>
                <li>
                  Use values only — formulas in cells can break the import.
                </li>
                <li>
                  Do not include beginning balances; they skew the analysis.
                </li>
                <li>
                  The sum of GL amounts should be zero overall and per journal
                  entry.
                </li>
                <li>
                  Required columns:
                  <ul>
                    <li>Account number</li>
                    <li>Date</li>
                    <li>Value</li>
                    <li>Journal entry number</li>
                  </ul>
                </li>
                <li>
                  Format account codes with leading zeros as text so zeros are
                  kept.
                </li>
                <li>
                  One sheet only, data from A1, first row as headers.
                </li>
              </StyledList>
            </Panel>

            <Panel>
              <StyledTitle>Chart of accounts (CoA)</StyledTitle>
              <StyledList>
                <li>
                  Every GL account code needs a matching value in the CoA
                  mapping column, or it shows as not mapped.
                </li>
                <li>
                  GL and CoA must share the same matching column values so
                  accounts can link.
                </li>
                <li>
                  For full Movement / Process Analysis, prefer the GL Wizard CoA
                  and map accounts to FS sub-group (or another Display category).
                </li>
                <li>
                  One sheet only, data from A1, first row as headers.
                </li>
                <li>
                  Custom CoAs still match accounts, but built-in grouping
                  knowledge may be incomplete.
                </li>
              </StyledList>
            </Panel>
          </ContentWrapper>
        </Stack>
        </PagePanel>
      </RootStack>
    </PageWrapper>
  );
}
