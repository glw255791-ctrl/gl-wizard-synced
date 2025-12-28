"use client";

import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";
import {
  RootStack,
  ContentWrapper,
  TextWrapper,
  StyledTitle,
  StyledList,
} from "./style";

export function AboutPage() {
  return (
    <PageWrapper>
      <RootStack>
        <Header title="User Manual" />
        <ContentWrapper>
          <TextWrapper>
            <StyledTitle>About GL Wizard</StyledTitle>
            <StyledList>
              <li>
                GL Wizard is a modern tool for financial data analysis, designed
                to streamline the review and mapping of general ledger and chart
                of accounts files.
              </li>
              <li>
                The application enables users to upload, validate, and analyze
                accounting data in a simple, user-friendly interface.
              </li>
              <li>
                GL Wizard supports advanced features such as automatic data
                mapping, filtering, and error detection to enhance data quality
                and transparency.
              </li>
              <li>
                It is intended for finance teams, auditors, and consultants
                looking for an efficient way to prepare, inspect, and reconcile
                GL data.
              </li>
              <li>
                The project is developed with reliability and usability in mind,
                with continuous updates for improved capabilities.
              </li>
            </StyledList>
          </TextWrapper>
        </ContentWrapper>
      </RootStack>
    </PageWrapper>
  );
}
