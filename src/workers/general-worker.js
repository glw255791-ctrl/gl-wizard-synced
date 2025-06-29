self.onmessage = (event) => {
  const { rawData, selectedHeaders } = event.data;

  const output = rawData.glData.map((item) => {
    const foundCoaItems = rawData.coaData
      .filter((item) => item[selectedHeaders.coaHeaders.mappingValue] !== "")
      .filter((coaItem) =>
        String(item[selectedHeaders.glHeaders.account]).startsWith(
          coaItem[selectedHeaders.coaHeaders.mappingValue]
        )
      );

    const betterMatchingCoaItem = foundCoaItems.sort(
      (a, b) => b.length - a.length
    )[0];

    return {
      ...item,
      ...(betterMatchingCoaItem
        ? {}
        : { [selectedHeaders.glHeaders.account]: "not mapped" }),
      coaData:
        betterMatchingCoaItem ??
        Object.keys(rawData.coaData[0]).reduce((prev, curr) => {
          prev[curr] = "not mapped";
          return prev;
        }, {}),
    };
  });

  const groupedByJenAndDate = output.reduce((acc, curr) => {
    const key = `${curr[selectedHeaders.glHeaders.date]}_${
      curr[selectedHeaders.glHeaders.jen]
    }`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  for (const [, rows] of Object.entries(groupedByJenAndDate)) {
    let i = 0;
    while (i < rows.length) {
      const chunk = [];
      let sum = 0;

      for (let j = i; j < rows.length; j++) {
        chunk.push(rows[j]);
        sum =
          Number(sum.toFixed(2)) +
          Number(Number(rows[j][selectedHeaders.glHeaders.value]).toFixed(2));
        // Check if the sum of the chunk is zero
        if (sum === 0) {
          // Assign the result property to each row in the chunk
          const coaValues = chunk.map(
            (row) => row.coaData?.[selectedHeaders.coaHeaders.displayValue]
          );
          chunk.forEach(
            (row) =>
              (row.result = [...new Set(coaValues)].sort((a, b) => a - b))
          );

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

  const condensedDataByResult = Object.values(groupedByJenAndDate)
    .flat()
    .map((item) => ({ ...item, result: item.result?.join("/") }))
    .reduce((prev, curr) => {
      if (!prev[curr.result]) prev[curr.result] = [];
      prev[curr.result].push(curr);
      return prev;
    }, {});

  self.postMessage({ groupedByJenAndDate, condensedDataByResult });
};
