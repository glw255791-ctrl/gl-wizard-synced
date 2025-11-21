import React, {
  useEffect,
  useMemo,
  useState,
  useTransition,
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
  const [selectedHeaderRows, setSelectedHeaderRows] = useState<string[]>([]);
  const [lazyTables, setLazyTables] = useState<React.ReactNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [transition, transitionFunc] = useTransition();

  // Always keep mappingValue included in header rows
  useEffect(() => {
    const row = [mappingValue]
    if (selectedFilter.header !== 'all') {
      row.push(selectedFilter.header)
    }
    setSelectedHeaderRows(row);
  }, [selectedFilter, mappingValue]);



  // Compute filter value options for dropdown
  const filterValueOptions = useMemo<string[]>(() => {
    if (selectedFilter.header === "all") return [];
    const values = sortedDataDisplayHeader
      .map(item => item[selectedFilter.header])
      .filter(Boolean)
      .map(item => String(item));
    return Array.from(new Set(values));
  }, [selectedFilter.header, sortedDataDisplayHeader]);

  // Compute table header structure based on selected header rows
  const filteredSortedDataDisplayHeader: Record<string, AnyType>[] = useMemo(
    () =>
      sortedDataDisplayHeader.map(item =>
        selectedHeaderRows.reduce(
          (acc, curr) => ({ ...acc, [curr]: item[curr] }),
          { active: item.active },
        )
      ),
    [selectedHeaderRows, sortedDataDisplayHeader]
  );

  // Generate table(s) each time selection changes
  useEffect(() => {
    const commonTableProps = {
      transitionFunc,
      mappingValue,
      selectedFilter,
      basicTableData,
      basicTableHeader,
      setDataDisplayHeader,
      valueKey,
      dictionaryData
    };

    if (selectedFilter.header === "all") {
      setLoading(true);
      setLazyTables([
        <DataTable
          key="all"
          title="All items"
          overviewTableData={overviewTableData}
          sortedDataDisplayHeader={filteredSortedDataDisplayHeader}
          {...commonTableProps}
        />,
      ]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Remove 'total' from options shown as individual tables
    const filteredValues = filterValueOptions.filter(v => v !== "total");
    let idx = 0;
    const accumulatedTables: React.ReactNode[] = [];

    const renderNextTable = () => {
      if (idx >= filteredValues.length) {
        setLoading(false);
        return;
      }

      const value = filteredValues[idx];
      // Filter overviewData for rows with at least one subItem matching the filter value
      const filteredOverviewData: Record<string, AnyType> = {};
      for (const mainKey of Object.keys(overviewTableData)) {
        const subArray = overviewTableData[mainKey] as Record<string, AnyType>[];
        if (
          subArray.some(
            subItem =>
              (subItem.coaData as Record<string, AnyType>)?.[
              selectedFilter.header
              ] === value
          )
        ) {
          filteredOverviewData[mainKey] = overviewTableData[mainKey];
        }
      }
      // Header for just this value/table
      const filteredHeader = filteredSortedDataDisplayHeader.filter(
        item =>
          item[selectedFilter.header] === value ||
          item[mappingValue] === "total"
      );


      const hasItemInTable = [...new Set(Object.keys(filteredOverviewData).join('/').split('/'))].includes(selectedTable)

      if ((selectedTable === "all" || hasItemInTable)) {
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

      setLazyTables([
        ...accumulatedTables
      ].sort((a, b) => {
        // Handle possible null/undefined and ensure a & b are ReactElements with a 'key'
        const aKey = (a as React.ReactElement)?.key;
        const bKey = (b as React.ReactElement)?.key;

        // Sort: if a's key === selectedTable, move 'a' to the front
        if (aKey === selectedTable) return -1;
        if (bKey === selectedTable) return 1;
        return 0;
      }));

      idx += 1;
      setTimeout(renderNextTable, 0);
    };

    renderNextTable();
  }, [
    selectedTable,
    selectedFilter,
    filterValueOptions,
    overviewTableData,
    filteredSortedDataDisplayHeader,
    mappingValue,
    valueKey,
    setDataDisplayHeader,
    basicTableData,
    basicTableHeader,
  ]);

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
                onChange={event => {
                  setDataDisplayHeader(prev =>
                    prev.map(item => ({ ...item, active: true }))
                  );
                  setSelectedFilters(prev => ({
                    ...prev,
                    header: String(event.target.value),
                  }));
                }}
              />
            </Stack>
            {/* Header rows dropdown */}
            <Stack style={styles.dropdownWrapper}>
              <Dropdown
                multiple
                items={Object.keys(sortedDataDisplayHeader[0])
                  .filter(key => key !== "active")
                  .map(key => ({
                    value: key,
                    title: key,
                  }))
                }
                value={selectedHeaderRows}
                onChange={e => {
                  const val = e.target.value as string[];
                  setSelectedHeaderRows(
                    !val.includes(mappingValue) ? [...val, mappingValue] : val
                  );
                }}
                label="Header rows"
              />
            </Stack>
            {/* Display Table(s) dropdown (only when filtering by a header) */}
            <Stack style={styles.dropdownWrapper}>
              {selectedFilter.header !== "all" && (
                <Dropdown
                  label="Display Table(s)"
                  items={[
                    { value: "all", title: "All" },
                    ...filterValueOptions.map(item => ({
                      value: item,
                      title: item,
                    })),
                  ]}
                  value={selectedTable}
                  onChange={event => {
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
