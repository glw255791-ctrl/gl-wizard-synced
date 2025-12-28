import { IconButton, Input, Modal, Stack, Typography } from "@mui/material";
import {
  ModalContent,
  ModalInnerContent,
  ModalHeader,
  Title,
  ModalContentWrapper,
  LoaderContent,
  StyledCircularProgress,
  LoaderText,
  SelectedTableWrapper,
  TablesWrapper,
  LoaderContentWrapper,
  ExcelDownloadButton,
} from "./style";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { AnyType } from "../../../types";
import { ProcessDataTable } from "./process-table";
import {
  buildTree,
  Node,
  exportTreeToExcel,
  computeTableData,
  getColorForIndex,
  formatCurrency,
} from "./process-modal-funcs";
import { exportMultipleTablesToExcel, getElipsis } from "../table/functions";
import {
  SearchByObject,
  TableData,
  ProcessModalProps,
  ProcessValue,
} from "./types";

export function ProcessModal(props: ProcessModalProps) {
  /* ===========================================================================
   * Props
   * =========================================================================== */
  const {
    isOpen,
    onClose,
    overviewTableData,
    sortedDataDisplayHeader,
    selectedFilter,
    commonTableProps,
    filterValueOptions,
    initialProcessObject,
    basicTableData,
    basicTableHeader,
  } = props;

  /* ===========================================================================
   * State
   * =========================================================================== */
  const [overallProcessObject, setOverallProcessObject] = useState<
    ProcessValue[]
  >([]);
  const [searchByObject, setSearchByObjectInternal] = useState<
    SearchByObject | undefined
  >(undefined);
  const [lazyTablesData, setLazyTablesData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [processName, setProcessName] = useState("");

  /* ===========================================================================
   * Refs & transitions
   * =========================================================================== */
  const sideHeaderColorMapRef = useRef<Map<string, string>>(new Map());
  const computationIdRef = useRef(0);
  const [isPending, startTransition] = useTransition();

  /* ===========================================================================
   * Helpers
   * =========================================================================== */

  // Assign (and cache) a unique color per sideHeader
  const getColorForSideHeader = useCallback((sideHeader: string): string => {
    const colorMap = sideHeaderColorMapRef.current;
    if (!colorMap.has(sideHeader)) {
      colorMap.set(sideHeader, getColorForIndex(colorMap.size));
    }
    return colorMap.get(sideHeader)!;
  }, []);

  /**
   * Wrapper that ensures loading state is rendered
   * before triggering expensive updates
   */
  const setSearchByObject = useCallback(
    (newValue: SearchByObject | undefined) => {
      setLoading(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSearchByObjectInternal(newValue);
        });
      });
    },
    []
  );

  /* ===========================================================================
   * Process manipulation handlers
   * =========================================================================== */

  const handleAddToProcess = useCallback(
    (processValue: ProcessValue) => {
      setOverallProcessObject((prev) => {
        const rowsWithColors = processValue.rows.map((row) => ({
          ...row,
          bg: getColorForSideHeader(String(row.sideHeader)),
        }));

        const existingItem = prev?.find(
          (item) => item.title === processValue.title
        );

        if (existingItem) {
          return prev.map((item) => {
            if (item.title !== processValue.title) return item;

            const rowsWithoutTotal = item.rows.filter(
              (row) => row.sideHeader !== "Total"
            );

            const existingRowsSum = rowsWithoutTotal.reduce((acc, row) => {
              const numericValue = Number(
                (row.total as string).replace(/\./g, "").replace(",", ".")
              );
              return acc + numericValue;
            }, 0);

            const newRowsSum = rowsWithColors.reduce((acc, row) => {
              const numericValue = Number(
                ((row as Record<string, AnyType>).total as string)
                  .replace(/\./g, "")
                  .replace(",", ".")
              );
              return acc + numericValue;
            }, 0);

            const total = formatCurrency(existingRowsSum + newRowsSum);

            return {
              ...item,
              rows: [
                ...rowsWithoutTotal,
                ...rowsWithColors,
                { sideHeader: "Total", total, bg: "white", header: false },
              ],
            };
          });
        }

        const level = (searchByObject?.level || 0) + 1;

        const total = formatCurrency(
          rowsWithColors.reduce((acc, row) => {
            const numericValue = Number(
              ((row as Record<string, AnyType>).total as string)
                .replace(/\./g, "")
                .replace(",", ".")
            );
            return acc + numericValue;
          }, 0)
        );

        const newTable = {
          title: processValue.title,
          rows: [
            ...rowsWithColors,
            { sideHeader: "Total", total, bg: "white", header: false },
          ],
          level,
          parent: searchByObject,
        };

        return [...prev, newTable];
      });
    },
    [searchByObject, getColorForSideHeader]
  );

  const handleRemoveFromProcess = useCallback((processValue: ProcessValue) => {
    setOverallProcessObject((prev) => {
      const foundTable = prev?.find(
        (item) =>
          item.title === processValue.title && item.level === processValue.level
      ) || {
        title: processValue.title,
        rows: [],
        level: processValue.level,
      };

      const remainingTables = prev?.filter(
        (item) =>
          !(
            item.title === processValue.title &&
            item.level === processValue.level
          )
      );

      const rowsToRemove = processValue.rows.map((row) => JSON.stringify(row));

      const updatedRows = foundTable.rows
        .filter((row) => !rowsToRemove.includes(JSON.stringify(row)))
        .filter((row) => row.sideHeader !== "Total");

      const total = formatCurrency(
        updatedRows.reduce((acc, row) => {
          const numericValue = Number(
            ((row as Record<string, AnyType>).total as string)
              .replace(/\./g, "")
              .replace(",", ".")
          );
          return acc + numericValue;
        }, 0)
      );

      const updatedTable = {
        ...foundTable,
        rows: [
          ...updatedRows,
          { sideHeader: "Total", total, bg: "white", header: false },
        ],
      };

      const hasNonTotalRows =
        updatedTable.rows.filter((row) => row.sideHeader !== "Total").length >
        0;

      return [...remainingTables, ...(hasNonTotalRows ? [updatedTable] : [])];
    });
  }, []);

  /* ===========================================================================
   * Tree rendering
   * =========================================================================== */

  const renderProcessTree = useCallback((): React.ReactNode => {
    const tree = buildTree(overallProcessObject);

    const renderTree = (node: Node, key: string) => (
      <Stack style={{ flexDirection: "row", gap: 15 }} key={key}>
        <ProcessDataTable
          id={`${node.title}-${node.level}`}
          title={node.title}
          rows={node.rows}
          isTopTable
          level={node.level}
          overallProcessObject={overallProcessObject}
          removeFromProcess={handleRemoveFromProcess}
          setSearchByObject={(so) => so && setSearchByObject(so)}
          {...commonTableProps}
        />
        <Stack style={{ flexDirection: "column", gap: 10 }}>
          {node.children.map((child, index) =>
            renderTree(child, `${key}-${index}`)
          )}
        </Stack>
      </Stack>
    );

    return renderTree(tree, "0");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overallProcessObject, handleRemoveFromProcess, commonTableProps]);

  /* ===========================================================================
   * Derived UI
   * =========================================================================== */

  const renderedTables = useMemo(
    () =>
      lazyTablesData.map((tableData) => (
        <ProcessDataTable
          key={tableData.key}
          id={tableData.id}
          title={tableData.title}
          overviewTableData={tableData.overviewTableData}
          sortedDataDisplayHeader={tableData.sortedDataDisplayHeader}
          rows={tableData.rows}
          level={tableData.level}
          overallProcessObject={overallProcessObject}
          removeFromProcess={handleRemoveFromProcess}
          onAddToProcess={handleAddToProcess}
          setSearchByObject={(so) => so && setSearchByObject(so)}
          {...commonTableProps}
        />
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      lazyTablesData,
      overallProcessObject,
      handleAddToProcess,
      handleRemoveFromProcess,
      commonTableProps,
    ]
  );

  const isLoading = loading || isPending;

  /* ===========================================================================
   * Effects
   * =========================================================================== */

  useEffect(() => {
    if (!isOpen) {
      setLazyTablesData([]);
      setOverallProcessObject([]);
      setSearchByObjectInternal(undefined);
      setProcessName("");
      sideHeaderColorMapRef.current.clear();
      return;
    }

    const currentComputationId = ++computationIdRef.current;
    setLoading(true);

    const timeoutId = setTimeout(() => {
      if (computationIdRef.current !== currentComputationId) return;

      const { tablesData, processUpdates } = computeTableData(
        searchByObject,
        initialProcessObject,
        filterValueOptions,
        overviewTableData,
        sortedDataDisplayHeader,
        selectedFilter,
        commonTableProps
      );

      if (computationIdRef.current !== currentComputationId) return;

      if (processUpdates.length > 0) {
        setOverallProcessObject((prev) => {
          const newProcessItems = processUpdates
            .filter((item) => !prev.some((obj) => obj.title === item.title))
            .map((item) => ({
              ...item,
              level: (searchByObject?.level || 0) + 1,
              rows: item.rows.map((row) => ({
                ...row,
                bg: searchByObject?.bg || "white",
              })),
              parent: searchByObject,
            }));

          const updatedProcessItems = prev.map((item) => {
            const matching = processUpdates.find(
              (existing) => existing.title === item.title
            );
            if (!matching) return item;

            const alreadyHasRow = item.rows.find(
              (row) => row.sideHeader === matching.rows[0]?.sideHeader
            );

            return {
              ...item,
              rows: alreadyHasRow
                ? item.rows
                : [
                    ...item.rows,
                    { ...matching.rows[0], bg: searchByObject?.bg || "white" },
                  ],
            };
          });

          return [...updatedProcessItems, ...newProcessItems];
        });
      }

      startTransition(() => {
        if (computationIdRef.current === currentComputationId) {
          setLazyTablesData(tablesData);
        }
      });

      setTimeout(() => {
        if (computationIdRef.current === currentComputationId) {
          setLoading(false);
        }
      }, 50);
    }, 0);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpen,
    selectedFilter.header,
    overviewTableData,
    sortedDataDisplayHeader,
    commonTableProps.mappingValue,
    commonTableProps.groupingValue,
    commonTableProps.valueKey,
    filterValueOptions,
    searchByObject,
    initialProcessObject,
  ]);

  /* ===========================================================================
   * Render
   * =========================================================================== */

  return (
    <Modal
      open={isOpen}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
        },
      }}
    >
      <ModalContent>
        <ModalInnerContent>
          <ModalHeader>
            <Title>Process Analysis</Title>
            <Stack
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Input
                disableUnderline
                style={{
                  width: 200,
                  border: "1px solid #ccc",
                  borderRadius: 25,
                  padding: "0 15px",
                  fontSize: 14,
                }}
                placeholder="Enter process name"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
              />
              <ExcelDownloadButton
                disabled={processName === ""}
                variant="contained"
                onClick={() => {
                  const allRows = overallProcessObject
                    .map((item) =>
                      item.rows.map((row) => ({
                        ...row,
                        [commonTableProps.groupingValue]: item.title,
                      }))
                    )
                    .flat();

                  const tableDataByRows = allRows.map((item) => {
                    return basicTableData.filter((tableItem) => {
                      return (
                        (tableItem.result as unknown as string[]).join("/") ===
                          item.sideHeader &&
                        tableItem.coaData[
                          commonTableProps.groupingValue as keyof AnyType
                        ] ===
                          item[commonTableProps.groupingValue as keyof AnyType]
                      );
                    });
                  });

                  const rows = allRows.map((item) => String(item.sideHeader));

                  exportMultipleTablesToExcel(
                    basicTableHeader,
                    tableDataByRows,
                    rows
                  );

                  exportTreeToExcel(
                    buildTree(overallProcessObject),
                    `${processName}.xlsx`
                  );
                }}
              >
                Export
              </ExcelDownloadButton>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </ModalHeader>

          <Stack style={{ height: "100%" }}>
            <Stack
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                height: 40,
                paddingLeft: 30,
              }}
            >
              <ExcelDownloadButton
                disabled={searchByObject === undefined}
                variant="contained"
                onClick={() => {
                  setSearchByObject(undefined);
                }}
              >
                Back to initial Table
              </ExcelDownloadButton>
              {
                <Stack
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <Typography
                    style={{ fontSize: 14 }}
                  >{`Currently active comment: `}</Typography>
                  <Typography
                    style={{ fontWeight: "bold", fontSize: 14 }}
                  >{`${getElipsis(
                    searchByObject?.value || "All",
                    100
                  )} `}</Typography>
                  <Typography style={{ fontSize: 14 }}>{`from `}</Typography>
                  <Typography
                    style={{ fontWeight: "bold", fontSize: 14 }}
                  >{`${getElipsis(
                    searchByObject?.title ??
                      (initialProcessObject?.title || ""),
                    50
                  )}`}</Typography>
                </Stack>
              }
            </Stack>

            <ModalContentWrapper>
              <SelectedTableWrapper>
                {isLoading ? (
                  <LoaderContentWrapper>
                    <LoaderContent>
                      <LoaderText>Loading...</LoaderText>
                    </LoaderContent>
                    <StyledCircularProgress />
                  </LoaderContentWrapper>
                ) : (
                  overallProcessObject.length > 0 && renderProcessTree()
                )}
              </SelectedTableWrapper>

              <TablesWrapper>
                {isLoading ? (
                  <LoaderContentWrapper>
                    <LoaderContent>
                      <LoaderText>
                        Analysing, this may take a while...
                      </LoaderText>
                      <StyledCircularProgress />
                    </LoaderContent>
                  </LoaderContentWrapper>
                ) : renderedTables.length > 0 ? (
                  renderedTables
                ) : (
                  <LoaderContentWrapper>
                    <LoaderContent>
                      <Typography>No tables to display</Typography>
                    </LoaderContent>
                  </LoaderContentWrapper>
                )}
              </TablesWrapper>
            </ModalContentWrapper>
          </Stack>
        </ModalInnerContent>
      </ModalContent>
    </Modal>
  );
}
