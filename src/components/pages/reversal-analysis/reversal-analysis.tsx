import { Grid2, Stack } from "@mui/material";
import { FileDropzone } from "../../ui-kit/dropzone/dropzone";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { RootStack } from "./style";
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
    dictionaryData,
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
  } = useReversalAnalysis();

  // Step booleans for rendering clarity
  const isUploadedGl = currentStep.includes(AnalysisStep.UPLOADED_GL);
  const isCoaUploadStep = currentStep.includes(AnalysisStep.TO_UPLOAD_COA);
  const isAnalyzeStep = currentStep.includes(AnalysisStep.TO_ANALYZE);
  const isAnalyzedStep = currentStep.includes(AnalysisStep.ANALYZED);

  return (
    <>
      <Loader loadingStatus={loadingStatus} />
      <PageWrapper>
        <RootStack spacing={2}>

          <Header
            title="Reversal analysis"
            onPressResetBtn={onPressResetBtn}
          />

          {/* GL and CoA Upload Section */}
          <Grid2 container spacing={2}>
            {/* GL Upload */}
            <Grid2 size={6}>
              <FileDropzone
                onDrop={onGeneralLedgerDrop}
                text="Drop GL file here"
                uploaded={isUploadedGl}
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
                uploaded={isAnalyzeStep}
                isDisabled={!isCoaUploadStep}
                onAdditionalDrop={onDictionaryDrop}
                additionalText="Drop Dictionary file here"
                additionalUploaded={isDictionaryUploaded}
              >
                <Stack spacing={1}>
                  <Dropdown
                    label="Matching column GL & CoA"
                    items={coaHeaderOptions}
                    value={selectedHeaders.coaHeaders.mappingValue}
                    onChange={e =>
                      onChangeCoaHeader("mappingValue", e.target.value as string)
                    }
                  />
                  <Dropdown
                    label="Display CoA category"
                    items={coaHeaderOptions}
                    value={selectedHeaders.coaHeaders.displayValue}
                    onChange={e =>
                      onChangeCoaHeader("displayValue", e.target.value as string)
                    }
                  />
                </Stack>
              </FileDropzone>
            </Grid2>
          </Grid2>

          {/* Data Validity & Analysis Actions */}
          <Grid2 container spacing={2}>
            <Grid2 size={6}>
              <DataValidityInfo
                reviewData={reviewData}
                error={error}
                disabled={!isCoaUploadStep}
              />
            </Grid2>
            <Grid2 size={6}>
              <ActionButton
                disabled={!isAnalyzeStep}
                onPressAnalyzeData={onPressAnalyzeData}
              />
            </Grid2>
          </Grid2>

          {/* GL Data Summary */}
          <BasicDataOverview
            title="GL Data With Reversal Identified"
            disabled={!isAnalyzedStep}
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
            dictionaryData={dictionaryData}
            valueKey={selectedHeaders.glHeaders.value}
            basicTableData={tableData}
            basicTableHeader={tableHeader}
            disabled={!isAnalyzedStep}
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
