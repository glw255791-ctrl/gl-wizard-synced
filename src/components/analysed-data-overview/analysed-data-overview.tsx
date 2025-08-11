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
  const [transition, transitionFunc] = useTransition();

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
          sortedDataDisplayHeader={sortedDataDisplayHeader}
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
    selectedFilter,
    filterValueOptions,
    overviewTableData,
    sortedDataDisplayHeader,
    selectedRow,
    mappingValue,
    valueKey,
    setDataDisplayHeader,
    basicTableData,
    basicTableHeader,
  ]);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 1000) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <Accordion
      style={{
        ...styles.accordionRoot,
        ...(disabled ? styles.disabled : {}),
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack style={styles.summaryWrapper}>
          <Typography>{title}</Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Loader loadingStatus={loading || transition} />
        {visible && visible && (
          <Button variant="contained" href="#top" style={styles.topBtn}>
            Back to top
          </Button>
        )}
        <Stack style={styles.accordionContent}>
          <Stack style={styles.accordionHeader} id="top">
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
