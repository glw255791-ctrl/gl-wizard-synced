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
import { useMemo, useState } from "react";

import { Dropdown, DropdownItem } from "../ui-kit/dropdown/dropdown";
import { DataTable } from "./table/table";

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

  const filterValueOptions = useMemo(
    () => [
      ...new Set(
        sortedDataDisplayHeader
          .map((item) => item[selectedFilter.header])
          .filter(Boolean)
          .map((item) => String(item))
      ),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFilter.header]
  );

  const filteredByValueOverviewTableData = (value: string) => {
    const obj: Record<string, AnyType> = {};

    Object.keys(overviewTableData).map((item) => {
      if (
        (overviewTableData[item] as Record<string, AnyType>[]).find(
          (subItem) =>
            (subItem.coaData as Record<string, AnyType>)?.[
              selectedFilter.header
            ] === value
        )
      )
        obj[item] = overviewTableData[item];
    });

    return obj;
  };
  return (
    <Accordion
      style={{ ...styles.accordionRoot, ...(disabled ? styles.disabled : {}) }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
        <Grid2 container>
          {selectedFilter.header !== "all"
            ? filterValueOptions?.map((item) => (
                <Grid2>
                  <Button
                    href={`#${item}`}
                    variant="text"
                    style={{ padding: 0, fontSize: 11 }}
                  >
                    {item}
                  </Button>
                </Grid2>
              ))
            : undefined}
        </Grid2>
        {selectedFilter.header !== "all" ? (
          <Stack style={styles.tablesStack}>
            {filterValueOptions.map((value) => {
              return value === "total" ? undefined : (
                <DataTable
                  id={value}
                  title={value}
                  mappingValue={mappingValue}
                  selectedRow={selectedRow}
                  setSelectedRow={setSelectedRow}
                  overviewTableData={filteredByValueOverviewTableData(value)}
                  selectedFilter={selectedFilter}
                  setDataDisplayHeader={setDataDisplayHeader}
                  sortedDataDisplayHeader={sortedDataDisplayHeader.filter(
                    (item) =>
                      item[selectedFilter.header] === value ||
                      item[mappingValue] === "total"
                  )}
                  valueKey={valueKey}
                />
              );
            })}
          </Stack>
        ) : (
          <DataTable
            title={"All items"}
            mappingValue={mappingValue}
            overviewTableData={overviewTableData}
            selectedFilter={selectedFilter}
            setDataDisplayHeader={setDataDisplayHeader}
            sortedDataDisplayHeader={sortedDataDisplayHeader}
            valueKey={valueKey}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
}
