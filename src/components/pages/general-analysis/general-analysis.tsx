import { Grid2, Stack } from "@mui/material";
import { FileDropzone } from "../../ui-kit/dropzone/dropzone";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { Header } from "../../composed/header/header";
import { GLDropdowns } from "../../composed/gl-dropdowns/gl-dropdowns";
import { DataValidityInfo } from "../../composed/data-validity-info/data-validity-info";
import { BasicDataOverview } from "../../basic-data-overview/basic-data-overview";
import { DataOverview } from "../../analysed-data-overview/analysed-data-overview";
import { Loader } from "../../ui-kit/loader-overlay/loader-overlay";
import { ActionButton } from "../../composed/action-button/action-button";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { WarningModal } from "../../composed/warning-modal/warning-modal";
import { AnalysisStep, useGeneralAnalysis } from "./general-analysis-model";
import { CardStyled, RootStack } from "./style";
import { supabase } from "../../../api/api";
import { useState, useEffect, useMemo } from "react";
import { UndoButton } from "../../composed/undo-button/undo-button";

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
    error,
    loadingStatus,
    isWarningModalShown,
    isDictionaryUploaded,
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
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: profile, error } = await supabase
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

  return (
    <>
      <Loader loadingStatus={loadingStatus} />
      <PageWrapper>
        <RootStack spacing={2}>
          <Header
            title="GL analysis - Transaction type"
            onPressResetBtn={onPressResetBtn}
          />

          {/* GL and CoA Upload */}

          <Grid2 container spacing={2}>
            {/* GL Upload */}
            <Grid2 size={6}>
              <FileDropzone
                onDrop={onGeneralLedgerDrop}
                text="Drop GL file here"
                isDisabled={currentStep === AnalysisStep.ANALYZED}
                uploaded={currentStep !== AnalysisStep.TO_UPLOAD_GL}
              >
                <GLDropdowns
                  glHeaderOptions={glHeaderOptions}
                  selectedHeaders={selectedHeaders}
                  onChangeGlHeader={onChangeGlHeader}
                />
              </FileDropzone>
            </Grid2>

            {/* CoA + Optional Dictionary Upload */}
            <Grid2 size={6}>
              <FileDropzone
                onDrop={onChartOfAccountsDrop}
                text="Drop CoA file here"
                uploaded={
                  currentStep === AnalysisStep.TO_UPLOAD_DICTIONARY ||
                  currentStep === AnalysisStep.UPLOADED_DICTIONARY ||
                  currentStep === AnalysisStep.ANALYZED
                }
                isDisabled={
                  currentStep === AnalysisStep.TO_UPLOAD_GL ||
                  currentStep === AnalysisStep.UPLOADED_GL ||
                  currentStep === AnalysisStep.ANALYZED
                }
                onAdditionalDrop={onDictionaryDrop}
                isAdditionalDisabled={
                  currentStep !== AnalysisStep.TO_UPLOAD_DICTIONARY &&
                  currentStep !== AnalysisStep.UPLOADED_DICTIONARY &&
                  currentStep !== AnalysisStep.ANALYZED
                }
                additionalText="Drop Dictionary file here"
                additionalUploaded={isDictionaryUploaded}
              >
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
              </FileDropzone>
            </Grid2>
          </Grid2>

          {/* Data Validity and Analysis Action */}

          <CardStyled>
            {currentStep !== AnalysisStep.TO_UPLOAD_GL &&
            currentStep !== AnalysisStep.UPLOADED_GL ? (
              <DataValidityInfo reviewData={reviewData} error={error} />
            ) : (
              <Stack />
            )}

            <Stack direction="row" spacing={1} alignItems="center">
              <UndoButton
                disabled={currentStep === AnalysisStep.TO_UPLOAD_GL}
                onPressUndo={onPressBackBtn}
              />
              <ActionButton
                disabled={
                  currentStep !== AnalysisStep.TO_UPLOAD_DICTIONARY &&
                  currentStep !== AnalysisStep.UPLOADED_DICTIONARY
                }
                onPressAnalyzeData={onPressAnalyzeData}
              />
            </Stack>
          </CardStyled>

          {/* Overviews */}
          {isAdmin && (
            <BasicDataOverview
              title="GL Data With Transaction Types"
              disabled={currentStep !== AnalysisStep.ANALYZED}
              tableData={tableData}
              tableHeader={tableHeader}
            />
          )}

          <DataOverview
            mappingValue={selectedHeaders.coaHeaders.mappingValue}
            overviewTableData={overviewTableData}
            setDataDisplayHeader={setDataDisplayHeader}
            sortedDataDisplayHeader={sortedDataDisplayHeader}
            coaHeaderOptions={coaHeaderOptions}
            title="Movement Tables"
            valueKey={selectedHeaders.glHeaders.value}
            disabled={currentStep !== AnalysisStep.ANALYZED}
            basicTableData={tableData}
            basicTableHeader={tableHeader}
          />

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
