/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import dynamic from "next/dynamic";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  useCallback,
} from "react";
import {
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  AccordionContent,
  AccordionHeaderStack,
  DropdownWrapperStack,
  StyledAccordionWrapper,
  TablesStack,
  SummaryWrapper,
  Title,
} from "./style";

import { Dropdown } from "../ui-kit/dropdown/dropdown";
import type { TableHeader } from "../../../types";
import { AnyType, DropdownItem } from "../../types";
import type { ProcessValue } from "./process-modal/types";
import { theme } from "@/constants/theme";

const DataTable = dynamic(
  () => import("./table/table").then((mod) => mod.DataTable),
  { ssr: false }
);

const ProcessModal = dynamic(
  () => import("./process-modal/process-modal").then((mod) => mod.ProcessModal),
  {
    ssr: false,
    loading: () => (
      <Modal open sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Stack
          sx={{
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius.sm,
            padding: "1rem 1.25rem",
          }}
        >
          <Typography color={theme.colors.black}>
            Opening process analysis. First open can take a minute in development.
          </Typography>
        </Stack>
      </Modal>
    ),
  }
);

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  hierarchyData: Record<string, AnyType>[];
  title: string;
  mappingValue: string;
  displayValue?: string;
  valueKey: string;
  coaHeaderOptions?: DropdownItem[];
  sortedDataDisplayHeader: Record<string, AnyType>[];
  disabled: boolean;
  overviewTableData: Record<string, AnyType>;
  setDataDisplayHeader: React.Dispatch<
    React.SetStateAction<Record<string, AnyType>[]>
  >;
  basicTableHeader: TableHeader[];
  basicTableData: Record<string, string>[];
}

interface Filters {
  header: string;
  value: string;
}

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const ALL = "all";
const TOTAL = "total";
const ALL_ITEMS = "All items";
const ACTIVE = "active";

/* ------------------------------------------------------------------ */
/* Helper: table factory                                              */
/* ------------------------------------------------------------------ */

function generateTables({
  selectedFilterHeader,
  selectedTable,
  overviewTableData,
  sortedDataDisplayHeader,
  filterValueOptions,
  mappingValue,
  commonTableProps,
}: {
  selectedFilterHeader: string;
  selectedTable: string;
  overviewTableData: Record<string, AnyType>;
  sortedDataDisplayHeader: Record<string, AnyType>[];
  filterValueOptions: string[];
  mappingValue: string;
  commonTableProps: any;
}) {
  // Single aggregated table
  if (selectedFilterHeader === ALL) {
    return [
      <DataTable
        key={ALL}
        title={ALL_ITEMS}
        overviewTableData={overviewTableData}
        sortedDataDisplayHeader={sortedDataDisplayHeader}
        {...commonTableProps}
      />,
    ];
  }

  const tables: React.ReactNode[] = [];

  for (const value of filterValueOptions.filter((v) => v !== TOTAL)) {
    const filteredOverviewData: Record<string, AnyType> = {};

    // Filter overview data by selected header value
    for (const mainKey of Object.keys(overviewTableData)) {
      const rows = overviewTableData[mainKey] as Record<string, AnyType>[];

      if (
        rows.some(
          (row) =>
            (row.coaData as Record<string, AnyType>)?.[selectedFilterHeader] ===
            value
        )
      ) {
        filteredOverviewData[mainKey] = overviewTableData[mainKey];
      }
    }

    const filteredHeader = sortedDataDisplayHeader.filter(
      (item) =>
        item[selectedFilterHeader] === value || item[mappingValue] === TOTAL
    );

    if (selectedTable === ALL || selectedTable === value) {
      tables.push(
        <DataTable
          key={value}
          id={value}
          title={value}
          overviewTableData={filteredOverviewData}
          sortedDataDisplayHeader={filteredHeader}
          selectedRows={[]}
          {...commonTableProps}
        />
      );
    }
  }

  // Ensure selected table is rendered first
  return tables.sort((a, b) => {
    if ((a as React.ReactElement)?.key === selectedTable) return -1;
    if ((b as React.ReactElement)?.key === selectedTable) return 1;
    return 0;
  });
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export function DataOverview({
  hierarchyData,
  title,
  mappingValue,
  displayValue,
  valueKey,
  overviewTableData,
  sortedDataDisplayHeader,
  disabled,
  coaHeaderOptions,
  basicTableData,
  basicTableHeader,
  setDataDisplayHeader,
}: Props) {
  /* ----------------------------- State ----------------------------- */

  const [selectedFilter, setSelectedFilters] = useState<Filters>({
    header: ALL,
    value: "",
  });

  const [selectedTable, setSelectedTable] = useState(ALL);
  const [groupingValue, setGroupingValue] = useState(
    displayValue || mappingValue
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [preparing, setPreparing] = useState(false);
  const [lazyTables, setLazyTables] = useState<React.ReactNode[]>([]);

  const [, transitionFunc] = useTransition();

  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [initialProcessObject, setInitialProcessObject] =
    useState<ProcessValue>();

  /* ----------------------------- Effects --------------------------- */

  // Keep grouping value in sync with selected filter
  useEffect(() => {
    setGroupingValue(
      selectedFilter.header !== ALL
        ? selectedFilter.header
        : displayValue || mappingValue
    );
    setSelectedTable(ALL);
  }, [selectedFilter, mappingValue, displayValue]);

  /* ----------------------------- Memo ------------------------------ */

  const filterValueOptions = useMemo<string[]>(() => {
    if (selectedFilter.header === ALL) return [];

    const values = sortedDataDisplayHeader
      .map((item) => item[selectedFilter.header])
      .filter(Boolean)
      .map(String);

    return Array.from(new Set(values));
  }, [selectedFilter.header, sortedDataDisplayHeader]);

  const canProcess = useMemo(() => {
    const getLevel = (value?: string) =>
      hierarchyData.find((item) => item.value === value)?.level as number;

    const displayLevel = getLevel(displayValue);
    const filterLevel = getLevel(selectedFilter.header);
    const groupingLevel = getLevel(groupingValue);

    const singleTable =
      selectedFilter.header === ALL || selectedTable !== ALL;
    const hasInactiveHeader =
      singleTable &&
      sortedDataDisplayHeader.some((item) => item.active === false);

    return (
      displayLevel <= filterLevel &&
      (hasInactiveHeader ? displayLevel <= groupingLevel : true)
    );
  }, [
    hierarchyData,
    displayValue,
    selectedFilter.header,
    selectedTable,
    groupingValue,
    sortedDataDisplayHeader,
  ]);

  const commonTableProps = useMemo(
    () => ({
      transitionFunc,
      mappingValue,
      groupingValue,
      selectedFilter,
      basicTableData,
      basicTableHeader,
      selectedTable,
      canProcess,
      setDataDisplayHeader,
      setIsProcessModalOpen,
      valueKey,
      setCurrentProcessObject: setInitialProcessObject,
    }),
    [
      transitionFunc,
      mappingValue,
      groupingValue,
      selectedFilter,
      basicTableData,
      basicTableHeader,
      selectedTable,
      canProcess,
      setDataDisplayHeader,
      valueKey,
    ]
  );

  const tooManyTables =
    selectedFilter.header !== ALL &&
    selectedTable === ALL &&
    filterValueOptions.length > 12;

  const tablesFactory = useCallback(
    () => {
      if (tooManyTables) return [];
      return generateTables({
        selectedFilterHeader: selectedFilter.header,
        selectedTable,
        overviewTableData,
        sortedDataDisplayHeader,
        filterValueOptions,
        mappingValue,
        commonTableProps,
      });
    },
    [
      tooManyTables,
      selectedFilter.header,
      selectedTable,
      overviewTableData,
      sortedDataDisplayHeader,
      filterValueOptions,
      mappingValue,
      commonTableProps,
    ]
  );

  /* ----------------------- Lazy table render ----------------------- */

  useEffect(() => {
    if (!panelOpen || preparing) return;
    panelRef.current?.scrollIntoView({ block: "nearest" });
  }, [panelOpen, preparing, lazyTables]);

  useEffect(() => {
    if (!panelOpen) return;
    setPreparing(true);
    const timeoutId = window.setTimeout(() => {
      setLazyTables(tablesFactory());
      setPreparing(false);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [panelOpen, tablesFactory]);

  /* ----------------------------- Render ---------------------------- */

  return (
    <>
      <StyledAccordionWrapper
        ref={panelRef}
        disabled={disabled}
        expanded={panelOpen}
        onChange={(_, expanded) => {
          setPanelOpen(expanded);
          if (expanded) setPreparing(true);
        }}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SummaryWrapper>
            <Title>{title}</Title>
          </SummaryWrapper>
        </AccordionSummary>

        <AccordionDetails>
          {preparing && (
            <Stack gap={0.75} sx={{ padding: "0.5rem 0 1rem" }}>
              <Typography color={theme.colors.medium}>
                Building the movement table
              </Typography>
              <LinearProgress
                sx={{
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: theme.colors.surface,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    backgroundColor: theme.colors.action,
                  },
                }}
              />
            </Stack>
          )}

          <AccordionContent>
            <AccordionHeaderStack>
              <DropdownWrapperStack>
                <Dropdown
                  label="Filter header"
                  items={[
                    { value: ALL, title: "All" },
                    ...(coaHeaderOptions || []),
                  ]}
                  value={selectedFilter.header}
                  onChange={(event) => {
                    setDataDisplayHeader((prev) =>
                      prev.map((item) => ({ ...item, active: true }))
                    );

                    const value = String(event.target.value);

                    setSelectedFilters({
                      header: value,
                      value,
                    });
                  }}
                />
              </DropdownWrapperStack>

              <DropdownWrapperStack>
                {selectedFilter.header !== ALL && (
                  <Dropdown
                    label="Grouping value"
                    items={Object.keys(sortedDataDisplayHeader[0])
                      .filter((key) => key !== ACTIVE)
                      .map((key) => ({
                        value: key,
                        title: key,
                      }))}
                    value={groupingValue}
                    onChange={(e) => setGroupingValue(e.target.value as string)}
                  />
                )}
              </DropdownWrapperStack>

              <DropdownWrapperStack>
                {selectedFilter.header !== ALL && (
                  <Dropdown
                    label="Display Table(s)"
                    items={[
                      { value: ALL, title: "All" },
                      ...filterValueOptions.map((item) => ({
                        value: item,
                        title: item,
                      })),
                    ]}
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(String(e.target.value))}
                  />
                )}
              </DropdownWrapperStack>
            </AccordionHeaderStack>
          </AccordionContent>

          <TablesStack>
            {tooManyTables && (
              <Typography color={theme.colors.medium}>
                {filterValueOptions.length.toLocaleString("en-US")} groups.
                Choose one in Display Table(s).
              </Typography>
            )}
            {lazyTables}
          </TablesStack>
        </AccordionDetails>
      </StyledAccordionWrapper>

      {isProcessModalOpen && (
      <ProcessModal
        isOpen={isProcessModalOpen}
        overviewTableData={overviewTableData}
        sortedDataDisplayHeader={sortedDataDisplayHeader}
        basicTableData={basicTableData}
        basicTableHeader={basicTableHeader}
        selectedFilter={selectedFilter}
        commonTableProps={commonTableProps}
        filterValueOptions={filterValueOptions}
        initialProcessObject={initialProcessObject}
        onClose={() => setIsProcessModalOpen(false)}
      />
      )}
    </>
  );
}
