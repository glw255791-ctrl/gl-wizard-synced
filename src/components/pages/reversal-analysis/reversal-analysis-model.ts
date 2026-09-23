/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { format as formatDate } from "date-fns";
import { saveAs } from "file-saver";
import { TableHeader } from "../../composed/basic-table/basic-table";
import { exportTableToExcel } from "../../composed/basic-table/functions";
import { createWorkbook, readFirstSheet } from "../../../utils/workbook";
import { dictionaryFromRows } from "../../../utils/dictionary";
import {
  readFileWithProgress,
  type FileReadProgress,
} from "../../../utils/read-file";
import {
  RawData,
  GlHeaders,
  CoaHeaders,
  SelectedHeaders,
  ReviewData,
  AnalysisStep,
} from "../../../types";

// Re-export types for backward compatibility
export type {
  RawData,
  GlHeaders,
  CoaHeaders,
  SelectedHeaders,
  ReviewData,
};
export { AnalysisStep };

export function useReversalAnalysis() {
  // States
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(
    AnalysisStep.TO_UPLOAD_GL
  );
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

  const [isDictionaryUploaded, setIsDictionaryUploaded] = useState(false);
  const [dictionaryData, setDictionaryData] = useState<Record<string, any>[]>(
    []
  );
  const [dataDisplayHeader, setDataDisplayHeader] = useState<
    Record<string, any>[]
  >([]);
  const [overviewTableData, setOverviewTableData] = useState<
    Record<string, any>
  >({});
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
      const times = rawData.glData
        .map((item) => new Date(item[dateKey]).getTime())
        .filter((time) => !Number.isNaN(time));
      if (!times.length) return "";
      const bound = times.reduce((best, time) => fn(best, time));
      return formatDate(new Date(bound), "dd-MM-yyyy");
    };

    return {
      rows,
      total,
      startDate: getDateBoundary(Math.min),
      endDate: getDateBoundary(Math.max),
    };
  }, [rawData, selectedHeaders]);

  const glHeaderOptions = useMemo(
    () => rawData.glHeaders.map((item) => ({ value: item, title: item })),
    [rawData]
  );

  const coaHeaderOptions = useMemo(
    () => rawData.coaHeaders.map((item) => ({ value: item, title: item })),
    [rawData]
  );

  const tableHeader: TableHeader[] = useMemo(
    () => [
      ...Object.keys(selectedHeaders.glHeaders).map((key) => ({
        key,
        title: selectedHeaders.glHeaders[key as keyof GlHeaders],
      })),
      { key: "result", title: "result" },
      { key: "reversal", title: "reversal" },
    ],
    [selectedHeaders.glHeaders]
  );

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
          displayValue: headers[0],
          mappingValue: headers[0],
          groupingValue: "",
        },
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

  const onChangeGlHeader = (key: keyof GlHeaders, value: string) => {
    const updatedGlHeaders = { ...selectedHeaders.glHeaders, [key]: value };
    setSelectedHeaders((prev) => ({
      ...prev,
      glHeaders: updatedGlHeaders,
    }));

    if (Object.values(updatedGlHeaders).every((val) => val !== "")) {
      setCurrentStep(AnalysisStep.TO_UPLOAD_COA);
    }
  };

  const onChangeCoaHeader = (key: keyof CoaHeaders, value: string) => {
    setSelectedHeaders((prev) => ({
      ...prev,
      coaHeaders: { ...prev.coaHeaders, [key]: value },
    }));
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

        case AnalysisStep.UPLOADED_DICTIONARY:
          setDictionaryData([]);
          setIsDictionaryUploaded(false);
          return AnalysisStep.TO_UPLOAD_DICTIONARY;

        default:
          return prev;
      }
    });
  };

  const onPressResetBtn = () => {
    setCurrentStep(AnalysisStep.TO_UPLOAD_GL);
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

    const workerUrl = new URL(
      "../../../workers/reversal-worker.js",
      import.meta.url
    );
    const worker = new Worker(workerUrl, { type: "module" });

    worker.onmessage = (event) => {
      const { outputVal, groupedByJenAndDate, condensedDataByResult } =
        event.data;
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
      setCurrentStep(AnalysisStep.ANALYZED);
      stopLoading();
      worker.terminate();
    };

    worker.onerror = (error) => {
      setError(error.message);
      console.error("Worker error:", error);
      stopLoading();
      worker.terminate();
    };

    worker.postMessage({ rawData, selectedHeaders, dictionaryData });
  };

  const generateOverviewData = (data: any[]) => {
    const mappingKey = selectedHeaders.coaHeaders.mappingValue;

    const existingCoaKeys = [
      ...new Set(data.map((item) => item.coaData?.[mappingKey])),
    ];

    const filteredCoaData = rawData.coaData
      .filter((item) => existingCoaKeys.includes(item[mappingKey]))
      .map((item) => ({ ...item, active: true }));

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

    const workbook = await createWorkbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Extract headers from object keys
    const headers = Object.keys(dataForExport[0]);

    // Define worksheet columns with widths
    worksheet.columns = headers.map((header) => ({
      header,
      key: header,
      width: 20,
    }));

    // Style header row
    worksheet.getRow(0).eachCell((cell) => {
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
      const row = headers.map((header) => {
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
      arr.sort((a, b) => {
        const aVal = a[mappingKey];
        const bVal = b[mappingKey];
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      });

    const active = sorted(dataDisplayHeader.filter((item) => item.active));
    const inactive = sorted(dataDisplayHeader.filter((item) => !item.active));

    return [...active, { [mappingKey]: "total" }, ...inactive];
  }, [dataDisplayHeader, selectedHeaders.coaHeaders.mappingValue]);

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
    fileProgress,
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
    onPressBackBtn,
  };
}
