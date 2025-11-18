import {
  Stack,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Checkbox,
} from "@mui/material";
import { colors } from "../../../assets/colors";

export interface DropdownItem {
  title: string;
  value: string;
}

export interface Props {
  items: DropdownItem[];
  label: string;
  value: string | string[];
  multiple?: boolean;
  onChange: (event: SelectChangeEvent<unknown>) => void;
}

export function Dropdown(props: Props) {
  const { items, label, value, multiple, onChange } = props;

  return (
    <Stack>
      <InputLabel
        style={{ textAlign: "left", fontSize: 14, color: colors.darker }}
      >
        {label}
      </InputLabel>
      <Select
        multiple={multiple}
        style={{
          height: 38,
          borderRadius: 8,
          backgroundColor: "white",
          color: colors.darker,
        }}
        sx={{
          "& .MuiSelect-select": {
            textAlign: "left",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.darker,
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200,
              maxWidth: 200,
            },
          },
        }}
        value={value}
        onChange={onChange}
        {...(multiple ? { renderValue: () => `${value.length} row(s)` } : {})}
      >
        {items.map(({ title, value: itemValue }, index) => (
          <MenuItem
            key={`dropdown-item-${index}-${title}`}
            value={itemValue}
            style={{ textAlign: "left", fontSize: 14 }}
          >
            {multiple && (
              <Checkbox checked={(value as string[]).includes(itemValue)} />
            )}
            {title}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}
