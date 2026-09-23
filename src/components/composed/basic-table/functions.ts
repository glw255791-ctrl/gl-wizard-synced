import { formatDate } from "date-fns";
import type { TableHeader } from "../../../types";
import saveAs from "file-saver";
import JSZip from "jszip";

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function columnName(index: number) {
  let name = "";
  let current = index + 1;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    current = Math.floor((current - 1) / 26);
  }
  return name;
}

function cellXml(column: number, row: number, value: unknown) {
  const ref = `${columnName(column)}${row}`;
  if (typeof value === "number" && Number.isFinite(value)) {
    return `<c r="${ref}"><v>${value}</v></c>`;
  }
  const text = value == null ? "" : String(value);
  return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(text)}</t></is></c>`;
}

/**
 * Exports the provided table data to an Excel (.xlsx) file.
 */
export const exportTableToExcel = async (
  header: TableHeader[],
  data: Record<string, string>[],
  onProgress?: (done: number, total: number) => void,
  fileName = "table_data.xlsx"
) => {
  const exportHeaders = Object.keys(data[0] || {}).filter((key) => key !== "coaData");
  const dateColumn = header.find((item) => item.key === "date")?.title;
  const total = data.length;
  onProgress?.(0, total);

  const rows: string[] = [
    `<row r="1">${exportHeaders
      .map((title, index) => cellXml(index, 1, title))
      .join("")}</row>`,
  ];

  for (let index = 0; index < data.length; index += 1) {
    const source = data[index];
    const cells = exportHeaders.map((column, columnIndex) => {
      const value = source[column];
      if (column === "result" && typeof value === "object") {
        return cellXml(columnIndex, index + 2, (value as string[]).join("/"));
      }
      if (column === dateColumn && value) {
        const dateText =
          value instanceof Date && !Number.isNaN(value.getTime())
            ? formatDate(value, "dd-MM-yyyy")
            : String(value);
        return cellXml(columnIndex, index + 2, dateText);
      }
      return cellXml(
        columnIndex,
        index + 2,
        typeof value === "object" ? "" : value
      );
    });
    rows.push(`<row r="${index + 2}">${cells.join("")}</row>`);

    if (index % 500 === 0) {
      onProgress?.(index + 1, total);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  onProgress?.(total, total);

  const lastColumn = columnName(Math.max(exportHeaders.length - 1, 0));
  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:${lastColumn}${Math.max(total + 1, 1)}"/>
  <sheetData>${rows.join("")}</sheetData>
</worksheet>`;

  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
  );
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
  );
  zip.file(
    "xl/workbook.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Unmapped" sheetId="1" r:id="rId1"/></sheets>
</workbook>`
  );
  zip.file(
    "xl/_rels/workbook.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`
  );
  zip.file("xl/worksheets/sheet1.xml", sheet);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, fileName);
};
