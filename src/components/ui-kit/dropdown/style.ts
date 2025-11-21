import { styled, Stack, InputLabel, Select, MenuItem } from "@mui/material";
import { colors } from "../../../assets/colors";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Container for the dropdown
export const DropdownContainer = styled(Stack)({});

// Styled label for the dropdown
export const StyledInputLabel = styled(InputLabel)({
    textAlign: "left",
    fontSize: 14,
    color: colors.darker,
});

// Styled select component
export const StyledSelect = styled(Select)({
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.white,
    color: colors.darker,
    "& .MuiSelect-select": {
        textAlign: "left",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.darker,
    },
});

export const LabelWithInfoIcon = styled(Stack)({
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
});

export const StyledInfoIcon = styled(InfoOutlinedIcon)({
    fontSize: 16,
    color: colors.darker,
});

// Styled menu item
export const StyledMenuItem = styled(MenuItem)({
    textAlign: "left",
    fontSize: 14,
});

