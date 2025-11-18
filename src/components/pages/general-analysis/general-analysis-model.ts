/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Workbook } from "exceljs";
import { formatDate } from "date-fns";
import { TableHeader } from "../../composed/basic-table/basic-table";

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

export function useGeneralAnalysis() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isWarningModalShown, setIsWarningModalShown] =
    useState<boolean>(false);

  const [currentStep, setCurrentStep] = useState<AnalysisStep[]>([
    AnalysisStep.TO_UPLOAD_GL,
  ]);
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

  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [reversalTableData, setReversalTableData] = useState<
    Record<string, any>[]
  >([]);
  const [selectedHeaders, setSelectedHeaders] = useState<SelectedHeaders>({
    glHeaders: {
      account: "",
      jen: "",
      date: "",
      value: "",
    },
    coaHeaders: {
      displayValue: "",
      mappingValue: "",
      groupingValue: "",
    },
  });

  const [loadingStatus, setLoadingStatus] = useState(false);

  const reviewData: ReviewData = useMemo(() => {
    return {
      rows: rawData.glData.length,
      total: selectedHeaders.glHeaders.value
        ? rawData.glData.reduce((prev, curr) => {
            const val = Number(curr[selectedHeaders.glHeaders.value]);
            return (prev += Number.isNaN(val) ? 0 : val);
          }, 0)
        : 0,
      startDate: selectedHeaders.glHeaders.date
        ? formatDate(
            new Date(
              Math.min(
                ...rawData.glData
                  .map((item) => new Date(item[selectedHeaders.glHeaders.date]))
                  .filter((date) => !isNaN(date.getTime()))
                  .map((date) => date.getTime())
              )
            ),
            "dd-MM-yyyy"
          )
        : "",
      endDate: selectedHeaders.glHeaders.date
        ? formatDate(
            new Date(
              Math.max(
                ...rawData.glData
                  .map((item) => new Date(item[selectedHeaders.glHeaders.date]))
                  .filter((date) => !isNaN(date.getTime()))
                  .map((date) => date.getTime())
              )
            ),
            "dd-MM-yyyy"
          )
        : "",
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
      {
        key: "result",
        title: "result",
      },
    ],
    [selectedHeaders.glHeaders]
  );

  const reversalTableHeader: TableHeader[] = useMemo(
    () => [
      ...Object.keys(selectedHeaders.glHeaders).map((item) => ({
        key: item,
        title: selectedHeaders.glHeaders[item as keyof GlHeaders],
      })),
      {
        key: "reversal",
        title: "reversal",
      },
    ],
    [selectedHeaders.glHeaders]
  );

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

      setRawData((prev) => ({
        ...prev,
        glData,
        glHeaders,
      }));

      worker.onerror = (error) => {
        console.error("Worker error:", error);
        setLoadingStatus(false);
        worker.terminate();
      };

      setCurrentStep((prev) => [...prev, AnalysisStep.UPLOADED_GL]);
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

    const sheet = workbook.worksheets[0]; // Get first sheet
    if (!sheet) return;

    // Get column names
    const columnNames: string[] = sheet.getRow(1).values as string[];

    // Read data
    const rows = sheet
      .getSheetValues()
      .slice(2) // Skip header row
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
    setCurrentStep((prev) => [...prev, AnalysisStep.TO_ANALYZE]);
  };

  const onChangeGlHeader = (key: keyof GlHeaders, value: string) => {
    const newValue = { ...selectedHeaders.glHeaders, [key]: value };
    setSelectedHeaders((prev) => ({
      ...prev,
      glHeaders: newValue,
    }));

    if (!Object.values(newValue).some((item) => item === "")) {
      setCurrentStep((prev) => [...prev, AnalysisStep.TO_UPLOAD_COA]);
    }
  };

  const onChangeCoaHeader = (key: keyof CoaHeaders, value: string) => {
    setSelectedHeaders((prev) => ({
      ...prev,
      coaHeaders: { ...prev.coaHeaders, [key]: value },
    }));
  };

  const onPressResetBtn = () => {
    setCurrentStep([AnalysisStep.TO_UPLOAD_GL]);
    setTableData([]);
    setRawData({
      coaData: [],
      coaHeaders: [],
      glData: [],
      glHeaders: [],
    });
    setSelectedHeaders({
      coaHeaders: {
        displayValue: "",
        mappingValue: "",
        groupingValue: "",
      },
      glHeaders: {
        account: "",
        date: "",
        jen: "",
        value: "",
      },
    });
  };

  const onPressAnalyzeData = () => {
    setLoadingStatus(true);

    const reversalWorker = new Worker(
      new URL("../../../workers/reversal-worker.js", import.meta.url),
      {
        type: "module",
      }
    );

    reversalWorker.onmessage = (event) => {
      if (
        event.data.outputVal.some((item: any) =>
          JSON.stringify(item).includes("not mapped")
        )
      )
        setIsWarningModalShown(true);

      setReversalTableData(
        Object.values(event.data.outputVal as Record<string, any>[]).flat()
      );

      reversalWorker.terminate();
    };

    reversalWorker.onerror = (error) => {
      console.error("Worker error:", error);
      setLoadingStatus(false);
      reversalWorker.terminate();
    };

    reversalWorker.postMessage({ rawData, selectedHeaders });

    const worker = new Worker(
      new URL("../../../workers/general-worker.js", import.meta.url),
      {
        type: "module",
      }
    );

    worker.onmessage = (event) => {
      if (
        event.data.tableData.some((item: any) =>
          JSON.stringify(item).includes("not mapped")
        )
      )
        setIsWarningModalShown(true);
      setTableData(event.data.tableData);
      setOverviewTableData(event.data.overviewTableData);
      setDataDisplayHeader(event.data.displayHeaders);
      setCurrentStep((prev) => [...prev, AnalysisStep.ANALYZED]);

      worker.terminate();

      if (event.data.tableData.find((item: any) => !item.coaData)) {
        setError("Some rows from GL do not have a CoA");
        setTimeout(() => setError(undefined), 4000);
      }
    };

    worker.onerror = (error) => {
      console.error("Worker error:", error);
      setLoadingStatus(false);
      worker.terminate();
    };

    worker.postMessage({ rawData, selectedHeaders });

    setLoadingStatus(false);
  };

  const sortedDataDisplayHeader = useMemo(() => {
    const active = dataDisplayHeader
      .filter((item) => item.active)
      .sort(
        (a, b) =>
          a[selectedHeaders.coaHeaders.mappingValue] -
          b[selectedHeaders.coaHeaders.mappingValue]
      );

    const inactive = dataDisplayHeader
      .filter((item) => !item.active)
      .sort(
        (a, b) =>
          a[selectedHeaders.coaHeaders.mappingValue] -
          b[selectedHeaders.coaHeaders.mappingValue]
      );
    return [
      ...active,
      { [selectedHeaders.coaHeaders.mappingValue]: "total" },
      ...inactive,
    ];
  }, [dataDisplayHeader, selectedHeaders.coaHeaders.mappingValue]);

  return {
    onChangeGlHeader,
    onChangeCoaHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressResetBtn,
    setDataDisplayHeader,
    setIsWarningModalShown,
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
