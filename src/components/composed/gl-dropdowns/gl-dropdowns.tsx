import { Stack } from "@mui/material";
import { Dropdown, DropdownItem } from "../../ui-kit/dropdown/dropdown";

export interface GlHeaders {
  account: string;
  jen: string;
  date: string;
  value: string;
}

export interface CoaHeaders {
  mappingValue: string;
  displayValue: string;
  groupingValue: string;
}

export interface SelectedHeaders {
  glHeaders: GlHeaders;
  coaHeaders: CoaHeaders;
}

interface Props {
  glHeaderOptions: DropdownItem[];
  selectedHeaders: SelectedHeaders;
  onChangeGlHeader: (key: keyof GlHeaders, value: string) => void;
}

export const GLDropdowns = (props: Props) => {
  const { glHeaderOptions, selectedHeaders, onChangeGlHeader } = props;
  return (
    <Stack spacing={1}>
      <Dropdown
        label="Account number"
        items={glHeaderOptions}
        value={selectedHeaders.glHeaders.account}
        onChange={(event) =>
          onChangeGlHeader("account", event.target.value as string)
        }
      />
      <Dropdown
        label="Journal entry number"
        items={glHeaderOptions}
        value={selectedHeaders.glHeaders.jen}
        onChange={(event) =>
          onChangeGlHeader("jen", event.target.value as string)
        }
      />
      <Dropdown
        label="Date"
        items={glHeaderOptions}
        value={selectedHeaders.glHeaders.date}
        onChange={(event) =>
          onChangeGlHeader("date", event.target.value as string)
        }
      />
      <Dropdown
        label="Value"
        items={glHeaderOptions}
        value={selectedHeaders.glHeaders.value}
        onChange={(event) =>
          onChangeGlHeader("value", event.target.value as string)
        }
      />
    </Stack>
  );
};
