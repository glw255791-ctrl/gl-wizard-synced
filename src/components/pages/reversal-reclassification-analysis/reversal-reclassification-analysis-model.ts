/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { formatDate } from "date-fns";
import { saveAs } from "file-saver";
import { createWorkbook, readFirstSheet } from "../../../utils/workbook";
import {
  readFileWithProgress,
  type FileReadProgress,
} from "../../../utils/read-file";
import { TableHeader } from "../../composed/basic-table/basic-table";
import {
  AnalysisStep,
  RawData,
  ReviewData,
  GlHeaders,
  CoaHeaders,
  SelectedHeaders,
  CoaFilters,
} from "../../../types";

// Re-export types for backward compatibility
export type { CoaHeaders, SelectedHeaders, CoaFilters };

// ---- Main Hook ----

export function useReversalReclassificationAnalysis() {
  // --- State ---
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(
    AnalysisStep.TO_UPLOAD_GL
  );
  const [rawData, setRawData] = useState<RawData>({
    glData: [],
    glHeaders: [],
    coaData: [],
    coaHeaders: [],
  });
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [fileProgress, setFileProgress] = useState<FileReadProgress | null>(
    null
  );

  const stopLoading = () => {
    setLoadingStatus(false);
    setFileProgress(null);
  };

  const readTracked = (file: File) => {
    setLoadingStatus(true);
    setFileProgress({
      name: file.name,
      loaded: 0,
      total: file.size,
      phase: "reading",
    });
    return readFileWithProgress(file, (loaded, total) => {
      setFileProgress({
        name: file.name,
        loaded,
        total,
        phase: "reading",
      });
    }).then((buffer) => {
      setFileProgress({
        name: file.name,
        loaded: file.size,
        total: file.size,
        phase: "workbook",
      });
      return buffer;
    });
  };
  const [error, setError] = useState<string | undefined>(undefined);
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);

  const [selectedFilters, setSelectedFilters] = useState<CoaFilters>({
    header: "",
    value: [],
  });
  const [selectedHeaders, setSelectedHeaders] = useState<SelectedHeaders>({
    glHeaders: { account: "", jen: "", date: "", value: "" },
    coaHeaders: { mappingValue: "", displayValue: "", groupingValue: "" },
  });

  // --- Derived Values ---
  const reviewData: ReviewData = useMemo(() => {
    const { glData } = rawData;
    const valueKey = selectedHeaders.glHeaders.value;
    const dateKey = selectedHeaders.glHeaders.date;

    const total = valueKey
      ? glData.reduce((sum, row) => sum + Number(row[valueKey]), 0)
      : 0;

    let startDate = "";
    let endDate = "";
    if (dateKey && glData.length) {
      const timestamps = glData
        .map((item) => new Date(item[dateKey]).getTime())
        .filter(Boolean); // Avoid NaN

      if (timestamps.length) {
        const start = timestamps.reduce((best, time) => Math.min(best, time));
        const end = timestamps.reduce((best, time) => Math.max(best, time));
        startDate = formatDate(new Date(start), "dd-MM-yyyy");
        endDate = formatDate(new Date(end), "dd-MM-yyyy");
      }
    }

    return {
      rows: glData.length,
      total,
      startDate,
      endDate,
    };
  }, [rawData, selectedHeaders]);

  const glHeaderOptions = useMemo(
    () => rawData.glHeaders.map((value) => ({ value, title: value })),
    [rawData.glHeaders]
  );

  const coaHeaderOptions = useMemo(
    () => rawData.coaHeaders.map((value) => ({ value, title: value })),
    [rawData.coaHeaders]
  );

  const coaFilterOptions = useMemo(() => {
    const uniqueVals = [
      ...new Set(
        rawData.coaData
          .map((item) => item[selectedFilters.header])
          .filter(Boolean)
      ),
    ];
    return uniqueVals.map((value) => ({ value, title: value }));
  }, [rawData.coaData, selectedFilters]);

  const tableHeader: TableHeader[] = useMemo(() => {
    const headers = Object.keys(selectedHeaders.glHeaders).map((key) => ({
      key,
      title: selectedHeaders.glHeaders[key as keyof GlHeaders],
    }));

    return [
      ...headers,
      { key: selectedFilters.header, title: selectedFilters.header },
      { key: "result", title: "Result" },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHeaders.glHeaders, tableData, selectedFilters]);

  // --- Handlers ---

  // General Ledger (GL) upload
  const onGeneralLedgerDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!validMimeTypes.includes(file.type) && !file.name.endsWith(".xlsx")) {
      setError("Invalid file type. Please upload an Excel file.");
      setTimeout(() => setError(undefined), 4000);
      return;
    }

    try {
      const buffer = await readTracked(file);
      const { rows, headers } = await readFirstSheet(buffer);
      setRawData((prev) => ({ ...prev, glData: rows, glHeaders: headers }));
      setCurrentStep(AnalysisStep.UPLOADED_GL);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not read the general ledger."
      );
    } finally {
      stopLoading();
    }
  };

  // Chart of Accounts (CoA) upload
  const onChartOfAccountsDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      setError("Could not read that file. Drop an .xlsx chart of accounts.");
      setTimeout(() => setError(undefined), 5000);
      return;
    }

    try {
      const buffer = await readTracked(file);
      const { rows, headers } = await readFirstSheet(buffer);
      setRawData((prev) => ({
        ...prev,
        coaData: rows,
        coaHeaders: headers,
      }));
      setSelectedHeaders((prev) => ({
        ...prev,
        coaHeaders: {
          mappingValue: headers[0],
          displayValue: "",
          groupingValue: "",
          filters: { header: "", value: "" },
        },
      }));
      setSelectedFilters((prev) => ({
        ...prev,
        header: headers[0],
      }));
      setCurrentStep(AnalysisStep.TO_UPLOAD_DICTIONARY);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not read the chart of accounts."
      );
      setTimeout(() => setError(undefined), 6000);
    } finally {
      stopLoading();
    }
  };

  // Header changes for GL
  const onChangeGlHeader = (key: keyof GlHeaders, value: string) => {
    const newGlHeaders = { ...selectedHeaders.glHeaders, [key]: value };
    setSelectedHeaders((prev) => ({ ...prev, glHeaders: newGlHeaders }));

    if (!Object.values(newGlHeaders).some((item) => item === "")) {
      setCurrentStep(AnalysisStep.TO_UPLOAD_COA);
    }
  };

  // Filter changes for CoA
  const onChangeCoaFilter = (
    key: keyof CoaFilters,
    value: string | string[]
  ) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Header changes for CoA
  const onChangeCoaHeader = (key: keyof CoaHeaders, value: string) => {
    setSelectedHeaders((prev) => ({
      ...prev,
      coaHeaders: { ...prev.coaHeaders, [key]: value },
    }));
  };

  // Reset button
  const onPressResetBtn = () => {
    setCurrentStep(AnalysisStep.TO_UPLOAD_GL);
    setTableData([]);
    setError(undefined);
    setRawData({
      coaData: [],
      coaHeaders: [],
      glData: [],
      glHeaders: [],
    });
    setSelectedHeaders({
      coaHeaders: { mappingValue: "", displayValue: "", groupingValue: "" },
      glHeaders: { account: "", date: "", jen: "", value: "" },
    });
    setSelectedFilters({ header: "", value: [] });
  };

  const onPressBackBtn = () => {
    setCurrentStep((prev) => {
      switch (prev) {
        case AnalysisStep.TO_UPLOAD_GL:
          return AnalysisStep.TO_UPLOAD_GL;

        case AnalysisStep.UPLOADED_GL:
          setRawData({
            glData: [],
            glHeaders: [],
            coaData: [],
            coaHeaders: [],
          });
          setSelectedHeaders({
            glHeaders: { account: "", jen: "", date: "", value: "" },
            coaHeaders: {
              displayValue: "",
              mappingValue: "",
              groupingValue: "",
            },
          });
          return AnalysisStep.TO_UPLOAD_GL;

        case AnalysisStep.TO_UPLOAD_COA:
          setSelectedHeaders({
            glHeaders: { account: "", jen: "", date: "", value: "" },
            coaHeaders: {
              displayValue: "",
              mappingValue: "",
              groupingValue: "",
            },
          });
          return AnalysisStep.UPLOADED_GL;

        case AnalysisStep.TO_UPLOAD_DICTIONARY:
          setRawData((prev) => ({
            ...prev,
            coaData: [],
            coaHeaders: [],
          }));
          setSelectedHeaders((prev) => ({
            ...prev,
            coaHeaders: {
              displayValue: "",
              mappingValue: "",
              groupingValue: "",
            },
          }));
          return AnalysisStep.TO_UPLOAD_COA;

        default:
          return prev;
      }
    });
  };

  // Analyze data (runs web worker)
  const onPressAnalyzeData = () => {
    setLoadingStatus(true);
    const worker = new Worker(
      new URL(
        "../../../workers/reversal-reclassification-worker.js",
        import.meta.url
      ),
      { type: "module" }
    );

    worker.onmessage = (event) => {
      setTableData(
        Object.values(event.data.groupedByAccountAndDate).flat() as Record<
          string,
          any
        >[]
      );
      setCurrentStep(AnalysisStep.ANALYZED);
      stopLoading();
      worker.terminate();
    };

    worker.onerror = (error) => {
      console.error("Worker error:", error);
      stopLoading();
      worker.terminate();
    };

    worker.postMessage({ rawData, selectedHeaders, selectedFilters });
  };

  // Download analyzed table as Excel
  const onPressDownloadData = async () => {
    // Prepare export data (no coaData, flatten result if array)
    const dataForExport = tableData.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { coaData, ...rest } = item;
      return {
        ...rest,
        result: Array.isArray(rest.result)
          ? rest.result.join("/")
          : rest.result,
      };
    });

    const workbook = await createWorkbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Get all headers
    const headers = Object.keys(dataForExport[0]);

    // Setup worksheet columns
    worksheet.columns = headers.map((header) => ({
      header,
      key: header,
      width: 20,
    }));

    // Header style
    const headerRow = worksheet.getRow(0);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D3D3D3" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Add all data rows
    dataForExport.forEach((obj) => {
      const row = headers.map((header) => {
        const value = (obj as Record<string, unknown>)[header];
        return typeof value === "number" && value > 999999 ? `${value}` : value;
      });

      const rowInstance = worksheet.addRow(row);

      // Style the final (result) column
      rowInstance.getCell(headers.length).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF99" },
      };
    });

    // Write and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "newFile.xlsx");
  };

  // --- Return API ---
  return {
    onChangeGlHeader,
    onChangeCoaHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressDownloadData,
    onPressResetBtn,
    onChangeCoaFilter,
    error,
    loadingStatus,
    fileProgress,
    coaFilterOptions,
    selectedFilters,
    currentStep,
    tableHeader,
    tableData,
    rawData,
    glHeaderOptions,
    selectedHeaders,
    coaHeaderOptions,
    reviewData,
    onPressBackBtn,
  };
}
