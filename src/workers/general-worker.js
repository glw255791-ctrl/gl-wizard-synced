self.onmessage = (event) => {
  const { rawData, selectedHeaders } = event.data;
  const { glData, coaData } = rawData;
  const { glHeaders, coaHeaders } = selectedHeaders;

  // ===== 1. Pre-process COA Data =====
  const validCoaItems = coaData
    .filter((item) => item[coaHeaders.mappingValue] !== "")
    .sort(
      (a, b) =>
        b[coaHeaders.mappingValue].length - a[coaHeaders.mappingValue].length
    );

  // ===== 2. Process GL Data in Chunks =====
  const CHUNK_SIZE = 500;
  const output = [];
  const totalRows = glData.length;
  let processedRows = 0;

  const createEmptyCoaItem = () => {
    const empty = {};
    for (const key in coaData[0]) empty[key] = "not mapped";
    return empty;
  };

  while (processedRows < totalRows) {
    const chunkEnd = Math.min(processedRows + CHUNK_SIZE, totalRows);
    const chunk = glData.slice(processedRows, chunkEnd);

    for (const item of chunk) {
      const account = String(item[glHeaders.account]);
      let bestMatch = null;

      for (const coaItem of validCoaItems) {
        if (account.startsWith(coaItem[coaHeaders.mappingValue])) {
          bestMatch = coaItem;
          break;
        }
      }
      output.push({
        ...item,
        ...(!bestMatch ? { [glHeaders.account]: "not mapped" } : {}),
        coaData: bestMatch || createEmptyCoaItem(),
      });
    }

    processedRows = chunkEnd;

  }

  // ===== 3. Group by JEN and Date =====
  const groupedByJenAndDate = new Map();
  for (const item of output) {
    const key = `${item[glHeaders.date]}_${item[glHeaders.jen]}`;
    if (!groupedByJenAndDate.has(key)) groupedByJenAndDate.set(key, []);
    groupedByJenAndDate.get(key).push(item);
  }

  // ===== 4. Find Zero-Sum Groups =====
  for (const rows of groupedByJenAndDate.values()) {
    let i = 0;
    while (i < rows.length) {
      let sum = 0;
      const chunk = [];

      for (let j = i; j < rows.length; j++) {
        const row = rows[j];
        chunk.push(row);
        sum = Number((sum + Number(row[glHeaders.value])).toFixed(2));

        if (sum === 0) {
          const coaValues = new Set();
          for (const row of chunk) {
            const val = row.coaData?.[coaHeaders.displayValue];
            if (val) coaValues.add(val);
          }
          const sortedValues = [...coaValues].sort((a, b) => a - b);
          for (const row of chunk) row.result = sortedValues;
          i = j + 1;
          break;
        }
      }
      if (sum !== 0) i++;
    }
  }

  // ===== 5. Prepare ALL Output Data =====
  const flatGroupedData = Array.from(groupedByJenAndDate.values()).flat();

  // Generate overview data (originally generateOverviewData)
  const existingCoaKeys = new Set(
    flatGroupedData.map((item) => item.coaData?.[coaHeaders.mappingValue])
  );
  const filteredCoaData = coaData
    .filter((item) => existingCoaKeys.has(item[coaHeaders.mappingValue]))
    .map((item) => ({ ...item, active: true }));

  // Condensed data (originally setOverviewTableData)
  const condensedDataByResult = new Map();
  for (const item of output) {
    const resultKey = item.result?.join("/") || "unmatched";
    if (!condensedDataByResult.has(resultKey)) {
      condensedDataByResult.set(resultKey, []);
    }
    condensedDataByResult.get(resultKey).push(item);
  }

  // ===== 6. Send Complete Result =====
  self.postMessage({
    type: "complete",
    // Processed data for main thread
    tableData: flatGroupedData,
    overviewTableData: Object.fromEntries(condensedDataByResult),
    displayHeaders: filteredCoaData,
    // Original grouped data if still needed
    groupedByJenAndDate: Object.fromEntries(groupedByJenAndDate),
  });
};
