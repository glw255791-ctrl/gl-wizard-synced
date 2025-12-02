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
import { RootStack } from "./style";

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
    reversalTableData,
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
  } = useGeneralAnalysis();

  // Step booleans for rendering control
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
                uploaded={isUploadedGl}
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
          <Grid2 container spacing={2}>
            <Grid2 size={9}>
              <DataValidityInfo
                reviewData={reviewData}
                error={error}
                disabled={!isCoaUploadStep}
              />
            </Grid2>
            <Grid2 size={3}>
              <ActionButton
                disabled={!isAnalyzeStep}
                onPressAnalyzeData={onPressAnalyzeData}
              />
            </Grid2>
          </Grid2>

          {/* Overviews */}
          <BasicDataOverview
            title="GL Data With Transaction Types"
            disabled={!isAnalyzedStep || !!error}
            tableData={reversalTableData}
            tableHeader={tableHeader}
          />

          <DataOverview
            mappingValue={selectedHeaders.coaHeaders.mappingValue}
            overviewTableData={overviewTableData}
            setDataDisplayHeader={setDataDisplayHeader}
            sortedDataDisplayHeader={sortedDataDisplayHeader}
            coaHeaderOptions={coaHeaderOptions}
            title="Movement Tables"
            valueKey={selectedHeaders.glHeaders.value}
            disabled={!isAnalyzedStep || !!error}
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
