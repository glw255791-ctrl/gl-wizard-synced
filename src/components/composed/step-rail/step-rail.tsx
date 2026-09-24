"use client";

import { styled } from "@mui/material/styles";
import { Stack, Typography } from "@mui/material";
import { AnalysisStep } from "@/types";
import { theme } from "@/constants/theme";

const labels = ["Upload", "Map", "Analyze", "Results"];
const jobs = [
  "Upload the general ledger.",
  "Choose the four columns, then add the chart of accounts.",
  "Check the files, then analyze.",
  "Review Movement Tables and Process Analysis.",
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
  gap: "0.55rem",
});

const Rail = styled(Stack)({
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.45rem",
  padding: "0.7rem 0.85rem",
  borderRadius: theme.borderRadius.md,
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.softBlue}`,
});

const Step = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  gap: "0.45rem",
  padding: "0.3rem 0.65rem 0.3rem 0.3rem",
  borderRadius: 999,
  backgroundColor: theme.colors.cleanWhite,
  border: `1px solid ${theme.colors.softBlue}`,
  color: theme.colors.slateGray,
  fontSize: "0.85rem",
  fontWeight: 600,

  '&[data-state="current"]': {
    backgroundColor: theme.colors.freshLime,
    color: theme.colors.graphite,
    borderColor: theme.colors.deepTeal,
  },

  '&[data-state="current"] .step-num': {
    backgroundColor: theme.colors.deepTeal,
    color: theme.colors.cleanWhite,
  },

  '&[data-state="done"]': {
    backgroundColor: theme.colors.paleBlue,
    color: theme.colors.deepTeal,
    borderColor: theme.colors.softBlue,
  },

  '&[data-state="done"] .step-num': {
    backgroundColor: theme.colors.deepTeal,
    color: theme.colors.cleanWhite,
  },
});

const Num = styled(Typography)({
  width: 24,
  height: 24,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  fontSize: "0.8rem",
  fontWeight: 700,
  lineHeight: 1,
  backgroundColor: theme.colors.lightGray,
  color: theme.colors.deepTeal,
});

const Join = styled("span")({
  width: 14,
  height: 2,
  borderRadius: 999,
  backgroundColor: theme.colors.softBlue,
  flexShrink: 0,

  "@media (max-width: 700px)": {
    display: "none",
  },
});

const Job = styled(Typography)({
  fontSize: "0.88rem",
  color: theme.colors.slateGray,
  paddingLeft: "0.15rem",
});

export function StepRail({ step }: { step: AnalysisStep }) {
  const current = activeIndex(step);

  return (
    <Column>
      <Rail>
        {labels.map((label, index) => (
          <Stack key={label} direction="row" alignItems="center" gap="0.45rem">
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
