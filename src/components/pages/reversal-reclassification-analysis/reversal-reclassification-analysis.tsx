import { Grid2, Stack } from "@mui/material";
import { FileDropzone } from "../../ui-kit/dropzone/dropzone";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { RootStack } from "./style";
import { useReversalReclassificationAnalysis } from "./reversal-reclassification-analysis-model";

import { AnalysisStep } from "../general-analysis/general-analysis-model";
import { GLDropdowns } from "../../composed/gl-dropdowns/gl-dropdowns";
import { Header } from "../../composed/header/header";
import { DataValidityInfo } from "../../composed/data-validity-info/data-validity-info";
import { BasicDataOverview } from "../../basic-data-overview/basic-data-overview";
import { Loader } from "../../ui-kit/loader-overlay/loader-overlay";
import { ActionButton } from "../../composed/action-button/action-button";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";

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
    onChangeCoaFilter,
    onChangeCoaHeader,
    onChangeGlHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressResetBtn,
  } = useReversalReclassificationAnalysis();

  // Step state flags for easier conditional rendering
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
            title="Reversal/Reclassification analysis"
            onPressResetBtn={onPressResetBtn}
          />

          {/* GL and CoA upload section */}
          <Grid2 container spacing={2}>
            {/* General Ledger Upload */}
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

            {/* Chart of Accounts Upload (with filters) */}
            <Grid2 size={6}>
              <FileDropzone
                onDrop={onChartOfAccountsDrop}
                text="Drop CoA file here"
                uploaded={isAnalyzeStep}
                isDisabled={!isCoaUploadStep}
              >
                <Stack spacing={1}>
                  <Dropdown
                    label="Mapping value"
                    items={coaHeaderOptions}
                    value={selectedHeaders.coaHeaders.mappingValue}
                    onChange={(event) =>
                      onChangeCoaHeader(
                        "mappingValue",
                        event.target.value as string
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
              </FileDropzone>
            </Grid2>
          </Grid2>

          {/* Data Validity & Analysis Actions */}
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

          {/* GL Data Overview */}
          <BasicDataOverview
            title="GL Data With Transaction Types"
            reversalReclassification
            disabled={!isAnalyzedStep}
            tableData={tableData}
            tableHeader={tableHeader}
          />
        </RootStack>
      </PageWrapper>
    </>
  );
}
