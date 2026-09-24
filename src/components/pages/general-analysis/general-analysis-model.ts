/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { formatDate } from "date-fns";
import { TableHeader } from "../../composed/basic-table/basic-table";
import { exportTableToExcel } from "../../composed/basic-table/functions";
import {
  readFileWithProgress,
  type FileReadProgress,
} from "../../../utils/read-file";
import { readFirstSheet } from "../../../utils/workbook";
import { dictionaryFromRows } from "../../../utils/dictionary";
import { analyzeLedger } from "../../../utils/analyze-ledger";
import { presentLedgerRows } from "../../../utils/present-ledger";
import {
  recallCoaHeaders,
  recallGlHeaders,
  rememberCoaHeaders,
  rememberGlHeaders,
} from "../../../utils/column-memory";
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
  const [displayTableData, setDisplayTableData] = useState<Record<string, any>[]>(
    []
  );

  const [selectedHeaders, setSelectedHeaders] = useState<SelectedHeaders>({
    glHeaders: { account: "", jen: "", date: "", value: "" },
    coaHeaders: { displayValue: "", mappingValue: "", groupingValue: "" },
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
      unit: "bytes",
    });
    return readFileWithProgress(file, (loaded, total) => {
      setFileProgress({
        name: file.name,
        loaded,
        total,
        phase: "reading",
        unit: "bytes",
      });
    }).then((buffer) => {
      setFileProgress({
        name: file.name,
        loaded: file.size,
        total: file.size,
        phase: "workbook",
        unit: "bytes",
      });
      return buffer;
    });
  };
  const [isHierarchyModalVisible, setIsHierarchyModalVisible] = useState(false);

  const [hierarchyData, setHierarchyData] = useState<Record<string, any>[]>([]);

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
          setDisplayTableData([]);
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
      const bound = times.reduce((best, time) => fn(best, time));
      return formatDate(new Date(bound), "dd-MM-yyyy");
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

    try {
      const buffer = await readTracked(file);
      const { rows } = await readFirstSheet(buffer);
      const data = dictionaryFromRows(rows);
      if (!data.length) {
        setError("No dictionary rows found in that file.");
        setTimeout(() => setError(undefined), 5000);
        return;
      }
      setDictionaryData(data);
      setIsDictionaryUploaded(true);
      setCurrentStep(AnalysisStep.UPLOADED_DICTIONARY);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not read the dictionary."
      );
      setTimeout(() => setError(undefined), 5000);
    } finally {
      stopLoading();
    }
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

    try {
      const buffer = await readTracked(file);
      const { rows, headers } = await readFirstSheet(buffer, (done, total) => {
        setFileProgress({
          name: file.name,
          loaded: done,
          total,
          phase: "workbook",
          unit: "rows",
        });
      });
      setRawData((prev) => ({ ...prev, glData: rows, glHeaders: headers }));
      const recalled = recallGlHeaders(headers);
      setSelectedHeaders((prev) => ({ ...prev, glHeaders: recalled }));
      setCurrentStep(
        Object.values(recalled).every(Boolean)
          ? AnalysisStep.TO_UPLOAD_COA
          : AnalysisStep.UPLOADED_GL
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not read the general ledger."
      );
    } finally {
      stopLoading();
    }
  };

  /**
   * Handles Chart of Accounts file drop and processing
   * @param acceptedFiles - Array of accepted file objects
   */
  const onChartOfAccountsDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      setError("Could not read that file. Drop an .xlsx chart of accounts.");
      setTimeout(() => setError(undefined), 5000);
      return;
    }

    try {
      const buffer = await readTracked(file);
      const { rows, headers } = await readFirstSheet(buffer, (done, total) => {
        setFileProgress({
          name: file.name,
          loaded: done,
          total,
          phase: "workbook",
          unit: "rows",
        });
      });
      const sameAsLedger =
        headers.length > 0 &&
        headers.length === rawData.glHeaders.length &&
        headers.every((header, index) => header === rawData.glHeaders[index]);
      if (sameAsLedger) {
        setError(
          "That file is the general ledger. Drop the chart of accounts on the right."
        );
        setTimeout(() => setError(undefined), 6000);
        return false;
      }
      setRawData((prev) => ({
        ...prev,
        coaData: rows,
        coaHeaders: headers,
      }));
      const recalled = recallCoaHeaders(headers);
      setSelectedHeaders((prev) => ({
        ...prev,
        coaHeaders: recalled,
      }));
      rememberCoaHeaders(recalled);
      setHierarchyData(
        headers.map((item, index) => ({
          value: item,
          level: index + 1,
        }))
      );
      setCurrentStep(AnalysisStep.TO_UPLOAD_DICTIONARY);
      return true;
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

  // --- Header Selection ---

  /**
   * Updates GL header selection and advances step if all headers are selected
   * @param key - The GL header key to update
   * @param value - The selected header value
   */
  const onChangeGlHeader = (key: keyof GlHeaders, value: string) => {
    const newGlHeaders = { ...selectedHeaders.glHeaders, [key]: value };
    setSelectedHeaders((prev) => ({ ...prev, glHeaders: newGlHeaders }));
    if (Object.values(newGlHeaders).every(Boolean)) rememberGlHeaders(newGlHeaders);

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
    setSelectedHeaders((prev) => {
      const coaHeaders = { ...prev.coaHeaders, [key]: value };
      if (Object.values(coaHeaders).every(Boolean)) rememberCoaHeaders(coaHeaders);
      return { ...prev, coaHeaders };
    });
  };

  // --- Reset Button ---

  /**
   * Resets all analysis state to initial values
   */
  const onPressResetBtn = () => {
    setCurrentStep(AnalysisStep.TO_UPLOAD_GL);
    setTableData([]);
    setDisplayTableData([]);
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
  const onPressAnalyzeData = async () => {
    const totalRows = rawData.glData.length;
    setLoadingStatus(true);
    setFileProgress({
      name: "ledger",
      loaded: 0,
      total: totalRows,
      phase: "workbook",
      unit: "rows",
    });

    try {
      const result = await analyzeLedger(
        rawData,
        selectedHeaders,
        dictionaryData,
        (done, total) => {
          setFileProgress({
            name: "ledger",
            loaded: done,
            total,
            phase: "workbook",
            unit: "rows",
          });
        }
      );
      const accountKey = selectedHeaders.glHeaders.account;
      const notMappedRows = result.tableData.filter(
        (item) =>
          item[accountKey] === "not mapped" ||
          Object.values(item.coaData ?? {}).includes("not mapped")
      );
      if (notMappedRows.length > 0) {
        setUnmappedRows(notMappedRows);
        setIsWarningModalShown(true);
      }
      setTableData(result.tableData);
      const displayRows = await presentLedgerRows(
        result.tableData,
        selectedHeaders.glHeaders.value,
        selectedHeaders.glHeaders.date,
        (done, total) => {
          setFileProgress({
            name: "ledger",
            loaded: done,
            total,
            phase: "workbook",
            unit: "rows",
          });
        }
      );
      setDisplayTableData(displayRows);
      setOverviewTableData(result.overviewTableData);
      setDataDisplayHeader(result.displayHeaders);
      setCurrentStep(AnalysisStep.ANALYZED);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not analyze the ledger.");
    } finally {
      stopLoading();
    }
  };

  const applySuggestedName = async (inputs: string[], narrative: string) => {
    const nextDictionary = [
      ...dictionaryData,
      { inputs, result: narrative },
    ];
    setDictionaryData(nextDictionary);
    setLoadingStatus(true);
    try {
      const result = await analyzeLedger(
        rawData,
        selectedHeaders,
        nextDictionary
      );
      setTableData(result.tableData);
      const displayRows = await presentLedgerRows(
        result.tableData,
        selectedHeaders.glHeaders.value,
        selectedHeaders.glHeaders.date
      );
      setDisplayTableData(displayRows);
      setOverviewTableData(result.overviewTableData);
      setDataDisplayHeader(result.displayHeaders);
    } finally {
      stopLoading();
    }
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
  const onPressExportUnmappedRows = async (
    onProgress?: (done: number, total: number) => void
  ) => {
    await exportTableToExcel(
      tableHeader,
      unmappedRows,
      onProgress,
      "unmapped-rows.xlsx"
    );
    setIsWarningModalShown(false);
  };

  // --- Return ---

  return {
    onChangeGlHeader,
    onChangeCoaHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    applySuggestedName,
    onChartOfAccountsDrop,
    onPressResetBtn,
    setDataDisplayHeader,
    setIsWarningModalShown,
    onPressExportUnmappedRows,
    onDictionaryDrop,
    onPressBackBtn,
    dictionaryData,
    isDictionaryUploaded,
    hierarchyData,
    isHierarchyModalVisible,
    setIsHierarchyModalVisible,
    setHierarchyData,
    loadingStatus,
    fileProgress,
    error,
    overviewTableData,
    sortedDataDisplayHeader,
    currentStep,
    tableHeader,
    reversalTableHeader,
    tableData,
    displayTableData,
    rawData,
    glHeaderOptions,
    selectedHeaders,
    coaHeaderOptions,
    reviewData,
    dataDisplayHeader,
    isWarningModalShown,
  };
}
