"use client";
import dynamic from "next/dynamic";
import { Grid2, LinearProgress, Stack, Typography } from "@mui/material";
import { FileDropzone } from "../../ui-kit/dropzone/dropzone";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { Header } from "../../composed/header/header";
import { GLDropdowns } from "../../composed/gl-dropdowns/gl-dropdowns";
import { DataValidityInfo } from "../../composed/data-validity-info/data-validity-info";
import { AnalysisStep, useGeneralAnalysis } from "./general-analysis-model";
import { CardStyled, RootStack } from "./style";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
import { useState, useEffect, useMemo } from "react";
import { UndoButton } from "../../composed/undo-button/undo-button";
import { HierarchyModal } from "../../composed/hierarchy-modal/hierarchy-modal";
import { HierarchyButton } from "../../composed/hierarchy-button/hierarchy-button";
import { Loader } from "../../ui-kit/loader-overlay/loader-overlay";
import { ActionButton } from "../../composed/action-button/action-button";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { WarningModal } from "../../composed/warning-modal/warning-modal";
import { AnalysisSummary } from "../../composed/analysis-summary/analysis-summary";
import { TrialBalanceCheck } from "../../composed/trial-balance-check/trial-balance-check";
import { theme } from "@/constants/theme";
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
      <ResultsPlaceholder label="GL Data With Transaction Types" />
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

export function GeneralAnalysis() {
  const {
    glHeaderOptions,
    coaHeaderOptions,
    selectedHeaders,
    reviewData,
    currentStep,
    sortedDataDisplayHeader,
    overviewTableData,
    tableHeader,
    tableData,
    displayTableData,
    rawData,
    error,
    loadingStatus,
    fileProgress,
    isWarningModalShown,
    isDictionaryUploaded,
    isHierarchyModalVisible,
    hierarchyData,
    setIsHierarchyModalVisible,
    setHierarchyData,
    onDictionaryDrop,
    onPressExportUnmappedRows,
    setIsWarningModalShown,
    setDataDisplayHeader,
    onChangeCoaHeader,
    onChangeGlHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressBackBtn,
    onPressResetBtn,
  } = useGeneralAnalysis();

  const [userRole, setUserRole] = useState<"user" | "admin" | undefined>(
    undefined
  );
  useEffect(() => {
    if (!supabaseBrowser) return;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();
      if (session) {
        const { data: profile, error } = await supabaseBrowser
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (error || !profile) {
          return;
        }
        setUserRole(profile.role);
      }
    };
    checkSession();
  }, []);

  const isAdmin = useMemo(() => userRole === "admin", [userRole]);

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
            title="GL Transactions Analysis"
            description="Map the ledger and name each journal."
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
            <Grid2 size={7}>
              <FileDropzone
                onDrop={(files) => {
                  setGlFileName(files[0]?.name ?? "");
                  onGeneralLedgerDrop(files);
                }}
                text="Drop GL file here"
                fileName={glFileName}
                isDisabled={false}
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

            <Grid2 size={5} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FileDropzone
                fieldsBelow
                onDrop={async (files) => {
                  const accepted = await onChartOfAccountsDrop(files);
                  if (accepted) setCoaFileName(files[0]?.name ?? "");
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
                        e.target.value as string
                      )
                    }
                  />
                  <Dropdown
                    label="Display CoA category"
                    items={coaHeaderOptions}
                    tooltip="Recommended: FS subgroup"
                    value={selectedHeaders.coaHeaders.displayValue}
                    onChange={(e) =>
                      onChangeCoaHeader(
                        "displayValue",
                        e.target.value as string
                      )
                    }
                  />
                </Stack>
                ) : null}
              </FileDropzone>
              <FileDropzone
                compact
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

          {/* Data Validity and Analysis Action */}

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

          {/* Overviews */}
          {currentStep === AnalysisStep.ANALYZED && <ResultsNextSteps />}
          {currentStep === AnalysisStep.ANALYZED && (
            <AnalysisSummary
              rows={tableData}
              headers={selectedHeaders.glHeaders}
            />
          )}
          {currentStep === AnalysisStep.ANALYZED && isAdmin && (
            <BasicDataOverview
              title="GL Data With Transaction Types"
              disabled={false}
              tableData={displayTableData}
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

          {/* Unmapped Warning Modal */}
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
