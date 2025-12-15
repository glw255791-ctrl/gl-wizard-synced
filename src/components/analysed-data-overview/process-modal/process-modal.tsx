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
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnyType } from "../../../types";
import { ProcessDataTable } from "./process-table";
import { TableHeader } from "../../composed/basic-table/basic-table";
import { ProcessValue } from "../analysed-data-overview";
import { buildTree, Node, exportTreeToExcel } from "./process-modal-funcs";
import { getElipsis } from "../table/functions";

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
  } = props;

  const [overallProcessObject, setOverallProcessObject] = useState<
    ProcessValue[]
  >([]);

  const [searchByObject, setSearchByObject] = useState<
    SearchByObject | undefined
  >(undefined);

  // Recursive component to render ProcessValue tree structure
  const renderProcessTree = (): React.ReactNode => {
    const tree = buildTree(overallProcessObject);
    console.log(tree);
    const renderTree = (node: Node) => {
      return (
        <Stack style={{ flexDirection: "row", gap: 15 }}>
          <ProcessDataTable
            key={`${node.title}-${node.level}`}
            id={`${node.title}-${node.level}`}
            title={node.title}
            rows={node.rows}
            isTopTable={true}
            level={node.level}
            overallProcessObject={overallProcessObject}
            removeFromProcess={handleRemoveFromProcess}
            setSearchByObject={(searchByObject: SearchByObject) => {
              if (searchByObject) {
                setSearchByObject(searchByObject);
              }
            }}
            {...commonTableProps}
          />
          <Stack style={{ flexDirection: "column", gap: 10 }}>
            {node.children.map((child) => renderTree(child))}
          </Stack>
        </Stack>
      );
    };

    return renderTree(tree);
  };

  const [loading, setLoading] = useState(false);
  const [lazyTablesData, setLazyTablesData] = useState<TableData[]>([]);

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
        const newTable = {
          ...foundTable,
          rows: [...foundTable.rows, ...processValue.rows],
          parent: searchByObject,
        };

        return [...restTables, newTable];
      });
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 400);
    },
    [searchByObject]
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
      return [...restTables, newTable];
    });
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  // Render tables from data, always using current overallProcessObject
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
  }, [
    lazyTablesData,
    overallProcessObject,
    handleAddToProcess,
    handleRemoveFromProcess,
    commonTableProps,
  ]);

  // Generate table data whenever the modal is opened or dependencies change.
  useEffect(() => {
    if (!isOpen) {
      setLazyTablesData([]); // Reset tables if closed
      setOverallProcessObject([]);
      setSearchByObject(undefined);
      return;
    }
    setLoading(true);

    // Remove 'total' from options shown as individual tables
    const filteredValues = filterValueOptions.filter((v) => v !== "total");
    const accumulatedTablesData: TableData[] = [];

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
          (key) => searchByObject?.value === key
        );

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
    setLazyTablesData(accumulatedTablesData);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, accumulatedTablesData.length * 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    isOpen,
    selectedFilter.header,
    overviewTableData,
    sortedDataDisplayHeader,
    commonTableProps,
    filterValueOptions,
    selectedFilter,
    commonTableProps.mappingValue,
    searchByObject,
    initialProcessObject,
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
                onClick={() =>
                  exportTreeToExcel(
                    buildTree(overallProcessObject),
                    "process.xlsx"
                  )
                }
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
                {loading ? (
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
                {loading ? (
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
