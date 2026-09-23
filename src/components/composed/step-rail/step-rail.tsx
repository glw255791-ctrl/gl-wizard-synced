"use client";

import { styled } from "@mui/material/styles";
import { Stack, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { AnalysisStep } from "@/types";
import { theme } from "@/constants/theme";

const labels = ["Upload", "Map", "Analyze", "Results"];
const jobs = [
  "Upload the general ledger.",
  "Choose the four columns, then add the chart of accounts.",
  "Check the files, then analyze.",
  "Review the results.",
];

function activeIndex(step: AnalysisStep) {
  if (step === AnalysisStep.ANALYZED) return 3;
  if (
    step === AnalysisStep.TO_UPLOAD_DICTIONARY ||
    step === AnalysisStep.UPLOADED_DICTIONARY
  ) {
    return 2;
  }
  if (step === AnalysisStep.TO_UPLOAD_COA || step === AnalysisStep.UPLOADED_GL) {
    return 1;
  }
  return 0;
}

const Column = styled(Stack)({
  alignItems: "center",
  gap: "0.35rem",
});

const Rail = styled(Stack)({
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.35rem",
});

const Join = styled(ChevronRightIcon)({
  fontSize: "1.15rem",
  color: theme.colors.medium,
});

const Job = styled(Typography)({
  fontSize: "0.9rem",
  color: theme.colors.medium,
  textAlign: "center",
});

const Step = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.35rem 0.7rem",
  borderRadius: "999px",
  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.surface}`,
  color: theme.colors.medium,
  fontSize: "0.9rem",
  fontWeight: 600,

  '&[data-state="current"]': {
    backgroundColor: theme.colors.action,
    color: theme.colors.black,
    borderColor: theme.colors.darker,
  },

  '&[data-state="current"] .step-num': {
    backgroundColor: theme.colors.darker,
    color: theme.colors.white,
  },

  '&[data-state="done"]': {
    backgroundColor: theme.colors.gray,
    color: theme.colors.black,
    borderColor: theme.colors.gray,
  },

  '&[data-state="done"] .step-num': {
    backgroundColor: theme.colors.darker,
    color: theme.colors.white,
  },
});

const Num = styled(Typography)({
  width: 24,
  height: 24,
  borderRadius: "999px",
  display: "grid",
  placeItems: "center",
  fontSize: "0.85rem",
  fontWeight: 700,
  lineHeight: 1,
  backgroundColor: theme.colors.surface,
  color: theme.colors.darker,
});

export function StepRail({ step }: { step: AnalysisStep }) {
  const current = activeIndex(step);

  return (
    <Column>
      <Rail>
        {labels.map((label, index) => (
          <Stack key={label} direction="row" alignItems="center">
            <Step
              data-state={
                index === current ? "current" : index < current ? "done" : "todo"
              }
            >
              <Num className="step-num">{index + 1}</Num>
              {label}
            </Step>
            {index < labels.length - 1 && <Join aria-hidden="true" />}
          </Stack>
        ))}
      </Rail>
      <Job>{jobs[current]}</Job>
    </Column>
  );
}
