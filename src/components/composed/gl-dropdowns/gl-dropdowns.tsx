import { Stack } from "@mui/material";
import { Dropdown, DropdownItem } from "../../ui-kit/dropdown/dropdown";
import { GlHeaders, CoaHeaders, SelectedHeaders } from "../../../types";

// Re-export types for backward compatibility
export type { GlHeaders, CoaHeaders, SelectedHeaders };

interface Props {
  glHeaderOptions: DropdownItem[];
  selectedHeaders: SelectedHeaders;
  onChangeGlHeader: (key: keyof GlHeaders, value: string) => void;
}

const GL_HEADER_FIELDS: Array<{
  label: string;
  key: keyof GlHeaders;
}> = [
    { label: "Account number", key: "account" },
    { label: "Journal entry number", key: "jen" },
    { label: "Date", key: "date" },
    { label: "Value", key: "value" },
  ];

export const GLDropdowns = ({
  glHeaderOptions,
  selectedHeaders,
  onChangeGlHeader,
}: Props) => (
  <Stack spacing={1}>
    {GL_HEADER_FIELDS.map(({ label, key }) => (
      <Dropdown
        key={key}
        label={label}
        items={glHeaderOptions}
        value={selectedHeaders.glHeaders[key]}
        onChange={(event) =>
          onChangeGlHeader(key, event.target.value as string)
        }
      />
    ))}
  </Stack>
);
