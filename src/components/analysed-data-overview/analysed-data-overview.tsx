import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styles } from "./analysed-data-overview.style";
import { useEffect, useMemo, useState } from "react";

import { Dropdown, DropdownItem } from "../ui-kit/dropdown/dropdown";
import { DataTable } from "./table/table";
import { Loader } from "../ui-kit/loader-overlay/loader-overlay";

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

  useEffect(() => {
    if (selectedFilter.header === "all") {
      setLoading(true);
      setLazyTables([
        <DataTable
          key="all"
          title="All items"
          mappingValue={mappingValue}
          overviewTableData={overviewTableData}
          selectedFilter={selectedFilter}
          setDataDisplayHeader={setDataDisplayHeader}
          sortedDataDisplayHeader={sortedDataDisplayHeader}
          valueKey={valueKey}
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

      const filteredHeader = sortedDataDisplayHeader.filter(
        (item) =>
          item[selectedFilter.header] === value ||
          item[mappingValue] === "total"
      );

      newTables.push(
        <DataTable
          key={value}
          id={value}
          title={value}
          mappingValue={mappingValue}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          overviewTableData={filteredOverviewData}
          selectedFilter={selectedFilter}
          setDataDisplayHeader={setDataDisplayHeader}
          sortedDataDisplayHeader={filteredHeader}
          valueKey={valueKey}
        />
      );

      setLazyTables([...newTables]);
      i++;

      setTimeout(renderNext, 0);
    };

    renderNext();
  }, [
    selectedFilter,
    filterValueOptions,
    overviewTableData,
    sortedDataDisplayHeader,
    selectedRow,
    mappingValue,
    valueKey,
    setDataDisplayHeader,
  ]);

  return (
    <Accordion
      style={{
        ...styles.accordionRoot,
        ...(disabled ? styles.disabled : {}),
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Loader loadingStatus={loading} />
        <Stack style={styles.summaryWrapper}>
          <Typography>{title}</Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
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
          </Stack>
        </Stack>

        <Stack style={styles.optionsWrapper}>
          <Grid2 container gap={1}>
            {selectedFilter.header !== "all"
              ? filterValueOptions?.map((item) => (
                  <Grid2>
                    <Button
                      href={`#${item}`}
                      variant="text"
                      style={styles.optionsBtn}
                    >
                      {item}
                    </Button>
                  </Grid2>
                ))
              : undefined}
          </Grid2>
        </Stack>
        <Stack style={styles.tablesStack}>{lazyTables}</Stack>
      </AccordionDetails>
    </Accordion>
  );
}
