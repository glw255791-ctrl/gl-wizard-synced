import JSZip from "jszip";
import pako from "pako";

const BUILTIN_DATE_FORMATS = new Set([
  14, 15, 16, 17, 18, 19, 20, 21, 22, 27, 30, 36, 45, 46, 47, 50, 57,
]);

function decodeXml(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function columnIndex(cellRef: string) {
  let index = 0;
  for (const char of cellRef) {
    const code = char.charCodeAt(0);
    if (code < 65 || code > 90) break;
    index = index * 26 + (code - 64);
  }
  return index;
}

function excelDate(serial: number) {
  const whole = Math.floor(serial);
  const fraction = serial - whole;
  const date = new Date(1899, 11, 30);
  date.setDate(date.getDate() + whole);
  if (fraction) {
    date.setMilliseconds(date.getMilliseconds() + Math.round(fraction * 86400000));
  }
  return date;
}

function isDateFormat(format: string) {
  const code = format.replace(/"[^"]*"/g, "").toLowerCase();
  return /[dy]/.test(code) && code.includes("m");
}

function dateStyleIndexes(stylesXml: string) {
  const formats = new Map<number, string>();
  const formatPattern = /<numFmt\b[^>]*numFmtId="(\d+)"[^>]*formatCode="([^"]*)"/g;
  for (const match of stylesXml.matchAll(formatPattern)) {
    formats.set(Number(match[1]), match[2]);
  }

  const cellXfs = stylesXml.match(/<cellXfs\b[^>]*>([\s\S]*?)<\/cellXfs>/)?.[1] ?? "";
  const indexes = new Set<number>();
  let index = 0;
  for (const match of cellXfs.matchAll(/<xf\b[^>]*numFmtId="(\d+)"/g)) {
    const formatId = Number(match[1]);
    const format = formats.get(formatId) ?? "";
    if (BUILTIN_DATE_FORMATS.has(formatId) || isDateFormat(format)) {
      indexes.add(index);
    }
    index += 1;
  }
  return indexes;
}

function sharedStrings(xml: string) {
  const values: string[] = [];
  for (const item of xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)) {
    const text = [...item[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)]
      .map((part) => decodeXml(part[1]))
      .join("");
    values.push(text);
  }
  return values;
}

function readCells(
  inner: string,
  strings: string[],
  dateStyles: Set<number>,
  values: unknown[]
) {
  let cursor = 0;
  let nextColumn = 1;
  while (cursor < inner.length) {
    const start = inner.indexOf("<c", cursor);
    if (start < 0) break;
    const marker = inner[start + 2];
    if (marker !== " " && marker !== ">" && marker !== "/") {
      cursor = start + 2;
      continue;
    }
    const openEnd = inner.indexOf(">", start);
    if (openEnd < 0) break;
    const selfClosing = inner[openEnd - 1] === "/";
    const attrs = inner.slice(start + 2, selfClosing ? openEnd - 1 : openEnd);
    let content = "";
    if (selfClosing) {
      cursor = openEnd + 1;
    } else {
      const close = inner.indexOf("</c>", openEnd);
      if (close < 0) break;
      content = inner.slice(openEnd + 1, close);
      cursor = close + 4;
    }
    const refStart = attrs.indexOf('r="');
    const column =
      refStart < 0
        ? nextColumn
        : columnIndex(attrs.slice(refStart + 3, attrs.indexOf('"', refStart + 3)));
    nextColumn = column + 1;
    values[column] = cellValue(attrs, content, strings, dateStyles);
  }
}

function attr(source: string, name: string) {
  const key = `${name}="`;
  const start = source.indexOf(key);
  if (start < 0) return "";
  const valueStart = start + key.length;
  const end = source.indexOf('"', valueStart);
  return end < 0 ? "" : source.slice(valueStart, end);
}

function tagText(source: string, tag: string) {
  const open = `<${tag}>`;
  const start = source.indexOf(open);
  if (start < 0) return null;
  const valueStart = start + open.length;
  const end = source.indexOf(`</${tag}>`, valueStart);
  return end < 0 ? null : source.slice(valueStart, end);
}

type ZipEntry = {
  _data?: {
    compression?: { magic: string };
    compressedContent?: Uint8Array | number[] | string;
  };
};

function asBytes(content: Uint8Array | number[] | string) {
  if (content instanceof Uint8Array) return content;
  if (typeof content === "string") {
    const bytes = new Uint8Array(content.length);
    for (let index = 0; index < content.length; index += 1) {
      bytes[index] = content.charCodeAt(index) & 255;
    }
    return bytes;
  }
  return Uint8Array.from(content);
}

function entryText(zip: JSZip, path: string) {
  const entry = zip.file(path) as ZipEntry | null;
  const packed = entry?._data?.compressedContent;
  if (!packed) return null;
  const bytes = asBytes(packed);
  const inflated =
    entry?._data?.compression?.magic === "\x00\x00" ? bytes : pako.inflateRaw(bytes);
  return new TextDecoder().decode(inflated);
}

function cellValue(
  attrs: string,
  inner: string,
  strings: string[],
  dateStyles: Set<number>
) {
  const type = attr(attrs, "t");
  const style = Number(attr(attrs, "s") || -1);
  const raw = tagText(inner, "v");

  if (type === "s") {
    return strings[Number(raw)] ?? "";
  }
  if (type === "inlineStr") {
    return decodeXml(inner.match(/<t\b[^>]*>([\s\S]*?)<\/t>/)?.[1] ?? "");
  }
  if (type === "b") return raw === "1";
  if (type === "str") return raw ? decodeXml(raw) : "";
  if (raw == null || raw === "") return "";

  const number = Number(raw);
  if (!Number.isNaN(number) && dateStyles.has(style)) return excelDate(number);
  if (!Number.isNaN(number) && type !== "str") return number;
  return decodeXml(raw);
}

export async function readXlsxSheet(
  buffer: ArrayBuffer,
  onProgress?: (done: number, total: number) => void
) {
  const zip = await JSZip.loadAsync(buffer);
  const workbookXml = entryText(zip, "xl/workbook.xml");
  const relsXml = entryText(zip, "xl/_rels/workbook.xml.rels");
  if (!workbookXml || !relsXml) {
    throw new Error("That file is not a readable .xlsx workbook.");
  }

  const sheetId = workbookXml.match(/<sheet\b[^>]*r:id="([^"]+)"/)?.[1];
  const relationship = [...relsXml.matchAll(/<Relationship\b([^>]*)\/?>/g)].find(
    (match) => match[1].includes(`Id="${sheetId}"`)
  );
  const target = relationship?.[1].match(/Target="([^"]+)"/)?.[1];
  const sheetPath = target
    ? `xl/${target.replace(/^\//, "").replace(/^xl\//, "")}`
    : "xl/worksheets/sheet1.xml";
  const sheetXml = entryText(zip, sheetPath);
  if (!sheetXml) {
    throw new Error("No sheet found in that file.");
  }

  const stylesXml = entryText(zip, "xl/styles.xml");
  const stringsXml = entryText(zip, "xl/sharedStrings.xml");
  const dateStyles = stylesXml ? dateStyleIndexes(stylesXml) : new Set<number>();
  const strings = stringsXml ? sharedStrings(stringsXml) : [];

  const dimension = sheetXml.match(
    /<dimension\b[^>]*ref="[A-Z]+\d+:[A-Z]+(\d+)"/
  );
  const totalRows = dimension ? Number(dimension[1]) : 0;
  const rows: Record<string, unknown>[] = [];
  let headers: string[] = [];
  let rowNumber = 0;
  let cursor = 0;

  while (cursor < sheetXml.length) {
    const rowStart = sheetXml.indexOf("<row", cursor);
    if (rowStart < 0) break;
    const marker = sheetXml[rowStart + 4];
    if (marker !== " " && marker !== ">") {
      cursor = rowStart + 4;
      continue;
    }
    const openEnd = sheetXml.indexOf(">", rowStart);
    if (openEnd < 0) break;
    if (sheetXml[openEnd - 1] === "/") {
      cursor = openEnd + 1;
      continue;
    }
    const rowEnd = sheetXml.indexOf("</row>", openEnd);
    if (rowEnd < 0) break;
    const values: unknown[] = [];
    readCells(sheetXml.slice(openEnd + 1, rowEnd), strings, dateStyles, values);
    cursor = rowEnd + 6;
    rowNumber += 1;

    if (rowNumber === 1) {
      headers = values.map((value) => (value == null ? "" : String(value)));
    } else if (values.length) {
      const record: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        if (!header) return;
        record[header] = values[index] ?? "";
      });
      rows.push(record);
    }

    if (onProgress && rowNumber % 4000 === 0) {
      onProgress(rowNumber, totalRows || rowNumber);
    }
  }

  const headerNames = headers.filter(Boolean);
  if (!headerNames.length) {
    throw new Error("No column names found in the first row.");
  }
  onProgress?.(totalRows || rowNumber, totalRows || rowNumber);
  return { rows, headers: headerNames };
}
