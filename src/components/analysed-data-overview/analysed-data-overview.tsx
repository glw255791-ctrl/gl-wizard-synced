import React, {
  useEffect,
  useMemo,
  useState,
  useTransition,
  useCallback,
} from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionContent, styles, SummaryWrapper, Title } from "./style";
import { Dropdown, DropdownItem } from "../ui-kit/dropdown/dropdown";
import { DataTable } from "./table/table";
import { Loader } from "../ui-kit/loader-overlay/loader-overlay";
import { TableHeader } from "../composed/basic-table/basic-table";

type AnyType = string | number | boolean | object;

interface Props {
  title: string;
  mappingValue: string;
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
  dictionaryData: Record<string, any>[];
}

interface Filters {
  header: string;
  value: string;
}

export function DataOverview({
  title,
  mappingValue,
  valueKey,
  overviewTableData,
  sortedDataDisplayHeader,
  disabled,
  coaHeaderOptions,
  basicTableData,
  dictionaryData,
  basicTableHeader,
  setDataDisplayHeader,
}: Props) {
  const [selectedFilter, setSelectedFilters] = useState<Filters>({
    header: "all",
    value: "",
  });
  const [selectedTable, setSelectedTable] = useState("all");
  const [groupingValue, setGroupingValue] = useState<string>(mappingValue);
  const [lazyTables, setLazyTables] = useState<React.ReactNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [transition, transitionFunc] = useTransition();

  // Always keep mappingValue included in header rows
  useEffect(() => {
    setGroupingValue(
      selectedFilter.header !== "all" ? selectedFilter.value : mappingValue
    );
  }, [selectedFilter, mappingValue, selectedFilter.header]);

  // Compute filter value options for dropdown
  const filterValueOptions = useMemo<string[]>(() => {
    if (selectedFilter.header === "all") return [];
    const values = sortedDataDisplayHeader
      .map((item) => item[selectedFilter.header])
      .filter(Boolean)
      .map((item) => String(item));
    return Array.from(new Set(values));
  }, [selectedFilter.header, sortedDataDisplayHeader]);

  // Memoize common table props to prevent unnecessary re-renders
  const commonTableProps = useMemo(
    () => ({
      transitionFunc,
      mappingValue,
      groupingValue,
      selectedFilter,
      basicTableData,
      basicTableHeader,
      setDataDisplayHeader,
      valueKey,
      dictionaryData,
    }),
    [
      transitionFunc,
      groupingValue,
      mappingValue,
      selectedFilter,
      basicTableData,
      basicTableHeader,
      setDataDisplayHeader,
      valueKey,
      dictionaryData,
    ]
  );

  // Memoize the table generation logic
  const generateTables = useCallback(() => {
    if (selectedFilter.header === "all") {
      return [
        <DataTable
          key="all"
          title="All items"
          overviewTableData={overviewTableData}
          sortedDataDisplayHeader={sortedDataDisplayHeader}
          {...commonTableProps}
        />,
      ];
    }

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
          item[mappingValue] === "total"
      );

      const hasItemInTable = [
        ...new Set(Object.keys(filteredOverviewData).join("/").split("/")),
      ].includes(selectedTable);

      if (
        selectedTable === "all" ||
        selectedTable === value ||
        hasItemInTable
      ) {
        accumulatedTables.push(
          <DataTable
            key={value}
            id={value}
            title={value}
            overviewTableData={filteredOverviewData}
            sortedDataDisplayHeader={filteredHeader}
            selectedRow={value === selectedTable ? undefined : selectedTable}
            {...commonTableProps}
          />
        );
      }
    }

    // Sort once at the end instead of on every iteration
    return accumulatedTables.sort((a, b) => {
      const aKey = (a as React.ReactElement)?.key;
      const bKey = (b as React.ReactElement)?.key;
      if (aKey === selectedTable) return -1;
      if (bKey === selectedTable) return 1;
      return 0;
    });
  }, [
    selectedFilter.header,
    overviewTableData,
    sortedDataDisplayHeader,
    commonTableProps,
    filterValueOptions,
    selectedFilter,
    mappingValue,
    selectedTable,
  ]);

  // Generate table(s) each time selection changes - using requestAnimationFrame for better performance
  useEffect(() => {
    setLoading(true);

    // Use requestAnimationFrame to batch the work and prevent blocking
    const rafId = requestAnimationFrame(() => {
      const tables = generateTables();
      setLazyTables(tables);
      setTimeout(() => {
        setLoading(false);
      }, tables.length * 100);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [generateTables]);

  return (
    <Accordion
      style={{
        ...styles.accordionRoot,
        ...(disabled ? styles.disabled : {}),
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <SummaryWrapper>
          <Title>{title}</Title>
        </SummaryWrapper>
      </AccordionSummary>

      <AccordionDetails>
        <Loader loadingStatus={loading || transition} />
        <AccordionContent>
          <Stack style={styles.accordionHeader}>
            {/* Filter header dropdown */}
            <Stack style={styles.dropdownWrapper}>
              <Dropdown
                label="Filter header"
                items={[
                  { value: "all", title: "All" },
                  ...(coaHeaderOptions || []),
                ]}
                value={selectedFilter.header}
                onChange={(event) => {
                  setDataDisplayHeader((prev) =>
                    prev.map((item) => ({ ...item, active: true }))
                  );
                  setSelectedFilters((prev) => ({
                    ...prev,
                    header: String(event.target.value),
                    value: String(event.target.value),
                  }));
                }}
              />
            </Stack>
            {/* Header rows dropdown */}
            <Stack style={styles.dropdownWrapper}>
              {selectedFilter.header !== "all" && (
                <Dropdown
                  items={Object.keys(sortedDataDisplayHeader[0])
                    .filter((key) => key !== "active")
                    .map((key) => ({
                      value: key,
                      title: key,
                    }))}
                  value={groupingValue}
                  onChange={(e) => {
                    const val = e.target.value as string;
                    setGroupingValue(val);
                  }}
                  label="Grouping value"
                />
              )}
            </Stack>
            {/* Display Table(s) dropdown (only when filtering by a header) */}
            <Stack style={styles.dropdownWrapper}>
              {selectedFilter.header !== "all" && (
                <Dropdown
                  label="Display Table(s)"
                  items={[
                    { value: "all", title: "All" },
                    ...filterValueOptions.map((item) => ({
                      value: item,
                      title: item,
                    })),
                  ]}
                  value={selectedTable}
                  onChange={(event) => {
                    setSelectedTable(String(event.target.value));
                  }}
                />
              )}
            </Stack>
          </Stack>
        </AccordionContent>
        <Stack style={styles.tablesStack}>{lazyTables}</Stack>
      </AccordionDetails>
    </Accordion>
  );
}
