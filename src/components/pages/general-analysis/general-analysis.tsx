import { Grid2, Stack } from "@mui/material";
import { FileDropzone } from "../../ui-kit/dropzone/dropzone";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { Header } from "../../composed/header/header";
import { GLDropdowns } from "../../composed/gl-dropdowns/gl-dropdowns";
import { DataValidityInfo } from "../../composed/data-validity-info/data-validity-info";
import { BasicDataOverview } from "../../basic-data-overview/basic-data-overview";
import { DataOverview } from "../../analysed-data-overview/analysed-data-overview";
import { AnalysisStep, useGeneralAnalysis } from "./general-analysis-model";
import { styles } from "./style";
import { Loader } from "../../ui-kit/loader-overlay/loader-overlay";
import { ActionButton } from "../../composed/action-button/action-button";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";

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
    setDataDisplayHeader,
    onChangeCoaHeader,
    onChangeGlHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressResetBtn,
  } = useGeneralAnalysis();

  // Memoized computed values
  const isUploadedGl = currentStep.includes(AnalysisStep.UPLOADED_GL);
  const isCoaUploadStep = currentStep.includes(AnalysisStep.TO_UPLOAD_COA);
  const isAnalyzeStep = currentStep.includes(AnalysisStep.TO_ANALYZE);
  const isAnalyzedStep = currentStep.includes(AnalysisStep.ANALYZED);

  return (
    <>
      <Loader loadingStatus={loadingStatus} />
      <PageWrapper>
        <Stack style={styles.root} spacing={2}>
          <Header
            title="GL analysis - Transaction type"
            onPressResetBtn={onPressResetBtn}
          />

          <Grid2 container spacing={2}>
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

            <Grid2 size={6}>
              <FileDropzone
                onDrop={onChartOfAccountsDrop}
                text="Drop CoA file here"
                uploaded={isAnalyzeStep}
                isDisabled={!isCoaUploadStep}
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
                isAnalyzeStep={isAnalyzeStep}
                onPressAnalyzeData={onPressAnalyzeData}
              />
            </Grid2>
          </Grid2>

          <BasicDataOverview
            title="Basic data"
            disabled={!isAnalyzedStep}
            tableData={tableData}
            tableHeader={tableHeader}
          />

          <DataOverview
            mappingValue={selectedHeaders.coaHeaders.mappingValue}
            overviewTableData={overviewTableData}
            setDataDisplayHeader={setDataDisplayHeader}
            sortedDataDisplayHeader={sortedDataDisplayHeader}
            coaHeaderOptions={coaHeaderOptions}
            title="Analyzed data"
            valueKey={selectedHeaders.glHeaders.value}
            disabled={!isAnalyzedStep}
            basicTableData={tableData}
            basicTableHeader={tableHeader}
          />
        </Stack>
      </PageWrapper>
    </>
  );
}
