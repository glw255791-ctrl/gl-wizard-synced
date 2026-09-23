"use client";

import dynamic from "next/dynamic";

const GeneralAnalysis = dynamic(
  () =>
    import("@/components/pages/general-analysis/general-analysis").then(
      (mod) => mod.GeneralAnalysis
    ),
  { ssr: false }
);

export function GeneralAnalysisClient() {
  return <GeneralAnalysis />;
}
