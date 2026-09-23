/**
 * Border radius values (in pixels)
 */
export const borderRadius = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  round: "50%",
} as const;

/**
 * Spacing values (in pixels or rem)
 */
export const spacing = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "2rem",
} as const;

/**
 * Padding values (in pixels or rem)
 */
export const padding = {
  none: 0,
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "2rem",
} as const;

/**
 * Gap values (in pixels or rem)
 */
export const gap = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "2rem",
} as const;

/**
 * Font sizes (in pixels or rem)
 */
export const fontSize = {
  sm: "0.75rem",
  md: "0.875rem",
  cell: "0.8125rem",
  lg: "0.95rem",
  xl: "1.25rem",
  xxl: "1.75rem",
  icon: "2.25rem",
} as const;

/**
 * Border width values (in pixels)
 */
export const borderWidth = {
  none: 0,
  sm: "0.0625rem",
  md: "0.125rem",
  lg: "0.1875rem",
} as const;

/**
 * Height values (in pixels)
 */
export const height = {
  cell: 23,
  header: 22,
  headerWrapper: 24,
  input: 32,
  table: 600,
  maxHeight: 200,
} as const;

/**
 * Width values (in pixels)
 */
export const width = {
  dropdown: 250,
  maxWidth: 200,
} as const;

/**
 * Opacity values
 */
export const opacity = {
  disabled: 0.25,
} as const;

/**
 * Z-index values
 */
export const zIndex = {
  topButton: 100,
} as const;

/**
 * Position values
 */
export const position = {
  topButton: {
    bottom: "20px",
    right: "20px",
  },
} as const;

/**
 * Excel export styling constants
 */
export const excelStyles = {
  headerBg: "D3D3D3",
  highlightBg: "FFFF99",
  columnWidth: 20,
} as const;

/**
 * File validation constants
 */
export const fileValidation = {
  validMimeTypes: [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ],
  validExtension: ".xlsx",
  errorTimeout: 4000,
} as const;

/**
 * Text truncation constants
 */
export const textTruncation = {
  maxChars: 30,
  maxCharsShort: 25,
} as const;

/**
 * Worker timeout constants
 */
export const workerTimeout = {
  analyze: 4000,
} as const;

/**
 * Color palette values
 */
export const colors = {
  darker: "#356F73",
  medium: "#667274",
  lighter: "#FFFFFF",
  page: "#F8F9F6",
  surface: "#E4F0F0",
  freshBlue: "#5A9298",
  limeLight: "#E8EFCB",
  limeSoft: "#D6E3A0",
  softBlue: "#A9C8C9",
  canvas: "#E5E9E8",
  yellow: "#E8D75A",

  action: "#B8C96B",
  red: "#C62828",
  green: "#356F73",
  white: "#FFFFFF",
  black: "#394243",
  gray: "#A3ADAE",
} as const;

/**
 * Combined theme object for easy access
 */
export const theme = {
  colors,
  borderRadius,
  spacing,
  padding,
  gap,
  fontSize,
  borderWidth,
  height,
  width,
  opacity,
  zIndex,
  position,
  excelStyles,
  fileValidation,
  textTruncation,
  workerTimeout,
} as const;
