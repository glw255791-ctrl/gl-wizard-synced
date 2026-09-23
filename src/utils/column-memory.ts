import { CoaHeaders, GlHeaders } from "@/types";

const STORAGE_KEY = "gl-wizard-column-map";

type SavedMap = {
  gl?: Partial<GlHeaders>;
  coa?: Partial<CoaHeaders>;
};

const glFallbacks: GlHeaders = {
  account: "Account code",
  jen: "ref",
  date: "datnal",
  value: "Saldo",
};

const coaFallbacks: CoaHeaders = {
  mappingValue: "Account code",
  displayValue: "FS sub-group",
  groupingValue: "FS group",
};

function readMap(): SavedMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedMap) : {};
  } catch {
    return {};
  }
}

function writeMap(next: SavedMap) {
  const current = readMap();
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...current, ...next })
  );
}

function pick(headers: string[], saved: string | undefined, fallback: string) {
  if (saved && headers.includes(saved)) return saved;
  if (headers.includes(fallback)) return fallback;
  return "";
}

export function recallGlHeaders(headers: string[]): GlHeaders {
  const saved = readMap().gl ?? {};
  return {
    account: pick(headers, saved.account, glFallbacks.account),
    jen: pick(headers, saved.jen, glFallbacks.jen),
    date: pick(headers, saved.date, glFallbacks.date),
    value: pick(headers, saved.value, glFallbacks.value),
  };
}

export function recallCoaHeaders(headers: string[]): CoaHeaders {
  const saved = readMap().coa ?? {};
  const mappingValue = pick(headers, saved.mappingValue, coaFallbacks.mappingValue);
  return {
    mappingValue: mappingValue || headers[0] || "",
    displayValue:
      pick(headers, saved.displayValue, coaFallbacks.displayValue) ||
      headers[0] ||
      "",
    groupingValue:
      pick(headers, saved.groupingValue, coaFallbacks.groupingValue) ||
      headers[0] ||
      "",
  };
}

export function rememberGlHeaders(headers: GlHeaders) {
  writeMap({ gl: headers });
}

export function rememberCoaHeaders(headers: CoaHeaders) {
  writeMap({ coa: headers });
}
