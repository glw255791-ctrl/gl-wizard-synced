import { Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";
import {
  RootStack,
  ContentWrapper,
  StyledButtonStack,
  TextWrapper,
  StyledIconButton,
  StyledDownloadIcon,
  StyledTitle,
  StyledList,
  ButtonsWrapper
} from "./style";

export function UserManualPage() {
  return (
    <PageWrapper>
      <RootStack>
        <Header title="User Manual" />
        <ContentWrapper>
          <TextWrapper>
            <StyledTitle>
              General Usage
            </StyledTitle>
            <StyledList>
              <li>
                The General User Manual is a guide for users of the GL Wizard software.
              </li>
              <li>
                Upload your General Ledger (GL) and Chart of Accounts (CoA) files in the supported formats to get started with data analysis.
              </li>
              <li>
                Use the filtering and mapping features on the platform to categorize and analyze your financial data more effectively.
              </li>
              <li>
                After uploading your files, review the data validity section for any errors or missing information.
              </li>
              <li>
                Download template files and sample dictionaries from the Content Download section below to assist with data preparation and mapping.
              </li>
            </StyledList>
          </TextWrapper>


          <TextWrapper>
            <ButtonsWrapper>
              <StyledTitle>
                Content Download
              </StyledTitle>
              <StyledButtonStack>
                <Typography>Serbia CoA</Typography>
                <StyledIconButton
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "/assets/files/serbia-coa.xlsx";
                    link.download = "Serbia_CoA.xlsx";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <DownloadIcon sx={StyledDownloadIcon} />
                </StyledIconButton>
              </StyledButtonStack>
              <StyledButtonStack>
                <Typography>International CoA</Typography>
                <StyledIconButton
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "/assets/files/international-coa.xlsx";
                    link.download = "International_CoA.xlsx";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <DownloadIcon sx={StyledDownloadIcon} />
                </StyledIconButton>
              </StyledButtonStack>
              <StyledButtonStack>
                <Typography>Mapping Dictionary</Typography>
                <StyledIconButton
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "/assets/files/dictionary.xlsx";
                    link.download = "Dictionary.xlsx";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <DownloadIcon sx={StyledDownloadIcon} />
                </StyledIconButton>
              </StyledButtonStack>
            </ButtonsWrapper>
          </TextWrapper>
        </ContentWrapper>
        <ContentWrapper>
          <TextWrapper>
            <StyledTitle>
              Importing the General Ledger (GL)
            </StyledTitle>
            <StyledList
            >
              <li>
                Ensure that each cell in the imported GL contains values only; cells containing formulas may interrupt the analysis and will be flagged as errors.
              </li>
              <li>
                Do not include beginning balances in the GL. Inclusion of beginning balances may result in inaccurate conclusions.
              </li>
              <li>
                Verify that the sum of GL transactions is zero, both in total and per journal entry. An incorrect GL may adversely affect the analysis results.
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
                Ensure that account codes starting with a leading zero are formatted as text to prevent the zero from being dropped.
              </li>
              <li>
                Ensure that the Excel import file contains only one sheet, with data starting in cell A1 and the first row serving as the header.
              </li>
            </StyledList>
          </TextWrapper>
          <TextWrapper>
            <StyledTitle>
              Importing the Chart of Accounts (COA)
            </StyledTitle>
            <StyledList
            >
              <li>
                The COA must provide a value for every account code present in the imported GL in the column mapped as “account code”. Accounts without corresponding values in the COA will be identified as not matched.
              </li>
              <li>
                Ensure that the GL and COA contain a matching column with identical values, so the software can correctly establish a connection between the two.
              </li>
              <li>
                For AI-generated results, use the GL Wizard standardized COA (FS sub-group column). Download the standardized COA and ensure that every GL account is allocated to a corresponding mapping from the FS sub-group column.
              </li>
              <li>
                Ensure that the Excel import file contains only one sheet, with data starting in cell A1 and the first row serving as the header.
              </li>
              <li>
                You may import a Chart of Accounts (CoA) according to your preferences or adjust the default version. However, certain integrated knowledge features might not operate as intended in that case.
              </li>
            </StyledList>
          </TextWrapper>
        </ContentWrapper>


      </RootStack>
    </PageWrapper>
  );
}
