self.onmessage = function (e) {
  const {
    sortedDataDisplayHeader,
    overviewTableData,
    mappingValue,
    valueKey,
    colors,
  } = e.data;

  // Build column keys: first sideHeader, then mappingValues of header
  const columns = [
    "sideHeader",
    ...sortedDataDisplayHeader.map(headerObj => headerObj[mappingValue]),
  ];

  // Generate Header Rows
  const headerRows = Object.keys(sortedDataDisplayHeader[0]).map((headerKey) => {
    const headerCells = Object.fromEntries(
      columns
        .filter(col => col !== "sideHeader")
        .map((colKey, colIdx) => [colKey, sortedDataDisplayHeader[colIdx][headerKey]])
    );

    return {
      sideHeader: headerKey === "active" ? "Include" : headerKey,
      ...headerCells,
      total: "",
      bg: colors.lighter,
      header: true,
    };
  });

  // Generate Data Rows
  const dataRows = Object.keys(overviewTableData).map((rowKey) => {
    // For each column (excluding total/sideHeader), sum up the data per key
    const valueCells = Object.fromEntries(
      columns
        .filter(col => col !== "sideHeader" && col !== "total")
        .map(colKey => {
          const sum = overviewTableData[rowKey]
            .filter(entry => entry.coaData[mappingValue] === colKey)
            .reduce((acc, entry) => acc + (entry[valueKey] || 0), 0);
          return [colKey, sum.toFixed(2)];
        })
    );

    // Sum only active columns for total
    const total = sortedDataDisplayHeader
      .filter(header => header.active)
      .map(header => header[mappingValue])
      .reduce((acc, colKey) => acc + Number(valueCells[colKey] || 0), 0);

    return {
      sideHeader: rowKey,
      ...valueCells,
      total: total.toFixed(2),
      bg: "white",
      header: false,
    };
  });

  // Generate Total Row (across all data entries)
  const totalRowCells = Object.fromEntries(
    columns
      .filter(col => col !== "sideHeader" && col !== "total")
      .map(colKey => {
        const sum = Object.values(overviewTableData)
          .flat()
          .filter(entry => entry.coaData[mappingValue] === colKey)
          .reduce((acc, entry) => acc + (entry[valueKey] || 0), 0);
        return [colKey, sum.toFixed(2)];
      })
  );
  const totalRow = {
    sideHeader: "Total",
    ...totalRowCells,
    bg: colors.lighter,
    header: true,
  };

  // Combined all rows
  const rows = [
    ...headerRows,
    ...dataRows,
    totalRow,
  ];

  // Table measurements
  const width = 250 * columns.length;
  const height =
    24 * rows.filter(row => !row.header).length +
    36 * rows.filter(row => row.header).length +
    24;

  self.postMessage({
    columns,
    rows,
    width,
    height,
  });
};
