type Row = Record<string, any>;

type Headers = {
  glHeaders: { account: string; jen: string; date: string; value: string };
  coaHeaders: { mappingValue: string; displayValue: string; groupingValue: string };
};

function yieldThread() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function prefixes(rows: Row[], valueKey: string, add: (sum: number, value: unknown) => number) {
  const prefix = new Array<number>(rows.length + 1);
  prefix[0] = 0;
  for (let index = 0; index < rows.length; index += 1) {
    prefix[index + 1] = add(prefix[index], rows[index][valueKey]);
  }
  return prefix;
}

function nextEqualPrefix(prefix: number[]) {
  const next = new Array<number>(prefix.length).fill(-1);
  const seen = new Map<number, number>();
  for (let index = prefix.length - 1; index >= 0; index -= 1) {
    const later = seen.get(prefix[index]);
    if (later !== undefined) next[index] = later;
    seen.set(prefix[index], index);
  }
  return next;
}

function buildPrefixIndex(coaData: Row[], mappingKey: string) {
  const root = { item: null as Row | null, children: new Map<string, any>() };
  for (const item of coaData) {
    const code = String(item[mappingKey] ?? "");
    if (!code) continue;
    let node = root;
    for (let index = 0; index < code.length; index += 1) {
      const char = code[index];
      let next = node.children.get(char);
      if (!next) {
        next = { item: null, children: new Map() };
        node.children.set(char, next);
      }
      node = next;
    }
    node.item = item;
  }
  return root;
}

function matchAccount(root: { item: Row | null; children: Map<string, any> }, account: string) {
  let node: { item: Row | null; children: Map<string, any> } | undefined = root;
  let best: Row | null = null;
  for (let index = 0; index < account.length; index += 1) {
    node = node.children.get(account[index]);
    if (!node) break;
    if (node.item) best = node.item;
  }
  return best;
}

function sameValues(left: unknown[], right: unknown[]) {
  if (left.length !== right.length) return false;
  const inputs = [...left].sort();
  const values = [...right].sort();
  return inputs.every((value, index) => value === values[index]);
}

export async function analyzeLedger(
  rawData: { glData: Row[]; coaData: Row[] },
  selectedHeaders: Headers,
  dictionaryData: { inputs?: unknown[]; result?: string }[] | undefined,
  onProgress?: (done: number, total: number) => void
) {
  const { glData, coaData } = rawData;
  const { glHeaders, coaHeaders } = selectedHeaders;
  const totalRows = glData.length;
  const emptyCoa: Row = {};
  if (coaData[0]) {
    for (const key of Object.keys(coaData[0])) emptyCoa[key] = "not mapped";
  }

  const coaRoot = buildPrefixIndex(coaData, coaHeaders.mappingValue);
  const output: Row[] = [];
  onProgress?.(0, totalRows);

  for (let index = 0; index < totalRows; index += 1) {
    const item = glData[index];
    const account = String(item[glHeaders.account] ?? "");
    const bestMatch = matchAccount(coaRoot, account);
    output.push({
      ...item,
      ...(!bestMatch ? { [glHeaders.account]: "not mapped" } : {}),
      coaData: bestMatch || emptyCoa,
    });
    if (index > 0 && index % 5000 === 0) {
      onProgress?.(index, totalRows);
      await yieldThread();
    }
  }

  const groupedByJenAndDate = new Map<string, Row[]>();
  for (const item of output) {
    const key = `${item[glHeaders.date]}_${item[glHeaders.jen]}`;
    const group = groupedByJenAndDate.get(key);
    if (group) group.push(item);
    else groupedByJenAndDate.set(key, [item]);
  }

  const addJournal = (sum: number, value: unknown) =>
    Number((sum + Number(value)).toFixed(2));

  for (const rows of groupedByJenAndDate.values()) {
    const prefix = prefixes(rows, glHeaders.value, addJournal);
    const next = nextEqualPrefix(prefix);
    let index = 0;
    while (index < rows.length) {
      const end = next[index];
      if (end > index) {
        const coaValues = new Set<unknown>();
        for (let rowIndex = index; rowIndex < end; rowIndex += 1) {
          const value = rows[rowIndex].coaData?.[coaHeaders.displayValue];
          if (value) coaValues.add(value);
        }
        const sortedValues = [...coaValues].sort((a, b) => Number(a) - Number(b));
        const dictionaryItem = dictionaryData?.find(
          (item) => Array.isArray(item.inputs) && sameValues(item.inputs, sortedValues)
        );
        const result = dictionaryItem?.result ? [dictionaryItem.result] : sortedValues;
        for (let rowIndex = index; rowIndex < end; rowIndex += 1) {
          rows[rowIndex].result = result;
        }
        index = end;
      } else {
        index += 1;
      }
    }
  }

  const groupedByAccountAndResult = new Map<string, Row[]>();
  for (const item of output) {
    const resultKey = item.result
      ? item.result.sort((a: string, b: string) => a.localeCompare(b)).join("/")
      : "unmatched";
    const key = `${item[glHeaders.date]}_${item[glHeaders.account]}_${resultKey}`;
    const group = groupedByAccountAndResult.get(key);
    if (group) group.push(item);
    else groupedByAccountAndResult.set(key, [item]);
  }

  const addReversal = (sum: number, value: unknown) =>
    Number(
      (Number(sum.toFixed(2)) + Number(Number(value).toFixed(2))).toFixed(2)
    );

  for (const rows of groupedByAccountAndResult.values()) {
    const prefix = prefixes(rows, glHeaders.value, addReversal);
    const next = nextEqualPrefix(prefix);
    let index = 0;
    while (index < rows.length) {
      const end = next[index];
      if (end > index) {
        for (let rowIndex = index; rowIndex < end; rowIndex += 1) {
          rows[rowIndex].reversal = "reversal";
        }
        index = end;
      } else {
        if (index + 1 === rows.length) rows[index].reversal = "-";
        index += 1;
      }
    }
  }

  const existingCoaKeys = new Set(
    output.map((item) => item.coaData?.[coaHeaders.mappingValue])
  );
  const displayHeaders = coaData
    .filter((item) => existingCoaKeys.has(item[coaHeaders.mappingValue]))
    .map((item) => ({ ...item, active: true }));

  const overviewTableData: Record<string, Row[]> = {};
  for (const item of output) {
    const resultKey =
      item.result?.sort((a: string, b: string) => String(a).localeCompare(String(b))).join("/") ||
      "unmatched";
    if (!overviewTableData[resultKey]) overviewTableData[resultKey] = [];
    overviewTableData[resultKey].push(item);
  }

  onProgress?.(totalRows, totalRows);
  return { tableData: output, overviewTableData, displayHeaders };
}
