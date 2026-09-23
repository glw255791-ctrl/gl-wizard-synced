"use client";

import dynamic from "next/dynamic";

const ReversaReclassificationAnalysis = dynamic(
  () =>
    import(
      "@/components/pages/reversal-reclassification-analysis/reversal-reclassification-analysis"
    ).then((mod) => mod.ReversaReclassificationAnalysis),
  { ssr: false }
);

export function ReversalReclassificationClient() {
  return <ReversaReclassificationAnalysis />;
}
