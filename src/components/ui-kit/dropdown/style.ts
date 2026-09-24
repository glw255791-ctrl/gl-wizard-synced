import { styled, Stack, InputLabel, Select, MenuItem } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { theme } from "../../../constants/theme";

// Container for the dropdown
export const DropdownContainer = styled(Stack)({});

// Styled label for the dropdown
export const StyledInputLabel = styled(InputLabel)({
  textAlign: "left",
  fontSize: theme.fontSize.lg,
  color: theme.colors.deepTeal,
});

// Styled select component
export const StyledSelect = styled(Select)({
  height: theme.height.input,
  borderRadius: theme.borderRadius.sm,
  backgroundColor: theme.colors.cleanWhite,
  color: theme.colors.graphite,
  "& .MuiSelect-select": {
    textAlign: "left",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.colors.softBlue,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.colors.freshBlue,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.colors.deepTeal,
  },
  "& .MuiSvgIcon-root": {
    color: theme.colors.deepTeal,
  },
});

export const LabelWithInfoIcon = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.gap.sm,
});

export const StyledInfoIcon = styled(InfoOutlinedIcon)({
  fontSize: theme.fontSize.lg,
  color: theme.colors.freshBlue,
});

// Styled menu item
export const StyledMenuItem = styled(MenuItem)({
  textAlign: "left",
  fontSize: theme.fontSize.lg,
  color: theme.colors.graphite,
});
