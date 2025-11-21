/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Workbook } from "exceljs";
import { formatDate } from "date-fns";
import { TableHeader } from "../../composed/basic-table/basic-table";
import { exportTableToExcel } from "../../composed/basic-table/functions";

// --- Interfaces and Enums ---

export interface RawData {
  glData: Record<string, any>[];
  glHeaders: string[];
  coaData: Record<string, any>[];
  coaHeaders: string[];
}

export interface GlHeaders {
  account: string;
  jen: string;
  date: string;
  value: string;
}

export interface CoaHeaders {
  mappingValue: string;
  displayValue: string;
  groupingValue: string;
}

export interface SelectedHeaders {
  glHeaders: GlHeaders;
  coaHeaders: CoaHeaders;
}

export interface ReviewData {
  startDate: string;
  endDate: string;
  rows: number;
  total: number;
}

export enum AnalysisStep {
  TO_UPLOAD_GL,
  UPLOADED_GL,
  TO_UPLOAD_COA,
  TO_ANALYZE,
  ANALYZED,
}

// --- Main Hook ---

export function useGeneralAnalysis() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isWarningModalShown, setIsWarningModalShown] = useState(false);

  const [currentStep, setCurrentStep] = useState<AnalysisStep[]>([AnalysisStep.TO_UPLOAD_GL]);
  const [rawData, setRawData] = useState<RawData>({
    glData: [],
    glHeaders: [],
    coaData: [],
    coaHeaders: [],
  });
  const [dataDisplayHeader, setDataDisplayHeader] = useState<Record<string, any>[]>([]);
  const [overviewTableData, setOverviewTableData] = useState<Record<string, any>>({});
  const [unmappedRows, setUnmappedRows] = useState<Record<string, any>[]>([]);
  const [isDictionaryUploaded, setIsDictionaryUploaded] = useState(false);
  const [dictionaryData, setDictionaryData] = useState<Record<string, any>[]>([]);
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [reversalTableData, setReversalTableData] = useState<Record<string, any>[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<SelectedHeaders>({
    glHeaders: { account: "", jen: "", date: "", value: "" },
    coaHeaders: { displayValue: "", mappingValue: "", groupingValue: "" },
  });
  const [loadingStatus, setLoadingStatus] = useState(false);

  // --- Memoized Values ---

  const reviewData: ReviewData = useMemo(() => {
    const countRows = rawData.glData.length;

    const total = selectedHeaders.glHeaders.value
      ? rawData.glData.reduce((sum, row) => {
        const val = Number(row[selectedHeaders.glHeaders.value]);
        return sum + (Number.isNaN(val) ? 0 : val);
      }, 0)
      : 0;

    const getDate = (fn: (...dates: number[]) => number) => {
      if (!selectedHeaders.glHeaders.date) return "";
      const times = rawData.glData
        .map(item => new Date(item[selectedHeaders.glHeaders.date]))
        .filter(date => !isNaN(date.getTime()))
        .map(date => date.getTime());
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
      rawData.glHeaders.map(item => ({
        value: item,
        title: item,
      })),
    [rawData]
  );

  const coaHeaderOptions = useMemo(
    () =>
      rawData.coaHeaders.map(item => ({
        value: item,
        title: item,
      })),
    [rawData]
  );

  const tableHeader: TableHeader[] = useMemo(
    () => [
      ...Object.keys(selectedHeaders.glHeaders).map(item => ({
        key: item,
        title: selectedHeaders.glHeaders[item as keyof GlHeaders],
      })),
      { key: "result", title: "result" },
    ],
    [selectedHeaders.glHeaders]
  );

  const reversalTableHeader: TableHeader[] = useMemo(
    () => [
      ...Object.keys(selectedHeaders.glHeaders).map(item => ({
        key: item,
        title: selectedHeaders.glHeaders[item as keyof GlHeaders],
      })),
      { key: "reversal", title: "reversal" },
    ],
    [selectedHeaders.glHeaders]
  );

  // --- File Drop Handlers ---

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

    worker.onmessage = e => {
      const { data, error } = e.data;
      if (error) {
        setError(error);
        setLoadingStatus(false);
        return;
      }
      setDictionaryData(data);

      worker.onerror = workerError => {
        setError(workerError.message);
        console.error("Worker error:", workerError);
        setLoadingStatus(false);
        worker.terminate();
      };

      setLoadingStatus(false);
      setIsDictionaryUploaded(true);
      worker.terminate();
    };
  };

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
    const worker = new Worker(new URL("./gl-worker.js", import.meta.url), { type: "module" });

    worker.postMessage({ buffer });

    worker.onmessage = e => {
      const { glData, glHeaders, error } = e.data;
      if (error) {
        setError(error);
        setLoadingStatus(false);
        return;
      }

      setRawData(prev => ({ ...prev, glData, glHeaders }));

      worker.onerror = workerError => {
        setError(workerError.message);
        console.error("Worker error:", workerError);
        setLoadingStatus(false);
        worker.terminate();
      };

      setCurrentStep(prev => [...prev, AnalysisStep.UPLOADED_GL]);
      setLoadingStatus(false);
      worker.terminate();
    };
  };

  const onChartOfAccountsDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const workbook = new Workbook();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];
    if (!sheet) return;

    const columnNames = (sheet.getRow(1).values as string[]).filter(Boolean);

    const rows = sheet
      .getSheetValues()
      .slice(2)
      .map((row: any) =>
        columnNames.reduce((acc, col, index) => {
          acc[col] = row[index]?.result ?? row[index] ?? "";
          return acc;
        }, {} as Record<string, any>)
      );

    setRawData(prev => ({
      ...prev,
      coaData: rows,
      coaHeaders: columnNames,
    }));

    setSelectedHeaders(prev => ({
      ...prev,
      coaHeaders: {
        displayValue: columnNames[0],
        mappingValue: columnNames[0],
        groupingValue: columnNames[0],
      },
    }));

    setCurrentStep(prev => [...prev, AnalysisStep.TO_ANALYZE]);
  };

  // --- Header Selection ---

  const onChangeGlHeader = (key: keyof GlHeaders, value: string) => {
    const newGlHeaders = { ...selectedHeaders.glHeaders, [key]: value };
    setSelectedHeaders(prev => ({ ...prev, glHeaders: newGlHeaders }));

    if (!Object.values(newGlHeaders).some(item => item === "")) {
      setCurrentStep(prev => [...prev, AnalysisStep.TO_UPLOAD_COA]);
    }
  };

  const onChangeCoaHeader = (key: keyof CoaHeaders, value: string) => {
    setSelectedHeaders(prev => ({
      ...prev,
      coaHeaders: { ...prev.coaHeaders, [key]: value },
    }));
  };

  // --- Reset Button ---

  const onPressResetBtn = () => {
    setCurrentStep([AnalysisStep.TO_UPLOAD_GL]);
    setTableData([]);
    setError(undefined);
    setDictionaryData([]);
    setIsDictionaryUploaded(false);
    setUnmappedRows([]);
    setIsWarningModalShown(false);
    setReversalTableData([]);
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

  const onPressAnalyzeData = () => {
    setLoadingStatus(true);

    // Reversal worker
    const reversalWorker = new Worker(
      new URL("../../../workers/reversal-worker.js", import.meta.url),
      { type: "module" }
    );

    reversalWorker.onmessage = event => {
      const notMappedRows = event.data.outputVal.filter((item: any) =>
        JSON.stringify(item).includes("not mapped")
      );
      if (notMappedRows.length > 0) {
        setUnmappedRows(notMappedRows);
        setIsWarningModalShown(true);
      }

      setReversalTableData(
        Object.values(event.data.outputVal as Record<string, any>[]).flat()
      );

      reversalWorker.terminate();
    };

    reversalWorker.onerror = error => {
      setError(error.message);
      console.error("Worker error:", error);
      setLoadingStatus(false);
      reversalWorker.terminate();
    };

    reversalWorker.postMessage({ rawData, selectedHeaders });

    // Main general worker
    const worker = new Worker(
      new URL("../../../workers/general-worker.js", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = event => {
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
      setCurrentStep(prev => [...prev, AnalysisStep.ANALYZED]);

      worker.terminate();

      if (event.data.tableData.find((item: any) => !item.coaData)) {
        setError("Some rows from GL do not have a CoA");
        setTimeout(() => setError(undefined), 4000);
      }
    };

    worker.onerror = error => {
      setError(error.message);
      console.error("Worker error:", error);
      setLoadingStatus(false);
      worker.terminate();
    };

    worker.postMessage({ rawData, selectedHeaders });

    setLoadingStatus(false);
  };

  // --- Data Display ---

  const sortedDataDisplayHeader = useMemo(() => {
    const mappingKey = selectedHeaders.coaHeaders.mappingValue;
    const active = dataDisplayHeader
      .filter(item => item.active)
      .sort((a, b) => a[mappingKey] - b[mappingKey]);
    const inactive = dataDisplayHeader
      .filter(item => !item.active)
      .sort((a, b) => a[mappingKey] - b[mappingKey]);
    return [
      ...active,
      { [mappingKey]: "total" },
      ...inactive,
    ];
  }, [dataDisplayHeader, selectedHeaders.coaHeaders.mappingValue]);

  // --- Export Handler ---

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
    dictionaryData,
    isDictionaryUploaded,
    reversalTableData,
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
