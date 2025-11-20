import { SelectChangeEvent, Checkbox } from "@mui/material";
import {
  DropdownContainer,
  StyledInputLabel,
  StyledSelect,
  StyledMenuItem,
} from "./style";

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
    <DropdownContainer>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledSelect
        multiple={multiple}
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
          <StyledMenuItem
            key={`dropdown-item-${index}-${title}`}
            value={itemValue}
          >
            {multiple && (
              <Checkbox checked={(value as string[]).includes(itemValue)} />
            )}
            {title}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </DropdownContainer>
  );
}
