import { theme } from "@/constants/theme";

type Row = Record<string, any>;

const ZERO = "0,00";

function money(value: number) {
  if (value === 0) return ZERO;
  return Number(value.toFixed(2)).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
}

function isZero(value: number) {
  return Math.abs(value) < 0.005;
}

type Built = { columns: string[]; rows: Row[] };

const cache = new WeakMap<object, Map<string, { headers: Row[]; result: Built }>>();

export function buildMovementTable({
  sortedDataDisplayHeader,
  overviewTableData,
  groupingValue,
  valueKey,
  selectedFilter,
}: {
  sortedDataDisplayHeader: Row[];
  overviewTableData: Record<string, Row[]>;
  groupingValue: string;
  valueKey: string;
  selectedFilter: { header: string };
}) {
  const showAll = selectedFilter.header === "all";
  const cacheKey = `${groupingValue}\0${selectedFilter.header}\0${valueKey}`;
  let bucket = cache.get(overviewTableData);
  const cached = bucket?.get(cacheKey);
  if (cached && cached.headers === sortedDataDisplayHeader) return cached.result;

  const result = build({
    sortedDataDisplayHeader,
    overviewTableData,
    groupingValue,
    valueKey,
    showAll,
  });

  if (!bucket) {
    bucket = new Map();
    cache.set(overviewTableData, bucket);
  }
  bucket.set(cacheKey, { headers: sortedDataDisplayHeader, result });
  return result;
}

function build({
  sortedDataDisplayHeader,
  overviewTableData,
  groupingValue,
  valueKey,
  showAll,
}: {
  sortedDataDisplayHeader: Row[];
  overviewTableData: Record<string, Row[]>;
  groupingValue: string;
  valueKey: string;
  showAll: boolean;
}): Built {
  if (!sortedDataDisplayHeader[0]) {
    return { columns: ["sideHeader"], rows: [] };
  }

  const rowSums = new Map<string, Map<string, number>>();
  const columnTotals = new Map<string, number>();
  const columnHasMovement = new Set<string>();

  for (const [rowKey, entries] of Object.entries(overviewTableData)) {
    const sums = new Map<string, number>();
    for (const entry of entries) {
      const column = entry.coaData?.[groupingValue];
      if (column == null || column === "") continue;
      const amount = Number(entry[valueKey]);
      if (!Number.isFinite(amount)) continue;
      const key = String(column);
      sums.set(key, (sums.get(key) ?? 0) + amount);
      columnTotals.set(key, (columnTotals.get(key) ?? 0) + amount);
      if (!isZero(amount)) columnHasMovement.add(key);
    }
    rowSums.set(rowKey, sums);
  }

  const seen = new Set<string>();
  const displayColumns: { key: string; index: number }[] = [];
  sortedDataDisplayHeader.forEach((header, index) => {
    const key = String(header[groupingValue] ?? "");
    if (!key || seen.has(key)) return;
    if (showAll && !columnHasMovement.has(key)) return;
    seen.add(key);
    displayColumns.push({ key, index });
  });

  const headerKeys = Object.keys(sortedDataDisplayHeader[0]);
  const headerRows = headerKeys.map((headerKey) => {
    const headerCells: Record<string, unknown> = {};
    for (const column of displayColumns) {
      headerCells[column.key] = sortedDataDisplayHeader[column.index][headerKey];
    }
    return {
      sideHeader: headerKey === "active" ? "Include" : headerKey,
      ...headerCells,
      total: "",
      bg: theme.colors.lighter,
      header: true,
    };
  });

  const activeColumns = [
    ...new Set(
      sortedDataDisplayHeader
        .filter((header) => header.active)
        .map((header) => String(header[groupingValue]))
    ),
  ];

  const dataRows: Row[] = [];
  for (const rowKey of Object.keys(overviewTableData)) {
    const sums = rowSums.get(rowKey) ?? new Map<string, number>();
    if (showAll && displayColumns.every((column) => isZero(sums.get(column.key) ?? 0))) {
      continue;
    }
    const valueCells: Record<string, string> = {};
    for (const column of displayColumns) {
      valueCells[column.key] = money(sums.get(column.key) ?? 0);
    }
    const total = activeColumns.reduce(
      (sum, column) => sum + (sums.get(column) ?? 0),
      0
    );
    dataRows.push({
      sideHeader: rowKey,
      ...valueCells,
      total: money(total),
      bg: "white",
      header: false,
    });
  }

  const totalCells: Record<string, string> = {};
  for (const column of displayColumns) {
    totalCells[column.key] = money(columnTotals.get(column.key) ?? 0);
  }
  const grandTotal = activeColumns.reduce(
    (sum, column) => sum + (columnTotals.get(column) ?? 0),
    0
  );

  const rows = [
    ...headerRows.filter(
      (row) =>
        showAll || row.sideHeader === "Include" || row.sideHeader === groupingValue
    ),
    ...dataRows,
    {
      sideHeader: "Total",
      ...totalCells,
      total: money(grandTotal),
      bg: theme.colors.lighter,
      header: true,
    },
  ];

  return {
    columns: ["sideHeader", ...displayColumns.map((column) => column.key)],
    rows,
  };
}
