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
import { BasicDataOverview } from "../../basic-data-overview/basic-data-overview";
import { Loader } from "../../ui-kit/loader-overlay/loader-overlay";
import { ActionButton } from "../../composed/action-button/action-button";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { UndoButton } from "../../composed/undo-button/undo-button";

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
    onPressBackBtn,
  } = useReversalReclassificationAnalysis();

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
                uploaded={currentStep !== AnalysisStep.TO_UPLOAD_GL}
              >
                <GLDropdowns
                  glHeaderOptions={glHeaderOptions}
                  selectedHeaders={selectedHeaders}
                  onChangeGlHeader={onChangeGlHeader}
                />
              </FileDropzone>
            </Grid2>

            {/* Chart of Accounts Upload (with filters) */}
            {currentStep !== AnalysisStep.ANALYZED && (
              <Grid2 size={6}>
                <FileDropzone
                  onDrop={onChartOfAccountsDrop}
                  text="Drop CoA file here"
                  uploaded={
                    currentStep === AnalysisStep.TO_UPLOAD_DICTIONARY ||
                    currentStep === AnalysisStep.UPLOADED_DICTIONARY
                  }
                  isDisabled={
                    currentStep === AnalysisStep.TO_UPLOAD_GL ||
                    currentStep === AnalysisStep.UPLOADED_GL
                  }
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
                        onChangeCoaFilter(
                          "header",
                          event.target.value as string
                        )
                      }
                    />
                    <Dropdown
                      multiple
                      label="Filter by value"
                      items={coaFilterOptions}
                      value={selectedFilters.value}
                      onChange={(event) =>
                        onChangeCoaFilter(
                          "value",
                          event.target.value as string[]
                        )
                      }
                    />
                  </Stack>
                </FileDropzone>
              </Grid2>
            )}
          </Grid2>

          <CardStyled>
            {currentStep !== AnalysisStep.TO_UPLOAD_GL &&
            currentStep !== AnalysisStep.UPLOADED_GL ? (
              <DataValidityInfo reviewData={reviewData} error={error} />
            ) : (
              <Stack />
            )}
            {currentStep !== AnalysisStep.ANALYZED && (
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
            )}
          </CardStyled>
          {/* GL Data Overview */}
          <BasicDataOverview
            title="GL Data With Transaction Types"
            reversalReclassification
            disabled={currentStep !== AnalysisStep.ANALYZED}
            tableData={tableData}
            tableHeader={tableHeader}
          />
        </RootStack>
      </PageWrapper>
    </>
  );
}
