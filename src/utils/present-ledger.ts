import { formatDate } from "date-fns";

function money(value: number) {
  return Number(value.toFixed(2)).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
}

function presentRow(
  row: Record<string, unknown>,
  valueKey: string,
  dateKey: string
) {
  const next: Record<string, unknown> = { ...row };
  const amount = Number(row[valueKey]);
  if (valueKey && Number.isFinite(amount)) next[valueKey] = money(amount);
  const date = row[dateKey];
  if (dateKey && date instanceof Date) {
    next[dateKey] = formatDate(date, "dd-MM-yyyy");
  }
  if (Array.isArray(next.result)) next.result = next.result.join("/");
  return next;
}

export async function presentLedgerRows(
  rows: Record<string, unknown>[],
  valueKey: string,
  dateKey: string,
  onProgress?: (done: number, total: number) => void
) {
  const display = new Array<Record<string, unknown>>(rows.length);
  for (let index = 0; index < rows.length; index += 1) {
    display[index] = presentRow(rows[index], valueKey, dateKey);
    if (index > 0 && index % 5000 === 0) {
      onProgress?.(index, rows.length);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  onProgress?.(rows.length, rows.length);
  return display;
}
