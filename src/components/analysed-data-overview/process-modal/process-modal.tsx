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
import { TableHeader } from "../../composed/basic-table/basic-table";
import { ProcessValue } from "../analysed-data-overview";
import { buildTree, Node, exportTreeToExcel } from "./process-modal-funcs";
import { exportMultipleTablesToExcel, getElipsis } from "../table/functions";

// Predefined palette of distinct, visually appealing colors for row backgrounds
const ROW_COLORS = [
  "#E3F2FD", // light blue
  "#FFF3E0", // light orange
  "#E8F5E9", // light green
  "#FCE4EC", // light pink
  "#F3E5F5", // light purple
  "#E0F7FA", // light cyan
  "#FFF8E1", // light amber
  "#E8EAF6", // light indigo
  "#EFEBE9", // light brown
  "#F1F8E9", // light lime
  "#E0F2F1", // light teal
  "#FBE9E7", // light deep orange
  "#ECEFF1", // light blue grey
  "#F9FBE7", // light yellow green
  "#EDE7F6", // light deep purple
];

// Generate a color for a given index (cycles through palette, then generates variations)
function getColorForIndex(index: number): string {
  if (index < ROW_COLORS.length) {
    return ROW_COLORS[index];
  }
  // Generate additional colors by adjusting hue
  const hue = (index * 137.5) % 360; // Golden angle for good distribution
  return `hsl(${hue}, 70%, 90%)`;
}

interface TableData {
  key: string;
  id: string;
  title: string;
  overviewTableData: Record<string, AnyType> | undefined;
  sortedDataDisplayHeader: Record<string, AnyType>[];
  rows: Record<string, AnyType>[];
  level: number;
}

interface Filters {
  header: string;
  value: string;
}

export interface SearchByObject {
  title: string;
  level: number;
  value: string;
}

interface CommonTableProps {
  transitionFunc: React.TransitionStartFunction;
  mappingValue: string;
  groupingValue: string;
  selectedFilter: Filters;
  basicTableData: Record<string, string>[];
  basicTableHeader: TableHeader[];
  setDataDisplayHeader: React.Dispatch<
    React.SetStateAction<Record<string, AnyType>[]>
  >;
  setIsProcessModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  valueKey: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  overviewTableData: Record<string, AnyType>;
  sortedDataDisplayHeader: Record<string, AnyType>[];
  selectedFilter: Filters;
  commonTableProps: CommonTableProps;
  filterValueOptions: string[];
  initialProcessObject: ProcessValue | undefined;
  basicTableData: Record<string, string>[];
  basicTableHeader: TableHeader[];
}

// Helper function to compute table data - extracted for clarity
function computeTableData(
  searchByObject: SearchByObject | undefined,
  initialProcessObject: ProcessValue | undefined,
  filterValueOptions: string[],
  overviewTableData: Record<string, AnyType>,
  sortedDataDisplayHeader: Record<string, AnyType>[],
  selectedFilter: Filters,
  commonTableProps: CommonTableProps,
  overallProcessObject: ProcessValue[]
): { tablesData: TableData[]; processUpdates: ProcessValue[] } {
  const filteredValues = filterValueOptions.filter((v) => v !== "total");
  const accumulatedTablesData: TableData[] = [];
  const processUpdates: ProcessValue[] = [];

  if (!searchByObject) {
    accumulatedTablesData.push({
      key: initialProcessObject?.title || "initial",
      id: initialProcessObject?.title || "",
      title: initialProcessObject?.title || "",
      overviewTableData: undefined,
      sortedDataDisplayHeader: [],
      rows: initialProcessObject?.rows || [],
      level: initialProcessObject?.level || 0,
    });
  } else {
    for (const value of filteredValues) {
      const filteredOverviewData: Record<string, AnyType> = {};
      for (const mainKey of Object.keys(overviewTableData)) {
        const subArray = overviewTableData[mainKey] as Record<
          string,
          AnyType
        >[];
        if (
          subArray.some(
            (subItem) =>
              (subItem.coaData as Record<string, AnyType>)?.[
                selectedFilter.header
              ] === value
          )
        ) {
          filteredOverviewData[mainKey] = overviewTableData[mainKey];
        }
      }

      const filteredHeader = sortedDataDisplayHeader.filter(
        (item) =>
          item[selectedFilter.header] === value ||
          item[commonTableProps.mappingValue] === "total"
      );

      const hasItemInTable = Object.keys(filteredOverviewData).some(
        (key) => searchByObject?.value === key
      );

      const columns = [
        "sideHeader",
        ...filteredHeader.map(
          (headerObj) => headerObj[commonTableProps.groupingValue]
        ),
      ];

      const dataRows = Object.keys(overviewTableData).map((rowKey) => {
        const valueCells = Object.fromEntries([
          ...columns
            .filter((col) => col !== "sideHeader" && col !== "total")
            .map((colKey) => {
              const sum = (
                overviewTableData[rowKey] as Record<string, AnyType>[]
              )
                .filter(
                  (entry) =>
                    entry.coaData[
                      commonTableProps.groupingValue as keyof AnyType
                    ] === colKey
                )
                .reduce(
                  (acc, entry) =>
                    acc + ((entry[commonTableProps.valueKey] as number) || 0),
                  0
                );

              return [
                colKey,
                Number(sum.toFixed(2)).toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                }),
              ];
            }),
        ]);

        const total = [
          ...new Set(
            sortedDataDisplayHeader
              .filter((header) => header.active)
              .map((header) => header[commonTableProps.groupingValue])
          ),
        ].reduce((acc, colKey) => {
          const strVal = valueCells[
            colKey as keyof typeof valueCells
          ] as string;
          let numVal: number;
          if (typeof strVal === "string") {
            numVal = Number(strVal.replace(/\./g, "").replace(",", "."));
          } else {
            numVal = Number(strVal);
          }
          return (acc as number) + (isNaN(numVal) ? 0 : Number(numVal));
        }, 0);

        return {
          sideHeader: rowKey,
          ...valueCells,
          total: Number((total as number).toFixed(2)).toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          }),
          bg: "white",
          header: false,
        };
      });

      const matchingRows = dataRows.filter(
        (row) => row.sideHeader === searchByObject?.value
      );

      if (
        matchingRows.length > 0 &&
        hasItemInTable &&
        value !== searchByObject?.title &&
        !overallProcessObject
          .find(
            (item) =>
              item.title === value &&
              item.level === (searchByObject.level || 0) + 1
          )
          ?.rows.find((item) => item.sideHeader === searchByObject?.value)
      ) {
        processUpdates.push({
          title: value,
          rows: matchingRows,
          level: searchByObject?.level || 0,
        });
      }

      if (hasItemInTable && value !== searchByObject?.title) {
        accumulatedTablesData.push({
          key: value,
          id: value,
          title: value,
          overviewTableData: filteredOverviewData,
          sortedDataDisplayHeader: filteredHeader,
          rows: [],
          level: searchByObject?.level || 0,
        });
      }
    }
  }

  return { tablesData: accumulatedTablesData, processUpdates };
}

export function ProcessModal(props: Props) {
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

  const [overallProcessObject, setOverallProcessObject] = useState<
    ProcessValue[]
  >([]);

  // Maps sideHeader values to their unique background colors
  const sideHeaderColorMapRef = useRef<Map<string, string>>(new Map());

  // Get or create a color for a sideHeader value
  const getColorForSideHeader = useCallback((sideHeader: string): string => {
    const colorMap = sideHeaderColorMapRef.current;
    if (!colorMap.has(sideHeader)) {
      colorMap.set(sideHeader, getColorForIndex(colorMap.size));
    }
    return colorMap.get(sideHeader)!;
  }, []);

  const [searchByObject, setSearchByObjectInternal] = useState<
    SearchByObject | undefined
  >(undefined);

  const [loading, setLoading] = useState(false);
  const [lazyTablesData, setLazyTablesData] = useState<TableData[]>([]);

  // Use transition for non-blocking updates
  const [isPending, startTransition] = useTransition();

  // Track if component is mounted and current computation is still valid
  const computationIdRef = useRef(0);

  // Wrapper that shows loading BEFORE updating searchByObject
  // Uses double rAF to ensure the loading state is painted before triggering heavy computation
  const setSearchByObject = useCallback(
    (newValue: SearchByObject | undefined) => {
      // Show loading immediately
      setLoading(true);

      // Double requestAnimationFrame ensures the browser has actually painted
      // First rAF: scheduled before next paint
      // Second rAF: scheduled after that paint, ensuring loading is visible
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSearchByObjectInternal(newValue);
        });
      });
    },
    []
  );

  const handleAddToProcess = useCallback(
    (processValue: ProcessValue) => {
      setOverallProcessObject((prev) => {
        const level = (searchByObject?.level || 0) + 1;
        const foundTable = prev?.find(
          (item) => item.title === processValue.title && item.level === level
        ) || { title: processValue.title, rows: [], level: level };
        const restTables = prev?.filter(
          (item) => !(item.title === processValue.title && item.level === level)
        );

        // Assign unique bg color based on sideHeader value
        const rowsWithColors = processValue.rows.map((row) => ({
          ...row,
          bg: getColorForSideHeader(String(row.sideHeader)),
        }));

        const newTable = {
          ...foundTable,
          rows: [...foundTable.rows, ...rowsWithColors],
          parent: searchByObject,
        };

        return [...restTables, newTable];
      });
    },
    [searchByObject, getColorForSideHeader]
  );

  const handleRemoveFromProcess = useCallback((processValue: ProcessValue) => {
    setOverallProcessObject((prev) => {
      const foundTable = prev?.find(
        (item) =>
          item.title === processValue.title && item.level === processValue.level
      ) || { title: processValue.title, rows: [], level: processValue.level };
      const restTables = prev?.filter(
        (item) =>
          !(
            item.title === processValue.title &&
            item.level === processValue.level
          )
      );
      const newTable = {
        ...foundTable,
        rows: foundTable.rows.filter(
          (row) =>
            !processValue.rows
              .map((r) => JSON.stringify(r))
              .includes(JSON.stringify(row))
        ),
      };
      return [...restTables, ...(newTable.rows.length > 0 ? [newTable] : [])];
    });
  }, []);

  // Recursive component to render ProcessValue tree structure
  const renderProcessTree = useCallback((): React.ReactNode => {
    const tree = buildTree(overallProcessObject);

    const renderTree = (node: Node, key: string) => {
      return (
        <Stack style={{ flexDirection: "row", gap: 15, maxHeight: 400 }}>
          <ProcessDataTable
            key={`${node.title}-${node.level}`}
            id={`${node.title}-${node.level}`}
            title={node.title}
            rows={node.rows}
            isTopTable={true}
            level={node.level}
            overallProcessObject={overallProcessObject}
            removeFromProcess={handleRemoveFromProcess}
            setSearchByObject={(so: SearchByObject) => {
              if (so) {
                setSearchByObject(so);
              }
            }}
            {...commonTableProps}
          />
          <Stack
            style={{ flexDirection: "column", gap: 10 }}
            key={`${node.title}-${node.level}-children`}
          >
            {node.children.map((child, index) =>
              renderTree(child, `${key}-${index}`)
            )}
          </Stack>
        </Stack>
      );
    };

    return renderTree(tree, "0");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overallProcessObject, handleRemoveFromProcess, commonTableProps]);

  // Render tables from data
  const renderedTables = useMemo(() => {
    return lazyTablesData.map((tableData) => (
      <ProcessDataTable
        key={tableData.key}
        id={tableData.id}
        title={tableData.title}
        overviewTableData={tableData.overviewTableData}
        sortedDataDisplayHeader={tableData.sortedDataDisplayHeader}
        rows={tableData.rows}
        overallProcessObject={overallProcessObject}
        removeFromProcess={handleRemoveFromProcess}
        onAddToProcess={handleAddToProcess}
        level={tableData.level}
        setSearchByObject={(so: SearchByObject) => {
          if (so) {
            setSearchByObject(so);
          }
        }}
        {...commonTableProps}
      />
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lazyTablesData,
    overallProcessObject,
    handleAddToProcess,
    handleRemoveFromProcess,
    commonTableProps,
  ]);

  // Generate table data whenever the modal is opened or dependencies change
  useEffect(() => {
    if (!isOpen) {
      setLazyTablesData([]);
      setOverallProcessObject([]);
      setSearchByObjectInternal(undefined);
      setProcessName("");
      sideHeaderColorMapRef.current.clear();
      return;
    }

    // Increment computation ID to invalidate any pending computations
    const currentComputationId = ++computationIdRef.current;

    // Set loading immediately
    setLoading(true);

    // Use double setTimeout to ensure loading state is painted
    // First timeout yields to the event loop, second ensures paint has occurred
    const timeoutId = setTimeout(() => {
      // Check if this computation is still valid
      if (computationIdRef.current !== currentComputationId) {
        return;
      }

      // Compute data
      const { tablesData, processUpdates } = computeTableData(
        searchByObject,
        initialProcessObject,
        filterValueOptions,
        overviewTableData,
        sortedDataDisplayHeader,
        selectedFilter,
        commonTableProps,
        overallProcessObject
      );

      // Check again after computation
      if (computationIdRef.current !== currentComputationId) {
        return;
      }

      // Apply process updates
      if (processUpdates.length > 0) {
        setOverallProcessObject((prev) => {
          let updated = [...prev];
          for (const processValue of processUpdates) {
            const level = (searchByObject?.level || 0) + 1;
            const foundTable = updated.find(
              (item) =>
                item.title === processValue.title && item.level === level
            ) || { title: processValue.title, rows: [], level: level };
            const restTables = updated.filter(
              (item) =>
                !(item.title === processValue.title && item.level === level)
            );

            // Assign unique bg color based on sideHeader value
            const colorMap = sideHeaderColorMapRef.current;
            const rowsWithColors = processValue.rows.map((row) => {
              const sideHeader = String(row.sideHeader);
              if (!colorMap.has(sideHeader)) {
                colorMap.set(sideHeader, getColorForIndex(colorMap.size));
              }
              return { ...row, bg: colorMap.get(sideHeader)! };
            });

            const newTable = {
              ...foundTable,
              rows: [...foundTable.rows, ...rowsWithColors],
              parent: searchByObject,
            };
            updated = [...restTables, newTable];
          }
          return updated;
        });
      }

      // Use startTransition for the table data update (non-blocking)
      startTransition(() => {
        if (computationIdRef.current === currentComputationId) {
          setLazyTablesData(tablesData);
        }
      });

      // Hide loading after a small delay to let React commit
      setTimeout(() => {
        if (computationIdRef.current === currentComputationId) {
          setLoading(false);
        }
      }, 50);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
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

  const isLoading = loading || isPending;

  const [processName, setProcessName] = useState("");

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
