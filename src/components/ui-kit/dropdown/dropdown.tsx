import { SelectChangeEvent, Checkbox, Tooltip } from "@mui/material";
import {
  DropdownContainer,
  StyledInputLabel,
  StyledSelect,
  StyledMenuItem,
  LabelWithInfoIcon,
  StyledInfoIcon,
} from "./style";
import { DropdownItem } from "../../../types/index";

// Re-export type for backward compatibility
export type { DropdownItem };

export interface Props {
  items: DropdownItem[];
  label: string;
  value: string | string[];
  multiple?: boolean;
  tooltip?: string;
  onChange: (event: SelectChangeEvent<unknown>) => void;
}

export function Dropdown(props: Props) {
  const { items, label, value, multiple, onChange, tooltip } = props;

  return (
    <DropdownContainer>
      <LabelWithInfoIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        {tooltip && (
          <Tooltip title={tooltip} placement="right-start">
            <StyledInfoIcon />
          </Tooltip>
        )}
      </LabelWithInfoIcon>
      <StyledSelect
        multiple={multiple}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            style: {
              maxHeight: 200,
              maxWidth: 200,
            },
          },
        }}
        value={value}
        onChange={onChange}
        {...(multiple ? { renderValue: () => `${value.length} item(s)` } : {})}
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
