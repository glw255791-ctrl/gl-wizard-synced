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
  ProcessTreeBranch,
  ProcessTreeChildren,
  SectionLabel,
  FilterChip,
  FilterChipClear,
  SelectedSection,
  BottomSection,
} from "./style";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import { theme } from "@/constants/theme";
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
  computeTableData,
  getColorForIndex,
  formatCurrency,
} from "./process-modal-funcs";
import { getElipsis } from "../table/ellipsis";
import { toResultPath } from "../table/functions";
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
  const [exportFileName, setExportFileName] = useState("");

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
    if (!tree) return null;

    const renderTree = (node: Node, key: string) => (
      <ProcessTreeBranch key={key}>
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
        {node.children.length > 0 ? (
          <ProcessTreeChildren>
            {node.children.map((child, index) =>
              renderTree(child, `${key}-${index}`)
            )}
          </ProcessTreeChildren>
        ) : null}
      </ProcessTreeBranch>
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
      setExportFileName("");
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
            <IconButton onClick={onClose} sx={{ color: theme.colors.white }}>
              <CloseIcon />
            </IconButton>
          </ModalHeader>

          <Stack sx={{ flex: 1, minHeight: 0, width: "100%" }}>
            <Stack
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
                minHeight: 56,
                padding: "12px 20px",
                borderBottom: `1px solid ${theme.colors.softBlue}`,
                backgroundColor: theme.colors.surface,
              }}
            >
              <Input
                disableUnderline
                style={{
                  width: 240,
                  height: theme.height.input,
                  boxSizing: "border-box",
                  border: `1px solid ${theme.colors.softBlue}`,
                  borderRadius: 16,
                  padding: "0 14px",
                  fontSize: 14,
                  backgroundColor: theme.colors.white,
                  color: theme.colors.black,
                }}
                placeholder="Export file name"
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
              />
              <ExcelDownloadButton
                disabled={exportFileName.trim() === ""}
                variant="contained"
                onClick={async () => {
                  const fileName = exportFileName.trim();
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
                        toResultPath(tableItem.result) === item.sideHeader &&
                        tableItem.coaData[
                          commonTableProps.groupingValue as keyof AnyType
                        ] ===
                          item[commonTableProps.groupingValue as keyof AnyType]
                      );
                    });
                  });

                  const rows = allRows.map((item) => String(item.sideHeader));
                  const [{ exportMultipleTablesToExcel }, { exportTreeToExcel }] =
                    await Promise.all([
                      import("../table/functions"),
                      import("./process-export"),
                    ]);

                  await exportMultipleTablesToExcel(
                    basicTableHeader,
                    tableDataByRows,
                    rows
                  );
                  await exportTreeToExcel(
                    buildTree(overallProcessObject),
                    `${fileName}.xlsx`
                  );
                }}
              >
                Export Excel
              </ExcelDownloadButton>

              {searchByObject ? (
                <FilterChip>
                  <Typography
                    component="span"
                    style={{
                      fontSize: 13,
                      color: theme.colors.medium,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Drilled into
                  </Typography>
                  <Typography
                    component="span"
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: theme.colors.darker,
                      maxWidth: 280,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={searchByObject.value}
                  >
                    {getElipsis(searchByObject.value, 48)}
                  </Typography>
                  <FilterChipClear
                    aria-label="Clear drill-down filter"
                    onClick={() => setSearchByObject(undefined)}
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </FilterChipClear>
                </FilterChip>
              ) : (
                <Typography
                  style={{
                    fontSize: 13,
                    color: theme.colors.medium,
                    marginLeft: 4,
                  }}
                >
                  {initialProcessObject?.title
                    ? `Starting from ${getElipsis(initialProcessObject.title, 40)}`
                    : null}
                </Typography>
              )}
            </Stack>

            <ModalContentWrapper>
              {(isLoading || overallProcessObject.length > 0) && (
                <SelectedSection>
                  <SectionLabel>Selected process</SectionLabel>
                  <SelectedTableWrapper>
                    {isLoading ? (
                      <LoaderContentWrapper>
                        <LoaderContent>
                          <LoaderText>Loading...</LoaderText>
                        </LoaderContent>
                        <StyledCircularProgress />
                      </LoaderContentWrapper>
                    ) : (
                      renderProcessTree()
                    )}
                  </SelectedTableWrapper>
                </SelectedSection>
              )}

              <BottomSection>
                <SectionLabel>
                  {searchByObject
                    ? "Related movements — click + to add"
                    : "Starting movements — click + to add"}
                </SectionLabel>
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
              </BottomSection>
            </ModalContentWrapper>
          </Stack>
        </ModalInnerContent>
      </ModalContent>
    </Modal>
  );
}
