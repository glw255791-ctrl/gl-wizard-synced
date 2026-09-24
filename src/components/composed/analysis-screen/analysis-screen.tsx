"use client";

import { ReactNode } from "react";
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AnalysisStep } from "@/types";
import { PageWrapper } from "../page-wrapper/page-wrapper";
import { Header } from "../header/header";
import { theme } from "@/constants/theme";

const RootStack = styled(Stack)({
  width: "100%",
  minHeight: 0,
  justifyContent: "flex-start",
  gap: theme.gap.lg,
});

/** Shared chrome for the three analysis wizards. */
export function AnalysisScreen({
  title,
  description,
  step,
  onReset,
  children,
}: {
  title: string;
  description: string;
  step: AnalysisStep;
  onReset: () => void;
  children: ReactNode;
}) {
  return (
    <PageWrapper>
      <RootStack>
        <Header
          title={title}
          description={description}
          step={step}
          onPressResetBtn={onReset}
        />
        {children}
      </RootStack>
    </PageWrapper>
  );
}
