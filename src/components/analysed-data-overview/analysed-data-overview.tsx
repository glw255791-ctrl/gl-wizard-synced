import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styles } from "./analysed-data-overview.style";
import { useEffect, useMemo, useState, useTransition } from "react";

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
}

interface Filters {
  header: string;
  value: string;
}

export function DataOverview(props: Props) {
  const {
    title,
    mappingValue,
    valueKey,
    overviewTableData,
    sortedDataDisplayHeader,
    disabled,
    coaHeaderOptions,
    basicTableData,
    basicTableHeader,
    setDataDisplayHeader,
  } = props;

  const [selectedFilter, setSelectedFilters] = useState<Filters>({
    header: "all",
    value: "",
  });

  const [selectedRow, setSelectedRow] = useState<string>("");
  const [lazyTables, setLazyTables] = useState<React.ReactNode[]>([]);

  // Extract unique values for selected filter
  const filterValueOptions = useMemo(() => {
    if (selectedFilter.header === "all") return [];

    const values = sortedDataDisplayHeader
      .map((item) => item[selectedFilter.header])
      .filter(Boolean)
      .map((item) => String(item));

    return Array.from(new Set(values));
  }, [selectedFilter.header, sortedDataDisplayHeader]);

  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState("all");
  const [transition, transitionFunc] = useTransition();

  const [selectedHeaderRows, setSelectedHederRows] = useState<string[]>([]);

  useEffect(() => {
    setSelectedHederRows([mappingValue]);
  }, [mappingValue]);

  const filteredSortedDataDisplayHeader: Record<string, AnyType>[] = useMemo(
    () =>
      sortedDataDisplayHeader.map((item) =>
        selectedHeaderRows.reduce(
          (prev, curr) => ({ ...prev, [curr]: item[curr] }),
          { active: item.active }
        )
      ),
    [selectedHeaderRows, sortedDataDisplayHeader]
  );

  useEffect(() => {
    const commonProps = {
      transitionFunc,
      mappingValue,
      selectedFilter,
      basicTableData,
      basicTableHeader,
      setDataDisplayHeader,
      valueKey,
    };

    if (selectedFilter.header === "all") {
      setLoading(true);
      setLazyTables([
        <DataTable
          key="all"
          title="All items"
          overviewTableData={overviewTableData}
          sortedDataDisplayHeader={filteredSortedDataDisplayHeader}
          {...commonProps}
        />,
      ]);
      setLoading(false);
      return;
    }

    setLoading(true); // start loading

    const filtered = filterValueOptions.filter((v) => v !== "total");
    let i = 0;
    const newTables: React.ReactNode[] = [];

    const renderNext = () => {
      if (i >= filtered.length) {
        setLoading(false); // all tables done
        return;
      }

      const value = filtered[i];
      const filteredOverviewData: Record<string, AnyType> = {};

      for (const key of Object.keys(overviewTableData)) {
        const subArray = overviewTableData[key] as Record<string, AnyType>[];
        if (
          subArray.find(
            (subItem) =>
              (subItem.coaData as Record<string, AnyType>)?.[
                selectedFilter.header
              ] === value
          )
        ) {
          filteredOverviewData[key] = overviewTableData[key];
        }
      }

      const filteredHeader = filteredSortedDataDisplayHeader.filter(
        (item) =>
          item[selectedFilter.header] === value ||
          item[mappingValue] === "total"
      );

      if (selectedTable === "all" || selectedTable === value)
        newTables.push(
          <DataTable
            key={value}
            id={value}
            title={value}
            overviewTableData={filteredOverviewData}
            sortedDataDisplayHeader={filteredHeader}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            {...commonProps}
          />
        );

      setLazyTables([...newTables]);
      i++;

      setTimeout(renderNext, 0);
    };

    renderNext();
  }, [
    selectedTable,
    selectedFilter,
    filterValueOptions,
    overviewTableData,
    filteredSortedDataDisplayHeader,
    selectedRow,
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
        <Stack style={styles.summaryWrapper}>
          <Typography style={{ fontWeight: "bold" }}>{title}</Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Loader loadingStatus={loading || transition} />

        <Stack style={styles.accordionContent}>
          <Stack style={styles.accordionHeader}>
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
                  }));
                }}
              />
            </Stack>

            <Stack style={styles.dropdownWrapper}>
              <Dropdown
                multiple
                items={Object.keys(sortedDataDisplayHeader[0])
                  .filter((item) => item !== "active")
                  .map((item) => ({
                    value: item,
                    title: item,
                  }))}
                value={selectedHeaderRows}
                onChange={(e) => {
                  const val = e.target.value as string[];
                  setSelectedHederRows(
                    !val.includes(mappingValue) ? [...val, mappingValue] : val
                  );
                }}
                label="Header rows"
              />
            </Stack>
            <Stack style={styles.dropdownWrapper}>
              {selectedFilter.header !== "all" ? (
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
              ) : undefined}
            </Stack>
          </Stack>
        </Stack>

        <Stack style={styles.tablesStack}>{lazyTables}</Stack>
      </AccordionDetails>
    </Accordion>
  );
}
