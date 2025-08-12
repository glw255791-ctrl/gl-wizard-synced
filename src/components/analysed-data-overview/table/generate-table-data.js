self.onmessage = function (e) {
  const {
    sortedDataDisplayHeader,
    overviewTableData,
    mappingValue,
    valueKey,
    colors,
  } = e.data;

  const columns = [
    "sideHeader",
    ...sortedDataDisplayHeader.map((item) => item[mappingValue]),
  ];

  const rows = [
    // Header row
    ...Object.keys(sortedDataDisplayHeader[0]).map((item) => ({
      sideHeader: item === "active" ? "Include" : item,
      ...Object.fromEntries(
        columns
          .filter((col) => col !== "sideHeader")
          .map((key, index) => [key, sortedDataDisplayHeader[index][item]])
      ),
      total: "",
      bg: colors.lighter,
      header: true,
    })),

    // Data rows
    ...Object.keys(overviewTableData).map((item) => {
      const generatedRowObject = Object.fromEntries(
        columns
          .filter((col) => col !== "total" && col !== "sideHeader")
          .map((key) => {
            const sum = overviewTableData[item]
              .filter((it) => it.coaData[mappingValue] === key)
              .reduce((prev, curr) => prev + (curr[valueKey] || 0), 0);
            return [key, sum.toFixed(2)];
          })
      );

      const total = sortedDataDisplayHeader
        .filter((item) => item.active)
        .map((item) => item[mappingValue])
        .reduce(
          (prev, curr) => prev + Number(generatedRowObject[curr] || 0),
          0
        );

      return {
        sideHeader: item,
        ...generatedRowObject,
        total: total.toFixed(2),
        bg: "white",
        header: false,
      };
    }),

    // Total row
    {
      sideHeader: "Total",
      ...Object.fromEntries(
        columns
          .filter((col) => col !== "total" && col !== "sideHeader")
          .map((key) => {
            const sum = Object.values(overviewTableData)
              .flat()
              .filter((item) => item.coaData[mappingValue] === key)
              .reduce((prev, curr) => prev + (curr[valueKey] || 0), 0);
            return [key, sum.toFixed(2)];
          })
      ),
      bg: colors.lighter,
      header: true,
    },
  ];

  const width = 250 * columns.length;
  const height =
    24 * rows.filter((item) => !item.header).length +
    36 * rows.filter((item) => item.header).length +
    24;

  self.postMessage({
    columns,
    rows,
    width,
    height,
  });
};
