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
  sm: "0.25rem",
  md: "0.5rem",
  cell: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  xxl: "2rem",
  icon: "5rem",
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
  darker: "#4F6367",
  medium: "#7A9E9F",
  lighter: "#E5F1F1",

  action: "#204795",
  red: "#961A1A",
  green: "#008000",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#808080",
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
