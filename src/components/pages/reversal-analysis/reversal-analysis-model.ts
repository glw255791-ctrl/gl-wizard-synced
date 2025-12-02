/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Workbook } from "exceljs";
import { format as formatDate } from "date-fns";
import { saveAs } from "file-saver";
import { TableHeader } from "../../composed/basic-table/basic-table";
import { exportTableToExcel } from "../../composed/basic-table/functions";

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

export function useReversalAnalysis() {
  // States
  const [currentStep, setCurrentStep] = useState<AnalysisStep[]>([AnalysisStep.TO_UPLOAD_GL]);
  const [rawData, setRawData] = useState<RawData>({
    glData: [],
    glHeaders: [],
    coaData: [],
    coaHeaders: [],
  });
  const [error, setError] = useState<string | undefined>();
  const [unmappedRows, setUnmappedRows] = useState<Record<string, any>[]>([]);
  const [isWarningModalShown, setIsWarningModalShown] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [isDictionaryUploaded, setIsDictionaryUploaded] = useState(false);
  const [dictionaryData, setDictionaryData] = useState<Record<string, any>[]>([]);
  const [dataDisplayHeader, setDataDisplayHeader] = useState<Record<string, any>[]>([]);
  const [overviewTableData, setOverviewTableData] = useState<Record<string, any>>({});
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);

  const [selectedHeaders, setSelectedHeaders] = useState<SelectedHeaders>({
    glHeaders: { account: "", jen: "", date: "", value: "" },
    coaHeaders: { displayValue: "", mappingValue: "", groupingValue: "" },
  });

  // Memoized options and derived state
  const reviewData: ReviewData = useMemo(() => {
    const { date: dateKey, value: valueKey } = selectedHeaders.glHeaders;

    // Compute totals, start/end dates
    const rows = rawData.glData.length;
    const total = valueKey
      ? rawData.glData.reduce((prev, cur) => prev + Number(cur[valueKey]), 0)
      : 0;

    const getDateBoundary = (fn: typeof Math.min | typeof Math.max) => {
      if (!dateKey) return "";
      const times = rawData.glData.map(item => new Date(item[dateKey]).getTime());
      if (!times.length) return "";
      return formatDate(new Date(fn(...times)), "dd-MM-yyyy");
    };

    return {
      rows,
      total,
      startDate: getDateBoundary(Math.min),
      endDate: getDateBoundary(Math.max),
    };
  }, [rawData, selectedHeaders]);

  const glHeaderOptions = useMemo(
    () => rawData.glHeaders.map(item => ({ value: item, title: item })),
    [rawData]
  );

  const coaHeaderOptions = useMemo(
    () => rawData.coaHeaders.map(item => ({ value: item, title: item })),
    [rawData]
  );

  const tableHeader: TableHeader[] = useMemo(() => [
    ...Object.keys(selectedHeaders.glHeaders).map((key) => ({
      key,
      title: selectedHeaders.glHeaders[key as keyof GlHeaders],
    })),
    { key: "result", title: "result" },
    { key: "reversal", title: "reversal" },
  ], [selectedHeaders.glHeaders]);

  // Handlers

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
    const workerUrl = new URL("../../../workers/dictionary-worker.js", import.meta.url);
    const worker = new Worker(workerUrl, { type: "module" });

    worker.postMessage({ buffer });

    worker.onmessage = (e) => {
      const { data, error } = e.data;

      if (error) {
        setError(error);
        setLoadingStatus(false);
        return;
      }

      setDictionaryData(data);
      setLoadingStatus(false);
      setIsDictionaryUploaded(true);
      worker.terminate();
    };

    worker.onerror = (error) => {
      setError(error.message);
      console.error("Worker error:", error);
      setLoadingStatus(false);
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

    // Get first row for column names, cast as string[]
    const columnNames: string[] = sheet.getRow(1).values as string[];

    // Skip header row, parse data into records
    const rows = sheet
      .getSheetValues()
      .slice(2)
      .map((row: any) =>
        columnNames.reduce((acc, col, i) => {
          acc[col] = row[i]?.result ?? row[i] ?? "";
          return acc;
        }, {} as Record<string, any>)
      );

    setRawData(prev => ({
      ...prev,
      coaData: rows,
      coaHeaders: columnNames.filter(Boolean),
    }));

    setSelectedHeaders(prev => ({
      ...prev,
      coaHeaders: {
        displayValue: columnNames.filter(Boolean)[0],
        mappingValue: columnNames.filter(Boolean)[0],
        groupingValue: "",
      },
    }));

    setCurrentStep(prev => [...prev, AnalysisStep.TO_ANALYZE]);
  };

  const onChangeGlHeader = (key: keyof GlHeaders, value: string) => {
    const updatedGlHeaders = { ...selectedHeaders.glHeaders, [key]: value };
    setSelectedHeaders(prev => ({
      ...prev,
      glHeaders: updatedGlHeaders,
    }));

    if (Object.values(updatedGlHeaders).every(val => val !== "")) {
      setCurrentStep(prev => [...prev, AnalysisStep.TO_UPLOAD_COA]);
    }
  };

  const onChangeCoaHeader = (key: keyof CoaHeaders, value: string) => {
    setSelectedHeaders(prev => ({
      ...prev,
      coaHeaders: { ...prev.coaHeaders, [key]: value },
    }));
  };

  const onPressResetBtn = () => {
    setCurrentStep([AnalysisStep.TO_UPLOAD_GL]);
    setTableData([]);
    setError(undefined);
    setUnmappedRows([]);
    setIsWarningModalShown(false);
    setDataDisplayHeader([]);
    setOverviewTableData({});
    setDictionaryData([]);
    setIsDictionaryUploaded(false);
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

  const onPressAnalyzeData = () => {
    setLoadingStatus(true);

    const workerUrl = new URL("../../../workers/reversal-worker.js", import.meta.url);
    const worker = new Worker(workerUrl, { type: "module" });

    worker.onmessage = (event) => {
      const { outputVal, groupedByJenAndDate, condensedDataByResult } = event.data;
      const notMappedRows = outputVal.filter((item: any) =>
        JSON.stringify(item).includes("not mapped")
      );

      if (notMappedRows.length > 0) {
        setUnmappedRows(notMappedRows);
        setIsWarningModalShown(true);
      }

      generateOverviewData(Object.values(groupedByJenAndDate).flat());
      setTableData(Object.values(outputVal as Record<string, any>[]).flat());
      setOverviewTableData(condensedDataByResult);
      setCurrentStep(prev => [...prev, AnalysisStep.ANALYZED]);
      setLoadingStatus(false);
      worker.terminate();
    };

    worker.onerror = (error) => {
      setError(error.message);
      console.error("Worker error:", error);
      setLoadingStatus(false);
      worker.terminate();
    };

    worker.postMessage({ rawData, selectedHeaders,dictionaryData });
  };

  const generateOverviewData = (data: any[]) => {
    const mappingKey = selectedHeaders.coaHeaders.mappingValue;

    const existingCoaKeys = [
      ...new Set(
        data.map(item => item.coaData?.[mappingKey])
      ),
    ];

    const filteredCoaData = rawData.coaData
      .filter(item => existingCoaKeys.includes(item[mappingKey]))
      .map(item => ({ ...item, active: true }));

    setDataDisplayHeader(filteredCoaData);
  };

  const onPressDownloadData = async () => {
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

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Extract headers from object keys
    const headers = Object.keys(dataForExport[0]);

    // Define worksheet columns with widths
    worksheet.columns = headers.map(header => ({
      header,
      key: header,
      width: 20,
    }));

    // Style header row
    worksheet.getRow(0).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D3D3D3" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Add and style data rows
    dataForExport.forEach((obj: Record<string, any>) => {
      const row = headers.map(header => {
        const value = obj[header];
        // Avoid scientific notation for big numbers
        return typeof value === "number" && value > 999_999
          ? `${value}`
          : value;
      });

      const rowInstance = worksheet.addRow(row);

      // Highlight final columns (result, reversal)
      rowInstance.getCell(headers.length).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF99" },
      };
      rowInstance.getCell(headers.length - 1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF99" },
      };
    });

    // Download as XLSX
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "newFile.xlsx");
  };

  // Derived: sorted display headers (active first, then total, then inactive)
  const sortedDataDisplayHeader = useMemo(() => {
    const mappingKey = selectedHeaders.coaHeaders.mappingValue;

    const sorted = (arr: Record<string, any>[]) =>
      arr.sort(
        (a, b) => {
          const aVal = a[mappingKey];
          const bVal = b[mappingKey];
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
      );

    const active = sorted(dataDisplayHeader.filter(item => item.active));
    const inactive = sorted(dataDisplayHeader.filter(item => !item.active));

    return [
      ...active,
      { [mappingKey]: "total" },
      ...inactive,
    ];
  }, [dataDisplayHeader, selectedHeaders.coaHeaders.mappingValue]);

  const onPressExportUnmappedRows = () => {
    exportTableToExcel(tableHeader, unmappedRows);
  };

  // Expose handlers and state
  return {
    onChangeGlHeader,
    onChangeCoaHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressDownloadData,
    onPressResetBtn,
    setDataDisplayHeader,
    onPressExportUnmappedRows,
    onDictionaryDrop,
    dictionaryData,
    isDictionaryUploaded,
    overviewTableData,
    sortedDataDisplayHeader,
    loadingStatus,
    error,
    currentStep,
    tableHeader,
    tableData,
    rawData,
    glHeaderOptions,
    selectedHeaders,
    coaHeaderOptions,
    reviewData,
    isWarningModalShown,
    setIsWarningModalShown,
  };
}
