import { IconButton, Modal, Stack, Typography } from "@mui/material";
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
import { useEffect, useState } from "react";
import { AnyType } from "../table/functions";
import { ProcessDataTable } from "./process-table";
import { TableHeader } from "../../composed/basic-table/basic-table";
import { ProcessValue } from "../analysed-data-overview";

interface Filters {
  header: string;
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
  overallProcessObject: ProcessValue | undefined;
  setOverallProcessObject: React.Dispatch<
    React.SetStateAction<ProcessValue | undefined>
  >;
  overviewTableData: Record<string, AnyType>;
  sortedDataDisplayHeader: Record<string, AnyType>[];
  selectedFilter: Filters;
  commonTableProps: CommonTableProps;
  filterValueOptions: string[];
}

export function ProcessModal(props: Props) {
  const {
    isOpen,
    onClose,
    overallProcessObject,
    setOverallProcessObject,
    overviewTableData,
    sortedDataDisplayHeader,
    selectedFilter,
    commonTableProps,
    filterValueOptions,
  } = props;

  // Recursive component to render ProcessValue tree structure
  const renderProcessTree = (processValue: ProcessValue): React.ReactNode => {
    return (
      <Stack style={{ flexDirection: "row", gap: 15 }}>
        <ProcessDataTable
          key={processValue.title}
          id={processValue.title}
          level={processValue.level}
          title={processValue.title}
          currentProcessObject={currentProcessObject}
          setCurrentProcessObject={setCurrentProcessObject}
          overallProcessObject={overallProcessObject}
          onDeleteFromProcess={(processValue) => {
            setOverallProcessObject((prev) => {
              // Helper: Recursively remove node with title and level from children tree
              function removeNode(
                node: ProcessValue | undefined,
                title: string,
                level: number
              ): ProcessValue | undefined {
                if (!node) return undefined;
                if (!node.children) return node;
                return {
                  ...node,
                  children: node.children
                    .filter(
                      (child) =>
                        !(child.title === title && child.level === level)
                    )
                    .map((child) => removeNode(child, title, level)!)
                    .filter(Boolean),
                };
              }

              if (!prev) return { title: "", rows: [], children: [], level: 0 };
              const newTree = removeNode(
                prev,
                processValue.title,
                processValue.level ?? 0
              ) as ProcessValue;

              // Helper to find a node with the highest level (deepest node with children===undefined or empty)
              function findDeepestNode(
                node: ProcessValue | undefined
              ): ProcessValue | undefined {
                if (!node) return undefined;
                if (!node.children || node.children.length === 0) {
                  return node;
                }
                let deepest = node;
                let maxLevel = node.level || 0;
                for (const child of node.children) {
                  const candidate = findDeepestNode(child);
                  if (candidate && (candidate.level ?? 0) >= maxLevel) {
                    maxLevel = candidate.level ?? 0;
                    deepest = candidate;
                  }
                }
                return deepest;
              }

              // Make sure currentProcessObject is correct after removal
              setTimeout(() => {
                // We use setTimeout to ensure this runs *after* setOverallProcessObject completes React state update
                setCurrentProcessObject((current) => {
                  // If current was the one just removed, pick another
                  if (
                    current &&
                    current.title === processValue.title &&
                    current.level === processValue.level
                  ) {
                    const replacement = findDeepestNode(newTree);
                    return replacement ? { ...replacement } : undefined;
                  }
                  return current;
                });
              }, 0);

              return newTree;
            });
          }}
          rows={processValue.rows as unknown as Record<string, AnyType>[]}
          {...commonTableProps}
        />
        <Stack style={{ flexDirection: "column", gap: 15 }}>
          {processValue.children?.map((item) => (
            <Stack key={item.title}>{renderProcessTree(item)}</Stack>
          ))}
        </Stack>
      </Stack>
    );
  };

  const [loading, setLoading] = useState(false);
  const [lazyTables, setLazyTables] = useState<React.ReactNode[]>([]);
  const [currentProcessObject, setCurrentProcessObject] = useState<
    ProcessValue | undefined
  >(undefined);

  useEffect(() => {
    if (isOpen) {
      setCurrentProcessObject(overallProcessObject);
    }
  }, [isOpen]);

  /**
   * Finds and returns the nested ProcessValue object (with children)
   * by matching title and level within a process tree.
   * Returns undefined if not found.
   */
  function findProcessNodeByTitleAndLevel(
    node: ProcessValue | undefined,
    title: string,
    level: number
  ): ProcessValue | undefined {
    if (!node) return undefined;
    if (node.title === title && node.level === level) {
      return node;
    }
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        const result = findProcessNodeByTitleAndLevel(child, title, level);
        if (result) return result;
      }
    }
    return undefined;
  }

  // Generate tables whenever the modal is opened or dependencies change.
  useEffect(() => {
    if (!isOpen) {
      setLazyTables([]); // Reset tables if closed
      return;
    }
    setLoading(true);

    // Remove 'total' from options shown as individual tables
    const filteredValues = filterValueOptions.filter((v) => v !== "total");
    const accumulatedTables: React.ReactNode[] = [];

    // Process all tables in a single batch instead of recursively
    for (const value of filteredValues) {
      // Filter overviewData for rows with at least one subItem matching the filter value
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
      // Header for just this value/table
      const filteredHeader = sortedDataDisplayHeader.filter(
        (item) =>
          item[selectedFilter.header] === value ||
          item[commonTableProps.mappingValue] === "total"
      );

      const hasItemInTable = Object.keys(filteredOverviewData).some(
        (key) => currentProcessObject?.rows[0].sideHeader === key
      );

      if (
        hasItemInTable &&
        value !== currentProcessObject?.title &&
        !(
          findProcessNodeByTitleAndLevel(
            overallProcessObject,
            currentProcessObject?.title || "",
            currentProcessObject?.level || 0
          )?.children || []
        ).some((item) => item.title === value)
      ) {
        accumulatedTables.push(
          <ProcessDataTable
            key={value}
            id={value}
            title={value}
            overviewTableData={filteredOverviewData}
            sortedDataDisplayHeader={filteredHeader}
            rows={[]}
            onAddToProcess={(processValue) => {
              setOverallProcessObject((prev) => {
                if (!prev)
                  return { title: "", rows: [], children: [], level: 0 };
                // Recursively add processValue as a child of the node where title === currentProcessObject?.title
                function addChildToTitle(
                  node: ProcessValue,
                  targetTitle: string,
                  targetLevel: number,
                  childToAdd: ProcessValue
                ): ProcessValue {
                  if (
                    node.title === targetTitle &&
                    node.level === targetLevel
                  ) {
                    return {
                      ...node,
                      children: [...(node.children || []), childToAdd],
                    };
                  }
                  if (!node.children) return node;
                  return {
                    ...node,
                    children: node.children.map((child) =>
                      addChildToTitle(
                        child,
                        targetTitle,
                        targetLevel,
                        childToAdd
                      )
                    ),
                  };
                }
                return addChildToTitle(
                  prev,
                  currentProcessObject?.title || "",
                  currentProcessObject?.level || 0,
                  processValue
                );
              });
              setCurrentProcessObject(processValue);
            }}
            currentProcessObject={currentProcessObject}
            {...commonTableProps}
          />
        );
      }
    }

    setLazyTables(accumulatedTables);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, accumulatedTables.length * 200);

    return () => {
      clearTimeout(timeout);
    };
    // Only update when modal is opened, or the relevant dependencies change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpen,
    selectedFilter.header,
    overviewTableData,
    sortedDataDisplayHeader,
    commonTableProps,
    filterValueOptions,
    selectedFilter,
    commonTableProps.mappingValue,
    currentProcessObject,
  ]);

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
              <ExcelDownloadButton
                variant="contained"
                onClick={async () => {
                  // Let's build the processLevelObjects array with each item containing
                  // { title, parentTitle, sideHeader, height }, propagating heights from leaf to root.

                  function collectLevelsWithPaths(
                    node: any,
                    parentTitle: string | null = null,
                    level: number = 0,
                    path: string[] = [],
                    result: Record<
                      number,
                      Array<{
                        title: any;
                        parentTitle: string | null;
                        sideHeader: any;
                        nodeRef: any;
                        path: string[];
                        height?: number;
                      }>
                    > = {}
                  ) {
                    if (!node) return result;
                    const sideHeader =
                      node.rows && node.rows[0] && node.rows[0].sideHeader
                        ? node.rows[0].sideHeader
                        : undefined;
                    const nodePath = [...path, node.title];
                    if (!result[level]) result[level] = [];
                    result[level].push({
                      title: node.title,
                      parentTitle,
                      sideHeader,
                      nodeRef: node,
                      path: nodePath,
                    });
                    if (
                      Array.isArray(node.children) &&
                      node.children.length > 0
                    ) {
                      node.children.forEach((child: any) =>
                        collectLevelsWithPaths(
                          child,
                          node.title,
                          level + 1,
                          nodePath,
                          result
                        )
                      );
                    }
                    return result;
                  }

                  let levelsMap = overallProcessObject
                    ? collectLevelsWithPaths(overallProcessObject)
                    : {};

                  // Deepest-first numeric order (leaf-to-root)
                  const levelNumbers = Object.keys(levelsMap)
                    .map(Number)
                    .sort((a, b) => b - a);

                  // Fill blank cells for structural completeness
                  let blankCounter = 1;
                  for (let i = 1; i < levelNumbers.length; i++) {
                    const upperLevelNum = levelNumbers[i];
                    const lowerLevelNum = levelNumbers[i - 1];
                    const upperItems = levelsMap[upperLevelNum] || [];
                    const lowerItems = levelsMap[lowerLevelNum] || [];
                    for (const parent of upperItems) {
                      const childrenForParent = lowerItems.filter(
                        (child) => child.parentTitle === parent.title
                      );
                      if (childrenForParent.length === 0) {
                        const blankItem = {
                          title: `blank-${blankCounter++}`,
                          parentTitle: parent.title,
                          sideHeader: "blank",
                          nodeRef: undefined,
                          path: [
                            ...(parent.path || []),
                            `blank-${blankCounter - 1}`,
                          ],
                          height: undefined,
                        };
                        levelsMap[lowerLevelNum] = [
                          ...levelsMap[lowerLevelNum],
                          blankItem,
                        ];
                      }
                    }
                  }

                  // Assign leaf nodes height=1
                  if (levelNumbers.length > 0) {
                    const maxLevel = levelNumbers[0];
                    (levelsMap[maxLevel] || []).forEach((item) => {
                      item.height = 1;
                    });
                  }

                  // Propagate height up the tree
                  for (let i = 1; i < levelNumbers.length; i++) {
                    const currLevel = levelNumbers[i];
                    const lowerLevel = levelNumbers[i - 1];
                    const currentLevelItems = levelsMap[currLevel] || [];
                    const lowerLevelItems = levelsMap[lowerLevel] || [];
                    currentLevelItems.forEach((currItem) => {
                      const children = lowerLevelItems.filter(
                        (itm) => itm.parentTitle === currItem.title
                      );
                      if (children.length > 0) {
                        currItem.height = children.reduce(
                          (acc, child) => acc + (child.height || 1),
                          0
                        );
                      } else {
                        currItem.height = 1;
                      }
                    });
                  }

                  // Sort each level by parentTitle order, so columns align properly
                  const ascendingLevelNumbers = Object.keys(levelsMap)
                    .map(Number)
                    .sort((a, b) => a - b);
                  for (let i = 1; i < ascendingLevelNumbers.length; i++) {
                    const prevLevelNum = ascendingLevelNumbers[i - 1];
                    const thisLevelNum = ascendingLevelNumbers[i];
                    const prevTitles = (levelsMap[prevLevelNum] || []).map(
                      (item) => item.title
                    );
                    levelsMap[thisLevelNum].sort((a, b) => {
                      const aIdx = prevTitles.indexOf(a.parentTitle);
                      const bIdx = prevTitles.indexOf(b.parentTitle);
                      if (aIdx === bIdx) {
                        return String(a.title).localeCompare(String(b.title));
                      }
                      return aIdx - bIdx;
                    });
                  }

                  // Build array-of-columns (each level => column)
                  const processLevelObjects = ascendingLevelNumbers.map(
                    (levelNum) =>
                      (levelsMap[levelNum] || []).map(
                        ({ title, parentTitle, sideHeader, height }) => ({
                          title,
                          parentTitle,
                          sideHeader,
                          height,
                        })
                      )
                  );

                  // ==== EXCEL EXPORT w/ EXCELJS ====

                  // Use exceljs for export
                  // Only load dynamically if it's not already available (to avoid SSR issues)
                  const { Workbook } = await import("exceljs");
                  const saveAsImport = await import("file-saver");
                  const saveAs = saveAsImport.default || saveAsImport.saveAs;

                  // Compute total rows/columns as before
                  const deepestIndex = processLevelObjects.length - 1;
                  const totalRows = (
                    processLevelObjects[deepestIndex] || []
                  ).reduce((acc, node) => acc + (node.height || 1), 0);
                  const totalCols = processLevelObjects.length;

                  // Helper for cell background:
                  function getCellFillColor(sideHeader: string) {
                    return sideHeader === "blank" ? "FFFFFFFF" : "FFEDF6FE"; // with alpha for exceljs
                  }

                  // Build a grid as before to track placement
                  const grid: {
                    value: string;
                    rowspan: number;
                    fillColor: string;
                    isBlank: boolean;
                  }[][] = Array(totalRows)
                    .fill(null)
                    .map(() =>
                      Array(totalCols)
                        .fill(null)
                        .map(() => ({
                          value: "",
                          rowspan: 1,
                          fillColor: "FFEDF6FE",
                          isBlank: false,
                        }))
                    );

                  // For merging, we'll store [row, col, rowspan]
                  let merges: Array<{ r: number; c: number; rowspan: number }> =
                    [];

                  function placeCol(
                    col: number,
                    nodes: any[],
                    startRow: number
                  ) {
                    let curRow = startRow;
                    nodes.forEach((node) => {
                      grid[curRow][col] = {
                        value:
                          node.sideHeader === "blank"
                            ? ""
                            : node.sideHeader !== undefined
                            ? String(node.sideHeader)
                            : "",
                        rowspan: node.height || 1,
                        fillColor: getCellFillColor(node.sideHeader),
                        isBlank: node.sideHeader === "blank",
                      };
                      if ((node.height || 1) > 1) {
                        merges.push({
                          r: curRow,
                          c: col,
                          rowspan: node.height,
                        });
                      }
                      // Handle children
                      if (col + 1 < totalCols && processLevelObjects[col + 1]) {
                        const children = processLevelObjects[col + 1].filter(
                          (itm) => itm.parentTitle === node.title
                        );
                        placeCol(col + 1, children, curRow);
                      }
                      curRow += node.height || 1;
                    });
                  }

                  placeCol(0, processLevelObjects[0], 0);

                  // Create workbook/sheet
                  const workbook = new Workbook();
                  const worksheet = workbook.addWorksheet("Process Overview");

                  // Add blank rows, all cells as strings
                  for (let r = 0; r < totalRows; r++) {
                    const rowVals = [];
                    for (let c = 0; c < totalCols; c++) {
                      rowVals.push(grid[r][c]?.value ?? "");
                    }
                    worksheet.addRow(rowVals);
                  }

                  // Column widths
                  worksheet.columns.forEach((col) => {
                    col.width = 20;
                  });

                  // Apply styling: fill, border, wrap, alignment center, and empty value for 'blank' cells
                  // IMPORTANT: Apply borders BEFORE merging cells, otherwise borders may not appear
                  for (let r = 0; r < totalRows; r++) {
                    const row = worksheet.getRow(r + 1);
                    for (let c = 0; c < totalCols; c++) {
                      const cell = row.getCell(c + 1);
                      const cellData = grid[r][c];
                      // For blank cells, ensure value is empty string
                      if (cellData && cellData.isBlank) {
                        cell.value = "";
                      }
                      cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: cellData.fillColor.replace("#", "") },
                      };
                      // Set border for ALL cells (even if blank) - must be done before merging
                      cell.border = {
                        top: {
                          style: "thin",
                          color: { argb: "FFBBBBBB" },
                        },
                        left: {
                          style: "thin",
                          color: { argb: "FFBBBBBB" },
                        },
                        bottom: {
                          style: "thin",
                          color: { argb: "FFBBBBBB" },
                        },
                        right: {
                          style: "thin",
                          color: { argb: "FFBBBBBB" },
                        },
                      };
                      cell.alignment = {
                        vertical: "middle",
                        horizontal: "center",
                        wrapText: true,
                      };
                    }
                  }

                  // Apply merges for same-value cells (vertical merges) AFTER borders are set
                  merges.forEach(({ r, c, rowspan }) => {
                    if (rowspan > 1) {
                      worksheet.mergeCells(r + 1, c + 1, r + rowspan, c + 1); // exceljs is 1-based
                      // Re-apply border to merged cell to ensure it's visible
                      const mergedCell = worksheet.getCell(r + 1, c + 1);
                      mergedCell.border = {
                        top: {
                          style: "thin",
                          color: { argb: "FFBBBBBB" },
                        },
                        left: {
                          style: "thin",
                          color: { argb: "FFBBBBBB" },
                        },
                        bottom: {
                          style: "thin",
                          color: { argb: "FFBBBBBB" },
                        },
                        right: {
                          style: "thin",
                          color: { argb: "FFBBBBBB" },
                        },
                      };
                    }
                  });

                  // Save as Excel file
                  const buffer = await workbook.xlsx.writeBuffer();
                  const blob = new Blob([buffer], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  });
                  saveAs(blob, "ProcessOverview.xlsx");
                }}
              >
                Export
              </ExcelDownloadButton>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </ModalHeader>

          <ModalContentWrapper>
            <SelectedTableWrapper>
              {overallProcessObject && renderProcessTree(overallProcessObject)}
            </SelectedTableWrapper>

            <TablesWrapper>
              {loading ? (
                <LoaderContentWrapper>
                  <LoaderContent>
                    <LoaderText>Analysing, this may take a while...</LoaderText>
                    <StyledCircularProgress />
                  </LoaderContent>
                </LoaderContentWrapper>
              ) : lazyTables.length > 0 ? (
                lazyTables
              ) : (
                <LoaderContentWrapper>
                  <LoaderContent>
                    <Typography>No tables to display</Typography>
                  </LoaderContent>
                </LoaderContentWrapper>
              )}
            </TablesWrapper>
          </ModalContentWrapper>
        </ModalInnerContent>
      </ModalContent>
    </Modal>
  );
}
