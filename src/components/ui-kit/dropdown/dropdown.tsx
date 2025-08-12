import {
  Stack,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { colors } from "../../../assets/colors";

export interface DropdownItem {
  title: string;
  value: string;
}

export interface Props {
  items: DropdownItem[];
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<unknown>) => void;
}

export function Dropdown(props: Props) {
  const { items, label, value, onChange } = props;

  return (
    <Stack>
      <InputLabel
        style={{ textAlign: "left", fontSize: 14, color: colors.darker }}
      >
        {label}
      </InputLabel>
      <Select
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
      >
        {items.map(({ title, value }, index) => (
          <MenuItem
            key={`dropdown-item-${index}-${title}`}
            value={value}
            style={{ textAlign: "left", fontSize: 14 }}
          >
            {title}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}
