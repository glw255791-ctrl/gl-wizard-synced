"use client";

import dynamic from "next/dynamic";

const ReversalAnalysis = dynamic(
  () =>
    import("@/components/pages/reversal-analysis/reversal-analysis").then(
      (mod) => mod.ReversalAnalysis
    ),
  { ssr: false }
);

export function ReversalAnalysisClient() {
  return <ReversalAnalysis />;
}
