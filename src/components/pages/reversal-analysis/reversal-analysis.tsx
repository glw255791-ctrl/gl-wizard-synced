import { Button, Card, Grid2, Stack } from "@mui/material";
import { FileDropzone } from "../../ui-kit/dropzone/dropzone";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { styles } from "./style";
import { AnalysisStep, useReversalAnalysis } from "./reversal-analysis-model";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import { GLDropdowns } from "../../composed/gl-dropdowns/gl-dropdowns";
import { DataValidityInfo } from "../../composed/data-validity-info/data-validity-info";
import { Header } from "../../composed/header/header";
import { DataOverview } from "../../analysed-data-overview/analysed-data-overview";
import { BasicDataOverview } from "../../basic-data-overview/basic-data-overview";
import { Loader } from "../../ui-kit/loader-overlay/loader-overlay";

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
    setDataDisplayHeader,
    onChangeCoaHeader,
    onChangeGlHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressResetBtn,
  } = useReversalAnalysis();

  // Memoized computed values
  const isUploadedGl = currentStep.includes(AnalysisStep.UPLOADED_GL);
  const isCoaUploadStep = currentStep.includes(AnalysisStep.TO_UPLOAD_COA);
  const isAnalyzeStep = currentStep.includes(AnalysisStep.TO_ANALYZE);
  const isAnalyzedStep = currentStep.includes(AnalysisStep.ANALYZED);

  // Reusable component for file dropzone with dropdowns
  const FileDropzoneSection = ({
    onDrop,
    text,
    uploaded,
    children,
    isDisabled,
  }: {
    onDrop: (files: File[]) => void;
    text: string;
    uploaded: boolean;
    children: React.ReactNode;
    isDisabled?: boolean;
  }) => (
    <Card style={isDisabled ? styles.disabledCard : styles.card}>
      <Grid2 container spacing={2} height="100%">
        <Grid2 size={6}>
          <FileDropzone onDrop={onDrop} text={text} uploaded={uploaded} />
        </Grid2>
        <Grid2 size={6}>{children}</Grid2>
      </Grid2>
    </Card>
  );

  return (
    <>
      <Loader loadingStatus={loadingStatus} />
      <Stack style={styles.root} spacing={2}>
        <Header title="Reversal analysis" onPressResetBtn={onPressResetBtn} />

        <Grid2 container spacing={2}>
          <Grid2 size={6}>
            <FileDropzoneSection
              onDrop={onGeneralLedgerDrop}
              text="Drop GL file here"
              uploaded={isUploadedGl}
            >
              <GLDropdowns
                glHeaderOptions={glHeaderOptions}
                selectedHeaders={selectedHeaders}
                onChangeGlHeader={onChangeGlHeader}
              />
            </FileDropzoneSection>
          </Grid2>

          <Grid2 size={6}>
            <FileDropzoneSection
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
                    onChangeCoaHeader("mappingValue", e.target.value as string)
                  }
                />
                <Dropdown
                  label="Display CoA category"
                  items={coaHeaderOptions}
                  value={selectedHeaders.coaHeaders.displayValue}
                  onChange={(e) =>
                    onChangeCoaHeader("displayValue", e.target.value as string)
                  }
                />
              </Stack>
            </FileDropzoneSection>
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
            <Card style={isAnalyzeStep ? styles.card : styles.disabledCard}>
              <Stack sx={styles.buttonsWrapper}>
                <Grid2 container spacing={5} sx={styles.progressAndBtnWrapper}>
                  <Grid2 size={6} />
                  <Grid2 size={6}>
                    <Button
                      onClick={onPressAnalyzeData}
                      variant="contained"
                      sx={{ ...styles.button, backgroundColor: "#204795" }}
                      endIcon={<TroubleshootIcon />}
                    >
                      Process
                    </Button>
                  </Grid2>
                </Grid2>
              </Stack>
            </Card>
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
        />
      </Stack>
    </>
  );
}
