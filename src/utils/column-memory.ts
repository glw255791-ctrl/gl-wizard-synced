import { CoaHeaders, GlHeaders } from "@/types";

const STORAGE_KEY = "gl-wizard-column-map";

type SavedMap = {
  gl?: Partial<GlHeaders>;
  coa?: Partial<CoaHeaders>;
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

/** Leave column selects empty until the user picks them or applies a suggestion. */
export function recallGlHeaders(_headers: string[]): GlHeaders {
  return { account: "", jen: "", date: "", value: "" };
}

export function recallCoaHeaders(_headers: string[]): CoaHeaders {
  return { mappingValue: "", displayValue: "", groupingValue: "" };
}

export function rememberGlHeaders(headers: GlHeaders) {
  writeMap({ gl: headers });
}

export function rememberCoaHeaders(headers: CoaHeaders) {
  writeMap({ coa: headers });
}
