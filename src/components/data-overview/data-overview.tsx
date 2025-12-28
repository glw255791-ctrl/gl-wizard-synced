/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useEffect,
  useMemo,
  useState,
  useTransition,
  useCallback,
} from "react";
import { AccordionDetails, AccordionSummary } from "@mui/material";
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
import { DataTable } from "./table/table";
import { Loader } from "../ui-kit/loader-overlay/loader-overlay";
import { TableHeader } from "../composed/basic-table/basic-table";
import { AnyType, DropdownItem } from "../../types";
import { ProcessValue } from "./process-modal/types";
import { ProcessModal } from "./process-modal/process-modal";

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
  const [groupingValue, setGroupingValue] = useState(mappingValue);
  const [lazyTables, setLazyTables] = useState<React.ReactNode[]>([]);
  const [loading, setLoading] = useState(false);

  const [transition, transitionFunc] = useTransition();

  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [initialProcessObject, setInitialProcessObject] =
    useState<ProcessValue>();

  /* ----------------------------- Effects --------------------------- */

  // Keep grouping value in sync with selected filter
  useEffect(() => {
    setGroupingValue(
      selectedFilter.header !== ALL ? selectedFilter.value : mappingValue
    );
    setSelectedTable(ALL);
  }, [selectedFilter, mappingValue]);

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

    const hasInactiveHeader =
      lazyTables.length === 1 &&
      (lazyTables as any[])[0].props.sortedDataDisplayHeader.some(
        (it: any) => it.active === false
      );

    return (
      displayLevel <= filterLevel &&
      (hasInactiveHeader ? displayLevel <= groupingLevel : true)
    );
  }, [
    hierarchyData,
    displayValue,
    selectedFilter.header,
    groupingValue,
    lazyTables,
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

  const tablesFactory = useCallback(
    () =>
      generateTables({
        selectedFilterHeader: selectedFilter.header,
        selectedTable,
        overviewTableData,
        sortedDataDisplayHeader,
        filterValueOptions,
        mappingValue,
        commonTableProps,
      }),
    [
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
    setLoading(true);

    const rafId = requestAnimationFrame(() => {
      const tables = tablesFactory();
      setLazyTables(tables);

      setTimeout(() => {
        setLoading(false);
      }, tables.length * 100);
    });

    return () => cancelAnimationFrame(rafId);
  }, [tablesFactory]);

  /* ----------------------------- Render ---------------------------- */

  return (
    <>
      <StyledAccordionWrapper disabled={disabled}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SummaryWrapper>
            <Title>{title}</Title>
          </SummaryWrapper>
        </AccordionSummary>

        <AccordionDetails>
          <Loader loadingStatus={loading || transition} />

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

          <TablesStack>{lazyTables}</TablesStack>
        </AccordionDetails>
      </StyledAccordionWrapper>

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
    </>
  );
}
