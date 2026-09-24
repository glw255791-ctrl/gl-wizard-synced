"use client";

import dynamic from "next/dynamic";
import { Grid2, LinearProgress, Stack, Typography } from "@mui/material";
import { FileDropzone } from "../../ui-kit/dropzone/dropzone";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { CardStyled, RootStack } from "./style";
import { AnalysisStep, useReversalAnalysis } from "./reversal-analysis-model";
import { GLDropdowns } from "../../composed/gl-dropdowns/gl-dropdowns";
import { DataValidityInfo } from "../../composed/data-validity-info/data-validity-info";
import { Header } from "../../composed/header/header";
import { Loader } from "../../ui-kit/loader-overlay/loader-overlay";
import { ActionButton } from "../../composed/action-button/action-button";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { WarningModal } from "../../composed/warning-modal/warning-modal";
import { UndoButton } from "../../composed/undo-button/undo-button";
import { AnalysisSummary } from "../../composed/analysis-summary/analysis-summary";
import { TrialBalanceCheck } from "../../composed/trial-balance-check/trial-balance-check";
import { HierarchyModal } from "../../composed/hierarchy-modal/hierarchy-modal";
import { HierarchyButton } from "../../composed/hierarchy-button/hierarchy-button";
import { theme } from "@/constants/theme";
import { useState } from "react";
import { AnalysisStartHint } from "../../composed/workflow-hints/analysis-start-hint";
import { ResultsNextSteps } from "../../composed/workflow-hints/results-next-steps";

function ResultsPlaceholder({ label }: { label: string }) {
  return (
    <Stack
      gap={1}
      sx={{
        backgroundColor: theme.colors.lighter,
        border: `1px solid ${theme.colors.surface}`,
        borderRadius: theme.borderRadius.sm,
        padding: "1rem 1.15rem",
      }}
    >
      <Typography color={theme.colors.medium}>Opening {label}</Typography>
      <LinearProgress
        sx={{
          height: 8,
          borderRadius: 999,
          backgroundColor: theme.colors.surface,
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            backgroundColor: theme.colors.action,
          },
        }}
      />
    </Stack>
  );
}

const BasicDataOverview = dynamic(
  () =>
    import("../../basic-data-overview/basic-data-overview").then(
      (mod) => mod.BasicDataOverview
    ),
  {
    ssr: false,
    loading: () => (
      <ResultsPlaceholder label="GL Data With Reversal Identified" />
    ),
  }
);

const DataOverview = dynamic(
  () =>
    import("../../data-overview/data-overview").then((mod) => mod.DataOverview),
  {
    ssr: false,
    loading: () => <ResultsPlaceholder label="Movement Tables" />,
  }
);

export function ReversalAnalysis() {
  const {
    glHeaderOptions,
    coaHeaderOptions,
    selectedHeaders,
    reviewData,
    tableHeader,
    tableData,
    currentStep,
    error,
    loadingStatus,
    fileProgress,
    isWarningModalShown,
    isDictionaryUploaded,
    isHierarchyModalVisible,
    hierarchyData,
    overviewTableData,
    sortedDataDisplayHeader,
    rawData,
    setHierarchyData,
    setIsHierarchyModalVisible,
    setDataDisplayHeader,
    onDictionaryDrop,
    onPressExportUnmappedRows,
    setIsWarningModalShown,
    onChangeCoaHeader,
    onChangeGlHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressResetBtn,
    onPressBackBtn,
  } = useReversalAnalysis();

  const [glFileName, setGlFileName] = useState("");
  const [coaFileName, setCoaFileName] = useState("");
  const [dictionaryFileName, setDictionaryFileName] = useState("");
  const resetAnalysis = () => {
    setGlFileName("");
    setCoaFileName("");
    setDictionaryFileName("");
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
            title="Reversal"
            description="Find entries that cancel each other."
            onPressResetBtn={resetAnalysis}
            step={currentStep}
          />

          {/* GL and CoA Upload — hidden on Results; Undo brings them back */}
          {currentStep === AnalysisStep.TO_UPLOAD_GL && <AnalysisStartHint />}

          {currentStep !== AnalysisStep.ANALYZED && (
          <Grid2
            container
            spacing={2}
            sx={{
              alignItems: "stretch",
              "& > .MuiGrid2-root": { display: "flex" },
            }}
          >
            <Grid2 size={glHeaderOptions.length > 0 ? 6 : 4}>
              <FileDropzone
                onDrop={(files) => {
                  setGlFileName(files[0]?.name ?? "");
                  onGeneralLedgerDrop(files);
                }}
                text="Drop GL file here"
                fileName={glFileName}
                uploaded={currentStep !== AnalysisStep.TO_UPLOAD_GL}
                isDisabled={false}
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

            <Grid2 size={glHeaderOptions.length > 0 ? 3 : 4}>
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
                    label="Matching column GL & CoA"
                    items={coaHeaderOptions}
                    value={selectedHeaders.coaHeaders.mappingValue}
                    onChange={(e) =>
                      onChangeCoaHeader(
                        "mappingValue",
                        e.target.value as string,
                      )
                    }
                  />
                  <Dropdown
                    label="Display CoA category"
                    items={coaHeaderOptions}
                    value={selectedHeaders.coaHeaders.displayValue}
                    onChange={(e) =>
                      onChangeCoaHeader(
                        "displayValue",
                        e.target.value as string,
                      )
                    }
                  />
                </Stack>
                ) : null}
              </FileDropzone>
            </Grid2>

            <Grid2 size={glHeaderOptions.length > 0 ? 3 : 4}>
              <FileDropzone
                optional
                onDrop={(files) => {
                  setDictionaryFileName(files[0]?.name ?? "");
                  onDictionaryDrop(files);
                }}
                text="Drop Dictionary file here"
                fileName={dictionaryFileName}
                uploaded={isDictionaryUploaded}
                isDisabled={
                  currentStep !== AnalysisStep.TO_UPLOAD_DICTIONARY &&
                  currentStep !== AnalysisStep.UPLOADED_DICTIONARY
                }
              >
                {null}
              </FileDropzone>
            </Grid2>
          </Grid2>
          )}

          {currentStep !== AnalysisStep.TO_UPLOAD_GL && (
          <CardStyled>
            {currentStep === AnalysisStep.UPLOADED_GL ? (
              <span style={{ flex: "1 1 auto", minWidth: 0, paddingRight: "1rem" }}>
                Choose the four columns.
              </span>
            ) : (
              <DataValidityInfo reviewData={reviewData} error={error} />
            )}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ flexShrink: 0, marginLeft: "auto" }}
            >
              {canUndo && (
                <UndoButton disabled={false} onPressUndo={onPressBackBtn} />
              )}
              {canAnalyze && (
                <HierarchyButton
                  disabled={false}
                  onPress={() => setIsHierarchyModalVisible(true)}
                />
              )}
              {canAnalyze && (
                <ActionButton
                  disabled={false}
                  onPressAnalyzeData={onPressAnalyzeData}
                />
              )}
            </Stack>
          </CardStyled>
          )}

          {rawData.glData.length > 0 &&
            selectedHeaders.glHeaders.account &&
            selectedHeaders.glHeaders.value && (
              <TrialBalanceCheck
                glRows={rawData.glData}
                accountKey={selectedHeaders.glHeaders.account}
                valueKey={selectedHeaders.glHeaders.value}
              />
            )}

          {/* GL Data Summary */}
          {currentStep === AnalysisStep.ANALYZED && <ResultsNextSteps />}
          {currentStep === AnalysisStep.ANALYZED && (
            <AnalysisSummary
              rows={tableData}
              headers={selectedHeaders.glHeaders}
            />
          )}
          {currentStep === AnalysisStep.ANALYZED && (
          <BasicDataOverview
            title="GL Data With Reversal Identified"
            disabled={false}
            tableData={tableData}
            tableHeader={tableHeader}
          />
          )}

          {isHierarchyModalVisible && (
            <HierarchyModal
              hierarchyData={hierarchyData}
              isOpen={isHierarchyModalVisible}
              onClose={() => setIsHierarchyModalVisible(false)}
              setHierarchyData={setHierarchyData}
            />
          )}

          {currentStep === AnalysisStep.ANALYZED && (
          <DataOverview
            mappingValue={selectedHeaders.coaHeaders.mappingValue}
            displayValue={selectedHeaders.coaHeaders.displayValue}
            overviewTableData={overviewTableData}
            setDataDisplayHeader={setDataDisplayHeader}
            sortedDataDisplayHeader={sortedDataDisplayHeader}
            coaHeaderOptions={coaHeaderOptions}
            title="Movement Tables"
            valueKey={selectedHeaders.glHeaders.value}
            disabled={currentStep !== AnalysisStep.ANALYZED}
            hierarchyData={hierarchyData}
            basicTableData={tableData}
            basicTableHeader={tableHeader}
          />
          )}

          {/* Warning Modal for Unmapped Rows */}
          <WarningModal
            isOpen={isWarningModalShown}
            onPressExportUnmappedRows={onPressExportUnmappedRows}
            onClose={() => setIsWarningModalShown(false)}
          />
        </RootStack>
      </PageWrapper>
    </>
  );
}
