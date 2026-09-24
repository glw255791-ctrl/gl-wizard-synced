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
  SecondaryButton,
  ProcessTreeBranch,
  ProcessTreeChildren,
  SectionLabel,
  SectionHeaderRow,
  ClearSelectedButton,
  ExportStatusText,
  FilterChip,
  FilterChipClear,
  SelectedSection,
  BottomSection,
} from "./style";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
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
import { suggestNarrative } from "@/lib/ai/suggest-narrative";
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
  const [exportStatus, setExportStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [exportMessage, setExportMessage] = useState("");
  const [suggestStatus, setSuggestStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [suggestMessage, setSuggestMessage] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");

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

  const collectAccountLabels = useCallback((): string[] => {
    const toLabel = (sideHeader: unknown) => {
      const raw = String(sideHeader ?? "").trim();
      if (!raw || raw === "Total") return "";
      const parts = raw.split("/").map((p) => p.trim()).filter(Boolean);
      return parts[parts.length - 1] || raw;
    };

    const fromSelected = overallProcessObject.flatMap((item) =>
      item.rows.map((row) => toLabel(row.sideHeader))
    );
    const fromBottom = lazyTablesData.flatMap((table) =>
      table.rows.map((row) => toLabel(row.sideHeader))
    );
    return [...new Set([...fromSelected, ...fromBottom].filter(Boolean))];
  }, [overallProcessObject, lazyTablesData]);

  const handleSuggestName = useCallback(async () => {
    setSuggestStatus("loading");
    setSuggestMessage("Asking the model…");
    setAiSuggestion("");
    try {
      const accounts = collectAccountLabels();
      const narrative = await suggestNarrative(accounts);
      setAiSuggestion(narrative);
      setSuggestStatus("done");
      setSuggestMessage("Suggestion ready — edit or apply as file name.");
    } catch (err) {
      setSuggestStatus("error");
      setSuggestMessage(
        err instanceof Error ? err.message : "Could not suggest a name."
      );
    }
  }, [collectAccountLabels]);

  const handleClearSelected = useCallback(() => {
    setOverallProcessObject([]);
    setSearchByObjectInternal(undefined);
    setExportStatus("idle");
    setExportMessage("");
    setLoading(true);

    const { tablesData } = computeTableData(
      undefined,
      initialProcessObject,
      filterValueOptions,
      overviewTableData,
      sortedDataDisplayHeader,
      selectedFilter,
      commonTableProps
    );
    setLazyTablesData(tablesData);
    setLoading(false);
  }, [
    initialProcessObject,
    filterValueOptions,
    overviewTableData,
    sortedDataDisplayHeader,
    selectedFilter,
    commonTableProps,
  ]);

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
      setExportStatus("idle");
      setExportMessage("");
      setSuggestStatus("idle");
      setSuggestMessage("");
      setAiSuggestion("");
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
                disabled={
                  exportFileName.trim() === "" || exportStatus === "loading"
                }
                variant="contained"
                onClick={async () => {
                  const fileName = exportFileName.trim();
                  if (!fileName) return;

                  setExportStatus("loading");
                  setExportMessage("Preparing Excel…");

                  try {
                    const allRows = overallProcessObject
                      .map((item) =>
                        item.rows.map((row) => ({
                          ...row,
                          [commonTableProps.groupingValue]: item.title,
                        }))
                      )
                      .flat();

                    const rows = allRows
                      .filter((item) => String(item.sideHeader) !== "Total")
                      .map((item) => ({
                        title: String(item.sideHeader),
                        rows: basicTableData.filter((tableItem) => {
                          return (
                            toResultPath(tableItem.result) === item.sideHeader &&
                            tableItem.coaData[
                              commonTableProps.groupingValue as keyof AnyType
                            ] ===
                              item[
                                commonTableProps.groupingValue as keyof AnyType
                              ]
                          );
                        }),
                      }));
                    const { exportProcessWorkbook } = await import("./process-export");
                    const tree = buildTree(overallProcessObject);
                    if (!tree) {
                      throw new Error("Nothing selected to export.");
                    }
                    await exportProcessWorkbook({
                      root: tree,
                      fileName: `${fileName}.xlsx`,
                      detailHeader: basicTableHeader,
                      details: rows,
                    });

                    setExportStatus("done");
                    setExportMessage(`Saved ${fileName}.xlsx`);
                  } catch (err) {
                    setExportStatus("error");
                    setExportMessage(
                      err instanceof Error
                        ? err.message
                        : "Export failed. Try again."
                    );
                  }
                }}
              >
                {exportStatus === "loading" ? "Exporting…" : "Export Excel"}
              </ExcelDownloadButton>

              <SecondaryButton
                variant="outlined"
                disabled={suggestStatus === "loading" || isLoading}
                startIcon={<AutoAwesomeIcon />}
                onClick={() => void handleSuggestName()}
              >
                {suggestStatus === "loading" ? "Suggesting…" : "Suggest name"}
              </SecondaryButton>

              {exportStatus !== "idle" && exportMessage ? (
                <ExportStatusText
                  sx={{
                    color:
                      exportStatus === "error"
                        ? theme.colors.red
                        : exportStatus === "done"
                          ? theme.colors.deepTeal
                          : theme.colors.slateGray,
                  }}
                >
                  {exportMessage}
                </ExportStatusText>
              ) : null}

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

            {(suggestStatus !== "idle" || aiSuggestion) && (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                gap={1}
                sx={{
                  padding: "10px 20px",
                  borderBottom: `1px solid ${theme.colors.softBlue}`,
                  backgroundColor: theme.colors.paleBlue,
                }}
              >
                <Input
                  disableUnderline
                  fullWidth
                  style={{
                    flex: 1,
                    minWidth: 180,
                    height: theme.height.input,
                    boxSizing: "border-box",
                    border: `1px solid ${theme.colors.softBlue}`,
                    borderRadius: 16,
                    padding: "0 14px",
                    fontSize: 14,
                    backgroundColor: theme.colors.cleanWhite,
                    color: theme.colors.graphite,
                  }}
                  placeholder="AI suggestion"
                  value={aiSuggestion}
                  onChange={(e) => setAiSuggestion(e.target.value)}
                  disabled={suggestStatus === "loading"}
                />
                <SecondaryButton
                  variant="outlined"
                  disabled={!aiSuggestion.trim() || suggestStatus === "loading"}
                  onClick={() => {
                    setExportFileName(aiSuggestion.trim());
                    setSuggestMessage("Applied to export file name.");
                    setSuggestStatus("done");
                  }}
                >
                  Use as file name
                </SecondaryButton>
                <ExportStatusText
                  sx={{
                    color:
                      suggestStatus === "error"
                        ? theme.colors.red
                        : theme.colors.deepTeal,
                    minWidth: 120,
                  }}
                >
                  {suggestMessage}
                </ExportStatusText>
              </Stack>
            )}

            <ModalContentWrapper>
              {(isLoading || overallProcessObject.length > 0) && (
                <SelectedSection>
                  <SectionHeaderRow>
                    <SectionLabel>Selected process</SectionLabel>
                    {overallProcessObject.length > 0 ? (
                      <ClearSelectedButton
                        onClick={handleClearSelected}
                        disabled={isLoading}
                      >
                        Clear selected
                      </ClearSelectedButton>
                    ) : null}
                  </SectionHeaderRow>
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
