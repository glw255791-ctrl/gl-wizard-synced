"use client";

import { Grid2, Stack } from "@mui/material";
import { FileDropzone } from "../../ui-kit/dropzone/dropzone";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { CardStyled, RootStack } from "./style";
import { useReversalReclassificationAnalysis } from "./reversal-reclassification-analysis-model";

import { AnalysisStep } from "../general-analysis/general-analysis-model";
import { GLDropdowns } from "../../composed/gl-dropdowns/gl-dropdowns";
import { Header } from "../../composed/header/header";
import { DataValidityInfo } from "../../composed/data-validity-info/data-validity-info";
import { Loader } from "../../ui-kit/loader-overlay/loader-overlay";
import { ActionButton } from "../../composed/action-button/action-button";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { UndoButton } from "../../composed/undo-button/undo-button";
import { AnalysisSummary } from "../../composed/analysis-summary/analysis-summary";
import { useState } from "react";
import dynamic from "next/dynamic";

const BasicDataOverview = dynamic(
  () =>
    import("../../basic-data-overview/basic-data-overview").then(
      (mod) => mod.BasicDataOverview
    ),
  { ssr: false }
);

export function ReversaReclassificationAnalysis() {
  const {
    glHeaderOptions,
    coaHeaderOptions,
    selectedHeaders,
    reviewData,
    tableHeader,
    tableData,
    error,
    currentStep,
    selectedFilters,
    coaFilterOptions,
    loadingStatus,
    fileProgress,
    onChangeCoaFilter,
    onChangeCoaHeader,
    onChangeGlHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressResetBtn,
    onPressBackBtn,
  } = useReversalReclassificationAnalysis();

  const [glFileName, setGlFileName] = useState("");
  const [coaFileName, setCoaFileName] = useState("");
  const resetAnalysis = () => {
    setGlFileName("");
    setCoaFileName("");
    onPressResetBtn();
  };
  const canUndo = currentStep !== AnalysisStep.TO_UPLOAD_GL;
  const canAnalyze =
    currentStep === AnalysisStep.TO_UPLOAD_DICTIONARY ||
    currentStep === AnalysisStep.UPLOADED_DICTIONARY;

  return (
    <>
      <Loader loadingStatus={loadingStatus} fileProgress={fileProgress} />
      <PageWrapper>
        <RootStack spacing={2}>
          <Header
            title="Reversal/Reclassification"
            onPressResetBtn={resetAnalysis}
            step={currentStep}
          />

          {/* GL and CoA upload section */}
          <Grid2 container spacing={2}>
            {/* General Ledger Upload */}
            <Grid2 size={6}>
              <FileDropzone
                onDrop={(files) => {
                  setGlFileName(files[0]?.name ?? "");
                  onGeneralLedgerDrop(files);
                }}
                text="Drop GL file here"
                fileName={glFileName}
                uploaded={currentStep !== AnalysisStep.TO_UPLOAD_GL}
              >
                {glHeaderOptions.length > 0 ? (
                <GLDropdowns
                  glHeaderOptions={glHeaderOptions}
                  selectedHeaders={selectedHeaders}
                  onChangeGlHeader={onChangeGlHeader}
                />
                ) : null}
              </FileDropzone>
            </Grid2>

            {/* Chart of Accounts Upload (with filters) */}
            <Grid2 size={6}>
              <FileDropzone
                onDrop={(files) => {
                  setCoaFileName(files[0]?.name ?? "");
                  onChartOfAccountsDrop(files);
                }}
                text="Drop CoA file here"
                fileName={coaFileName}
                uploaded={
                  currentStep === AnalysisStep.TO_UPLOAD_DICTIONARY ||
                  currentStep === AnalysisStep.UPLOADED_DICTIONARY
                }
                isDisabled={
                  currentStep === AnalysisStep.TO_UPLOAD_GL ||
                  currentStep === AnalysisStep.UPLOADED_GL
                }
              >
                {coaHeaderOptions.length > 0 ? (
                <Stack spacing={1}>
                  <Dropdown
                    label="Mapping value"
                    items={coaHeaderOptions}
                    value={selectedHeaders.coaHeaders.mappingValue}
                    onChange={(event) =>
                      onChangeCoaHeader(
                        "mappingValue",
                        event.target.value as string,
                      )
                    }
                  />
                  <Dropdown
                    label="Filter by"
                    items={coaHeaderOptions}
                    value={selectedFilters.header}
                    onChange={(event) =>
                      onChangeCoaFilter("header", event.target.value as string)
                    }
                  />
                  <Dropdown
                    multiple
                    label="Filter by value"
                    items={coaFilterOptions}
                    value={selectedFilters.value}
                    onChange={(event) =>
                      onChangeCoaFilter("value", event.target.value as string[])
                    }
                  />
                </Stack>
                ) : null}
              </FileDropzone>
            </Grid2>
          </Grid2>

          {currentStep !== AnalysisStep.TO_UPLOAD_GL && (
          <CardStyled>
            {currentStep === AnalysisStep.UPLOADED_GL ? (
              <span style={{ flex: "1 1 auto", minWidth: 0, paddingRight: "1rem" }}>
                Choose the four columns.
              </span>
            ) : (
              <DataValidityInfo reviewData={reviewData} error={error} />
            )}
            {(canUndo || canAnalyze) && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0, marginLeft: "auto" }}>
              {canUndo && (
                <UndoButton disabled={false} onPressUndo={onPressBackBtn} />
              )}
              {canAnalyze && (
                <ActionButton
                  disabled={false}
                  onPressAnalyzeData={onPressAnalyzeData}
                />
              )}
            </Stack>
            )}
          </CardStyled>
          )}
          {/* GL Data Overview */}
          {currentStep === AnalysisStep.ANALYZED && (
            <AnalysisSummary
              rows={tableData}
              headers={selectedHeaders.glHeaders}
            />
          )}
          {currentStep === AnalysisStep.ANALYZED && (
          <BasicDataOverview
            title="GL Data With Transaction Types"
            reversalReclassification
            disabled={false}
            tableData={tableData}
            tableHeader={tableHeader}
          />
          )}
        </RootStack>
      </PageWrapper>
    </>
  );
}
