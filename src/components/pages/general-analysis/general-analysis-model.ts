/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Workbook } from "exceljs";
import { formatDate } from "date-fns";
import { TableHeader } from "../../composed/basic-table/basic-table";
import { exportTableToExcel } from "../../composed/basic-table/functions";
import {
  RawData,
  GlHeaders,
  CoaHeaders,
  SelectedHeaders,
  ReviewData,
  AnalysisStep,
} from "../../../types";

// Re-export types for backward compatibility
export type { RawData, GlHeaders, CoaHeaders, SelectedHeaders, ReviewData };
export { AnalysisStep };

// --- Main Hook ---

/**
 * Custom hook for managing general analysis workflow
 * Handles file uploads, data processing, and analysis steps
 * @returns Object containing state and handlers for general analysis
 */
export function useGeneralAnalysis() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isWarningModalShown, setIsWarningModalShown] = useState(false);

  const [currentStep, setCurrentStep] = useState<AnalysisStep>(
    AnalysisStep.TO_UPLOAD_GL
  );
  const [rawData, setRawData] = useState<RawData>({
    glData: [],
    glHeaders: [],
    coaData: [],
    coaHeaders: [],
  });
  const [dataDisplayHeader, setDataDisplayHeader] = useState<
    Record<string, any>[]
  >([]);
  const [overviewTableData, setOverviewTableData] = useState<
    Record<string, any>
  >({});
  const [unmappedRows, setUnmappedRows] = useState<Record<string, any>[]>([]);
  const [isDictionaryUploaded, setIsDictionaryUploaded] = useState(false);
  const [dictionaryData, setDictionaryData] = useState<Record<string, any>[]>(
    []
  );
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  // const [reversalTableData, setReversalTableData] = useState<
  //   Record<string, any>[]
  // >([]);
  const [selectedHeaders, setSelectedHeaders] = useState<SelectedHeaders>({
    glHeaders: { account: "", jen: "", date: "", value: "" },
    coaHeaders: { displayValue: "", mappingValue: "", groupingValue: "" },
  });
  const [loadingStatus, setLoadingStatus] = useState(false);

  // --- Memoized Values ---

  /**
   * Handles back button press, navigating to previous step and resetting relevant state
   */
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

        case AnalysisStep.UPLOADED_DICTIONARY:
          setDictionaryData([]);
          setIsDictionaryUploaded(false);
          return AnalysisStep.TO_UPLOAD_DICTIONARY;

        case AnalysisStep.ANALYZED:
          setTableData([]);
          setOverviewTableData({});
          setDataDisplayHeader([]);
          return dictionaryData.length > 0
            ? AnalysisStep.UPLOADED_DICTIONARY
            : AnalysisStep.TO_UPLOAD_DICTIONARY;
        default:
          return prev;
      }
    });
  };

  /**
   * Computes review data summary including row count, total value, and date range
   */
  const reviewData: ReviewData = useMemo(() => {
    const countRows = rawData.glData.length;

    const total = selectedHeaders.glHeaders.value
      ? rawData.glData.reduce((sum, row) => {
          const val = Number(row[selectedHeaders.glHeaders.value]);
          return sum + (Number.isNaN(val) ? 0 : val);
        }, 0)
      : 0;

    /**
     * Gets the minimum or maximum date from the data
     * @param fn - Math.min or Math.max function
     * @returns Formatted date string or empty string
     */
    const getDate = (fn: (...dates: number[]) => number) => {
      if (!selectedHeaders.glHeaders.date) return "";
      const times = rawData.glData
        .map((item) => new Date(item[selectedHeaders.glHeaders.date]))
        .filter((date) => !isNaN(date.getTime()))
        .map((date) => date.getTime());
      if (!times.length) return "";
      return formatDate(new Date(fn(...times)), "dd-MM-yyyy");
    };

    return {
      rows: countRows,
      total,
      startDate: getDate(Math.min),
      endDate: getDate(Math.max),
    };
  }, [rawData, selectedHeaders]);

  const glHeaderOptions = useMemo(
    () =>
      rawData.glHeaders.map((item) => ({
        value: item,
        title: item,
      })),
    [rawData]
  );

  const coaHeaderOptions = useMemo(
    () =>
      rawData.coaHeaders.map((item) => ({
        value: item,
        title: item,
      })),
    [rawData]
  );

  const tableHeader: TableHeader[] = useMemo(
    () => [
      ...Object.keys(selectedHeaders.glHeaders).map((item) => ({
        key: item,
        title: selectedHeaders.glHeaders[item as keyof GlHeaders],
      })),
      { key: "result", title: "result" },
      { key: "reversal", title: "reversal" },
    ],
    [selectedHeaders.glHeaders]
  );

  const reversalTableHeader: TableHeader[] = useMemo(
    () => [
      ...Object.keys(selectedHeaders.glHeaders).map((item) => ({
        key: item,
        title: selectedHeaders.glHeaders[item as keyof GlHeaders],
      })),
      { key: "reversal", title: "reversal" },
    ],
    [selectedHeaders.glHeaders]
  );

  // --- File Drop Handlers ---

  /**
   * Handles dictionary file drop and processing
   * @param acceptedFiles - Array of accepted file objects
   */
  const onDictionaryDrop = async (acceptedFiles: File[]) => {
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

    setLoadingStatus(true);
    const buffer = await file.arrayBuffer();
    const worker = new Worker(
      new URL("../../../workers/dictionary-worker.js", import.meta.url),
      { type: "module" }
    );

    worker.postMessage({ buffer });

    worker.onmessage = (e) => {
      const { data, error } = e.data;
      if (error) {
        setError(error);
        setLoadingStatus(false);
        return;
      }
      setDictionaryData(data);

      worker.onerror = (workerError) => {
        setError(workerError.message);
        console.error("Worker error:", workerError);
        setLoadingStatus(false);
        worker.terminate();
      };

      setLoadingStatus(false);
      setIsDictionaryUploaded(true);
      worker.terminate();
    };

    setCurrentStep(AnalysisStep.UPLOADED_DICTIONARY);
  };

  /**
   * Handles General Ledger file drop and processing
   * @param acceptedFiles - Array of accepted file objects
   */
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

    setLoadingStatus(true);
    const buffer = await file.arrayBuffer();
    const worker = new Worker(new URL("./gl-worker.js", import.meta.url), {
      type: "module",
    });

    worker.postMessage({ buffer });

    worker.onmessage = (e) => {
      const { glData, glHeaders, error } = e.data;
      if (error) {
        setError(error);
        setLoadingStatus(false);
        return;
      }

      setRawData((prev) => ({ ...prev, glData, glHeaders }));

      worker.onerror = (workerError) => {
        setError(workerError.message);
        console.error("Worker error:", workerError);
        setLoadingStatus(false);
        worker.terminate();
      };

      setCurrentStep(AnalysisStep.UPLOADED_GL);
      setLoadingStatus(false);
      worker.terminate();
    };
  };

  /**
   * Handles Chart of Accounts file drop and processing
   * @param acceptedFiles - Array of accepted file objects
   */
  const onChartOfAccountsDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const workbook = new Workbook();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];
    if (!sheet) return;

    const columnNames: string[] = sheet.getRow(1).values as string[];

    const rows = sheet
      .getSheetValues()
      .slice(2)
      .map((row: any) =>
        columnNames.reduce((acc, col, index) => {
          acc[col] = row[index]?.result ?? row[index] ?? "";
          return acc;
        }, {} as Record<string, any>)
      );

    setRawData((prev) => ({
      ...prev,
      coaData: rows,
      coaHeaders: columnNames.filter(Boolean),
    }));

    setSelectedHeaders((prev) => ({
      ...prev,
      coaHeaders: {
        displayValue: columnNames.filter(Boolean)[0],
        mappingValue: columnNames.filter(Boolean)[0],
        groupingValue: columnNames.filter(Boolean)[0],
      },
    }));

    setCurrentStep(AnalysisStep.TO_UPLOAD_DICTIONARY);
  };

  // --- Header Selection ---

  /**
   * Updates GL header selection and advances step if all headers are selected
   * @param key - The GL header key to update
   * @param value - The selected header value
   */
  const onChangeGlHeader = (key: keyof GlHeaders, value: string) => {
    const newGlHeaders = { ...selectedHeaders.glHeaders, [key]: value };
    setSelectedHeaders((prev) => ({ ...prev, glHeaders: newGlHeaders }));

    if (!Object.values(newGlHeaders).some((item) => item === "")) {
      setCurrentStep(AnalysisStep.TO_UPLOAD_COA);
    }
  };

  /**
   * Updates CoA header selection
   * @param key - The CoA header key to update
   * @param value - The selected header value
   */
  const onChangeCoaHeader = (key: keyof CoaHeaders, value: string) => {
    setSelectedHeaders((prev) => ({
      ...prev,
      coaHeaders: { ...prev.coaHeaders, [key]: value },
    }));
  };

  // --- Reset Button ---

  /**
   * Resets all analysis state to initial values
   */
  const onPressResetBtn = () => {
    setCurrentStep(AnalysisStep.TO_UPLOAD_GL);
    setTableData([]);
    setError(undefined);
    setDictionaryData([]);
    setIsDictionaryUploaded(false);
    setUnmappedRows([]);
    setIsWarningModalShown(false);
    // setReversalTableData([]);
    setDataDisplayHeader([]);
    setOverviewTableData({});
    setRawData({
      coaData: [],
      coaHeaders: [],
      glData: [],
      glHeaders: [],
    });
    setSelectedHeaders({
      coaHeaders: { displayValue: "", mappingValue: "", groupingValue: "" },
      glHeaders: { account: "", date: "", jen: "", value: "" },
    });
  };

  // --- Data Analyze ---

  /**
   * Initiates data analysis using Web Workers
   * Processes GL data, CoA mappings, and dictionary data
   */
  const onPressAnalyzeData = () => {
    setLoadingStatus(true);

    // Main general worker
    const worker = new Worker(
      new URL("../../../workers/general-worker.js", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (event) => {
      const notMappedRows = event.data.tableData.filter((item: any) =>
        JSON.stringify(item).includes("not mapped")
      );
      if (notMappedRows.length > 0) {
        setUnmappedRows(notMappedRows);
        setIsWarningModalShown(true);
      }

      setTableData(event.data.tableData);
      setOverviewTableData(event.data.overviewTableData);
      setDataDisplayHeader(event.data.displayHeaders);
      setCurrentStep(AnalysisStep.ANALYZED);

      worker.terminate();

      if (event.data.tableData.find((item: any) => !item.coaData)) {
        setError("Some rows from GL do not have a CoA");
        setTimeout(() => setError(undefined), 4000);
      }
    };

    worker.onerror = (error) => {
      setError(error.message);
      console.error("Worker error:", error);
      setLoadingStatus(false);
      worker.terminate();
    };
    worker.postMessage({ rawData, selectedHeaders, dictionaryData });

    setTimeout(() => {
      setLoadingStatus(false);
    }, 4000);
  };

  // --- Data Display ---

  const sortedDataDisplayHeader = useMemo(() => {
    const mappingKey = selectedHeaders.coaHeaders.mappingValue;
    const active = dataDisplayHeader
      .filter((item) => item.active)
      .sort((a, b) => a[mappingKey] - b[mappingKey]);
    const inactive = dataDisplayHeader
      .filter((item) => !item.active)
      .sort((a, b) => a[mappingKey] - b[mappingKey]);
    return [
      ...active,
      dataDisplayHeader[0]
        ? Object.fromEntries(
            Object.keys(dataDisplayHeader[0]).map((key) => [key, "total"])
          )
        : { [mappingKey]: "total" },
      ...inactive,
    ];
  }, [dataDisplayHeader, selectedHeaders.coaHeaders.mappingValue]);

  // --- Export Handler ---

  /**
   * Exports unmapped rows to Excel
   */
  const onPressExportUnmappedRows = () => {
    exportTableToExcel(tableHeader, unmappedRows);
  };

  // --- Return ---

  return {
    onChangeGlHeader,
    onChangeCoaHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressResetBtn,
    setDataDisplayHeader,
    setIsWarningModalShown,
    onPressExportUnmappedRows,
    onDictionaryDrop,
    onPressBackBtn,
    dictionaryData,
    isDictionaryUploaded,
    // reversalTableData,
    loadingStatus,
    error,
    overviewTableData,
    sortedDataDisplayHeader,
    currentStep,
    tableHeader,
    reversalTableHeader,
    tableData,
    rawData,
    glHeaderOptions,
    selectedHeaders,
    coaHeaderOptions,
    reviewData,
    dataDisplayHeader,
    isWarningModalShown,
  };
}
