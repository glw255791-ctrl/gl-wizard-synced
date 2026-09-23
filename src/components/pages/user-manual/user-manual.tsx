"use client";

import { Typography } from "@mui/material";
import { useState } from "react";

import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";
import {
  RootStack,
  ContentWrapper,
  StyledButtonStack,
  TextWrapper,
  StyledTitle,
  StyledList,
  ButtonsWrapper,
} from "./style";

/**
 * Fetches the file as a blob and triggers download via an anchor click.
 * This works more reliably across browsers and static environments.
 */
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
        <ContentWrapper>
          <TextWrapper>
            <StyledTitle>General Usage</StyledTitle>
            <StyledList>
              <li>
                Upload a general ledger, a chart of accounts, and an optional
                dictionary. Then map the columns and review the validity bar.
              </li>
              <li>
                Download the template files beside this text when you need a
                starting chart of accounts or dictionary.
              </li>
            </StyledList>
          </TextWrapper>

          <TextWrapper>
            <ButtonsWrapper>
              <StyledTitle>Content Download</StyledTitle>
              <StyledButtonStack
                onClick={() =>
                  download("/assets/files/serbia-coa.xlsx", "Serbia_CoA.xlsx")
                }
              >
                <span>Serbia CoA</span>
                <span>Download</span>
              </StyledButtonStack>
              <StyledButtonStack
                onClick={() =>
                  download(
                    "/assets/files/international-coa.xlsx",
                    "International_CoA.xlsx"
                  )
                }
              >
                <span>International CoA</span>
                <span>Download</span>
              </StyledButtonStack>
              <StyledButtonStack
                onClick={() =>
                  download("/assets/files/dictionary.xlsx", "Dictionary.xlsx")
                }
              >
                <span>Mapping Dictionary</span>
                <span>Download</span>
              </StyledButtonStack>
              {downloadError ? <Typography>{downloadError}</Typography> : null}
            </ButtonsWrapper>
          </TextWrapper>
        </ContentWrapper>
        <ContentWrapper>
          <TextWrapper>
            <StyledTitle>Importing the General Ledger (GL)</StyledTitle>
            <StyledList>
              <li>
                Ensure that each cell in the imported GL contains values only;
                cells containing formulas may interrupt the analysis and will be
                flagged as errors.
              </li>
              <li>
                Do not include beginning balances in the GL. Inclusion of
                beginning balances may result in inaccurate conclusions.
              </li>
              <li>
                Verify that the sum of GL transactions is zero, both in total
                and per journal entry. An incorrect GL may adversely affect the
                analysis results.
              </li>
              <li>
                The GL must include the following columns:
                <ul style={{ paddingLeft: 20 }}>
                  <li>Account Number</li>
                  <li>Date</li>
                  <li>Value</li>
                  <li>Journal Entry Number</li>
                </ul>
              </li>
              <li>
                Ensure that account codes starting with a leading zero are
                formatted as text to prevent the zero from being dropped.
              </li>
              <li>
                Ensure that the Excel import file contains only one sheet, with
                data starting in cell A1 and the first row serving as the
                header.
              </li>
            </StyledList>
          </TextWrapper>
          <TextWrapper>
            <StyledTitle>Importing the Chart of Accounts (CoA)</StyledTitle>
            <StyledList>
              <li>
                The CoA must provide a value for every account code present in
                the imported GL in the column mapped as “account code”. Accounts
                without corresponding values in the CoA will be identified as
                not matched.
              </li>
              <li>
                Ensure that the GL and CoA contain a matching column with
                identical values, so the software can correctly establish a
                connection between the two.
              </li>
              <li>
                For the standard groups, use the GL Wizard CoA and its FS
                sub-group column. Download that file and map every GL account
                to a value from that column. A chart of accounts you bring
                yourself can still match accounts, but those standard groups
                will be missing.
              </li>
              <li>
                Ensure that the Excel import file contains only one sheet, with
                data starting in cell A1 and the first row serving as the
                header.
              </li>
              <li>
                You may import a Chart of Accounts (CoA) according to your
                preferences or adjust the default version. However, certain
                integrated knowledge features might not operate as intended in
                that case.
              </li>
            </StyledList>
          </TextWrapper>
        </ContentWrapper>
      </RootStack>
    </PageWrapper>
  );
}
