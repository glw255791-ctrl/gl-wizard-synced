export function dictionaryFromRows(rows: Record<string, unknown>[]) {
  const entries: { inputs: unknown[]; result: string }[] = [];

  for (const row of rows) {
    const values = Object.values(row);
    let last = values.length - 1;
    while (
      last > 0 &&
      (values[last] === undefined || values[last] === null || values[last] === "")
    ) {
      last -= 1;
    }
    if (last < 1) continue;
    entries.push({
      inputs: values.slice(0, last),
      result: String(values[last] ?? ""),
    });
  }

  return entries;
}
