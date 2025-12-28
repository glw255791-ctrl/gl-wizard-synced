import React from "react";
import { AccordionSummary, AccordionDetails, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { StyledAccordionWrapper, Title } from "../data-overview/style";
import { BasicTable, TableHeader } from "../composed/basic-table/basic-table";

interface Props {
  title: string;
  disabled: boolean;
  tableHeader: TableHeader[];
  tableData: Record<string, string>[];
  reversalReclassification?: boolean;
}

export const BasicDataOverview: React.FC<Props> = ({
  title,
  disabled,
  tableHeader,
  tableData,
  reversalReclassification,
}) => (
  <StyledAccordionWrapper disabled={disabled}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Title>{title}</Title>
    </AccordionSummary>
    <AccordionDetails>
      <Stack>
        <BasicTable
          header={tableHeader}
          data={tableData}
          reversalReclassification={reversalReclassification}
        />
      </Stack>
    </AccordionDetails>
  </StyledAccordionWrapper>
);
