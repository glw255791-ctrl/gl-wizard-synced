import { Grid2, Stack } from "@mui/material";
import { FileDropzone } from "../../ui-kit/dropzone/dropzone";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { CardStyled, RootStack } from "./style";
import { AnalysisStep, useReversalAnalysis } from "./reversal-analysis-model";
import { GLDropdowns } from "../../composed/gl-dropdowns/gl-dropdowns";
import { DataValidityInfo } from "../../composed/data-validity-info/data-validity-info";
import { Header } from "../../composed/header/header";
import { DataOverview } from "../../analysed-data-overview/analysed-data-overview";
import { BasicDataOverview } from "../../basic-data-overview/basic-data-overview";
import { Loader } from "../../ui-kit/loader-overlay/loader-overlay";
import { ActionButton } from "../../composed/action-button/action-button";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { WarningModal } from "../../composed/warning-modal/warning-modal";
import { UndoButton } from "../../composed/undo-button/undo-button";

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
    overviewTableData,
    sortedDataDisplayHeader,
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
    onPressResetBtn,
    onPressBackBtn,
  } = useReversalAnalysis();

  return (
    <>
      <Loader loadingStatus={loadingStatus} />
      <PageWrapper>
        <RootStack spacing={2}>
          <Header title="Reversal analysis" onPressResetBtn={onPressResetBtn} />

          {/* GL and CoA Upload Section */}
          <Grid2 container spacing={2}>
            {/* GL Upload */}
            <Grid2 size={6}>
              <FileDropzone
                onDrop={onGeneralLedgerDrop}
                text="Drop GL file here"
                uploaded={currentStep !== AnalysisStep.TO_UPLOAD_GL}
                isDisabled={currentStep === AnalysisStep.ANALYZED}
              >
                <GLDropdowns
                  glHeaderOptions={glHeaderOptions}
                  selectedHeaders={selectedHeaders}
                  onChangeGlHeader={onChangeGlHeader}
                />
              </FileDropzone>
            </Grid2>

            {/* CoA & Dictionary Upload */}
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

          <CardStyled>
            {currentStep !== AnalysisStep.TO_UPLOAD_GL &&
            currentStep !== AnalysisStep.UPLOADED_GL ? (
              <DataValidityInfo reviewData={reviewData} error={error} />
            ) : (
              <Stack />
            )}
            <Stack direction="row" spacing={1} alignItems="center">
              <UndoButton
                disabled={
                  currentStep === AnalysisStep.ANALYZED ||
                  currentStep === AnalysisStep.TO_UPLOAD_GL
                }
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

          {/* GL Data Summary */}
          <BasicDataOverview
            title="GL Data With Reversal Identified"
            disabled={currentStep !== AnalysisStep.ANALYZED}
            tableData={tableData}
            tableHeader={tableHeader}
          />

          {/* Data Overview */}
          <DataOverview
            mappingValue={selectedHeaders.coaHeaders.mappingValue}
            overviewTableData={overviewTableData}
            setDataDisplayHeader={setDataDisplayHeader}
            sortedDataDisplayHeader={sortedDataDisplayHeader}
            coaHeaderOptions={coaHeaderOptions}
            title="Movement Tables"
            valueKey={selectedHeaders.glHeaders.value}
            basicTableData={tableData}
            basicTableHeader={tableHeader}
            disabled={currentStep !== AnalysisStep.ANALYZED}
          />

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
