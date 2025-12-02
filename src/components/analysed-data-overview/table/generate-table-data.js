self.onmessage = function (e) {
  const {
    sortedDataDisplayHeader,
    overviewTableData,
    groupingValue,
    valueKey,
    selectedFilter,
    colors,
  } = e.data;

  // Build column keys: first sideHeader, then mappingValues of header
  const columns = [
    "sideHeader",
    ...sortedDataDisplayHeader.map((headerObj) => headerObj[groupingValue]),
  ];

  // Generate Header Rows
  const headerRows = Object.keys(sortedDataDisplayHeader[0]).map(
    (headerKey) => {
      const headerCells = Object.fromEntries(
        columns
          .filter((col) => col !== "sideHeader")
          .map((colKey, colIdx) => [
            colKey,
            sortedDataDisplayHeader[colIdx][headerKey],
          ])
      );
      return {
        sideHeader: headerKey === "active" ? "Include" : headerKey,
        ...headerCells,
        total: "",
        bg: colors.lighter,
        header: true,
      };
    }
  );

  // Generate Data Rows
  const dataRows = Object.keys(overviewTableData).map((rowKey) => {
    // For each column (excluding total/sideHeader), sum up the data per key
    const valueCells = Object.fromEntries(
      columns
        .filter((col) => col !== "sideHeader" && col !== "total")
        .map((colKey) => {
          const sum = overviewTableData[rowKey]
            .filter((entry) => entry.coaData[groupingValue] === colKey)
            .reduce((acc, entry) => acc + (entry[valueKey] || 0), 0);

          return [
            colKey,
            Number(sum.toFixed(2)).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            }),
          ];
        })
    );

    // Sum only active columns for total
    const total = [
      ...new Set(
        sortedDataDisplayHeader
          .filter((header) => header.active)
          .map((header) => header[groupingValue])
      ),
    ].reduce((acc, colKey) => {
      // Convert value like '5.274,01' to float
      const strVal = valueCells[colKey];
      let numVal;
      if (typeof strVal === "string") {
        // Replace '.' as thousands separator and ',' as decimal separator
        numVal = Number(strVal.replace(/\./g, "").replace(",", "."));
      } else {
        numVal = Number(strVal);
      }
      return acc + (isNaN(numVal) ? 0 : numVal);
    }, 0);

    return {
      sideHeader: rowKey,
      ...valueCells,
      total: Number(total.toFixed(2)).toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
      }),
      bg: "white",
      header: false,
    };
  });

  // Generate Total Row (across all data entries)
  const totalRowCells = Object.fromEntries(
    columns
      .filter((col) => col !== "sideHeader" && col !== "total")
      .map((colKey) => {
        const sum = Object.values(overviewTableData)
          .flat()
          .filter((entry) => entry.coaData[groupingValue] === colKey)
          .reduce((acc, entry) => acc + (entry[valueKey] || 0), 0);
        return [
          colKey,
          Number(sum.toFixed(2)).toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          }),
        ];
      })
  );

  const totalRow = {
    sideHeader: "Total",
    ...totalRowCells,
    bg: colors.lighter,
    header: true,
  };

  const rows = [
    ...headerRows.filter(
      (row) =>
        selectedFilter.header === "all" ||
        row.sideHeader === "Include" ||
        row.sideHeader === groupingValue
    ),
    ...dataRows,
    totalRow,
  ];

  // Table measurements
  const width = 250 * columns.length;
  const height =
    24 * rows.filter((row) => !row.header).length +
    36 * rows.filter((row) => row.header).length +
    24;

  self.postMessage({
    columns,
    rows,
    width,
    height,
  });
};
