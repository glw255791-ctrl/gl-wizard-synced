function buildPrefixIndex(coaData, mappingKey) {
  const root = { item: null, children: new Map() };
  for (const item of coaData) {
    const code = String(item[mappingKey] ?? "");
    if (!code) continue;
    let node = root;
    for (let i = 0; i < code.length; i += 1) {
      const char = code[i];
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

function matchAccount(root, account) {
  let node = root;
  let best = null;
  for (let i = 0; i < account.length; i += 1) {
    node = node.children.get(account[i]);
    if (!node) break;
    if (node.item) best = node.item;
  }
  return best;
}

self.onmessage = (event) => {
  const { rawData, selectedHeaders, selectedFilters } = event.data;

  const mappingKey = selectedHeaders.coaHeaders.mappingValue;
  const emptyCoa = rawData.coaData[0]
    ? Object.keys(rawData.coaData[0]).reduce((prev, curr) => {
        prev[curr] = "not mapped";
        return prev;
      }, {})
    : {};
  const coaRoot = buildPrefixIndex(rawData.coaData, mappingKey);

  const output = rawData.glData.map((item) => {
    const betterMatchingCoaItem = matchAccount(
      coaRoot,
      String(item[selectedHeaders.glHeaders.account] ?? "")
    );

    return {
      ...item,
      ...(betterMatchingCoaItem && selectedFilters.header
        ? {
            [selectedFilters.header]:
              betterMatchingCoaItem[selectedFilters.header],
          }
        : {}),
      coaData: betterMatchingCoaItem ?? emptyCoa,
    };
  });

  const filtered = output.filter((item) =>
    selectedFilters.header && selectedFilters.value.length > 0
      ? selectedFilters.value.includes(item.coaData[selectedFilters.header])
      : true
  );

  const groupedByAccountAndDate = filtered.reduce((acc, curr) => {
    const key = `${curr[selectedHeaders.glHeaders.date]}_${
      curr[selectedHeaders.glHeaders.account]
    }`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  for (const [, rows] of Object.entries(groupedByAccountAndDate)) {
    // Initialize result property for all rows
    rows.forEach((row) => {
      if (!row.result) {
        row.result = "-";
      }
    });

    let i = 0;
    while (i < rows.length) {
      let sum = 0;

      for (let j = i; j < rows.length; j++) {
        sum =
          Number(sum.toFixed(2)) +
          Number(Number(rows[j][selectedHeaders.glHeaders.value]).toFixed(2));
        // Check if the sum of the chunk is zero
        if (sum === 0) {
          // Assign the result property to each row in the chunk (modify original rows)
          for (let k = i; k <= j; k++) {
            rows[k].result = "reversal/reclassification";
          }

          // Move to the next unprocessed rows
          i = j + 1;
          break;
        }
      }

      // If the loop ends without finding a zero sum, increase the chunk size
      if (sum !== 0) {
        i++; // Increase starting point to prevent infinite loop
      }
    }
  }

  self.postMessage({ groupedByAccountAndDate });
};
