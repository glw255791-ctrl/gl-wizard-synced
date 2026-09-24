"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { colors } from "@/constants/theme";

const muiTheme = createTheme({
  typography: {
    fontFamily: "var(--font-source-sans), sans-serif",
    button: {
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: colors.deepTeal,
      light: colors.freshBlue,
      dark: colors.deepTeal,
      contrastText: colors.cleanWhite,
    },
    secondary: {
      main: colors.freshLime,
      light: colors.limeSoft,
      dark: colors.freshLime,
      contrastText: colors.graphite,
    },
    error: {
      main: colors.red,
    },
    warning: {
      main: colors.sunnyYellow,
      contrastText: colors.graphite,
    },
    success: {
      main: colors.deepTeal,
      contrastText: colors.cleanWhite,
    },
    info: {
      main: colors.freshBlue,
      contrastText: colors.cleanWhite,
    },
    text: {
      primary: colors.graphite,
      secondary: colors.slateGray,
      disabled: colors.coolGray,
    },
    background: {
      default: colors.warmWhite,
      paper: colors.cleanWhite,
    },
    divider: colors.softBlue,
    action: {
      active: colors.deepTeal,
      hover: colors.paleBlue,
      selected: colors.limeLight,
      disabled: colors.coolGray,
      disabledBackground: colors.lightGray,
      focus: colors.paleBlue,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.warmWhite,
          color: colors.graphite,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.softBlue,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.freshBlue,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.deepTeal,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.slateGray,
          "&.Mui-focused": {
            color: colors.deepTeal,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.softBlue,
          "&.Mui-checked": {
            color: colors.deepTeal,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: colors.softBlue,
          "&.Mui-checked": {
            color: colors.deepTeal,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: colors.deepTeal,
          },
          "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: colors.freshBlue,
          },
        },
        track: {
          backgroundColor: colors.coolGray,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: colors.paleBlue,
        },
        bar: {
          backgroundColor: colors.freshLime,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: colors.freshBlue,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: colors.deepTeal,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: colors.limeLight,
          },
          "&.Mui-selected:hover": {
            backgroundColor: colors.limeSoft,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        containedPrimary: {
          backgroundColor: colors.deepTeal,
          color: colors.cleanWhite,
          "&:hover": {
            backgroundColor: colors.freshBlue,
          },
        },
        containedSecondary: {
          backgroundColor: colors.freshLime,
          color: colors.graphite,
          "&:hover": {
            backgroundColor: colors.limeSoft,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: colors.slateGray,
          "&:hover": {
            backgroundColor: colors.paleBlue,
            color: colors.deepTeal,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.deepTeal,
          color: colors.cleanWhite,
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={muiTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
