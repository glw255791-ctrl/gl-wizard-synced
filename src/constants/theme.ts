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
 * Brand palette (design reference)
 * Fresh Lime #B8C96B · Lime Light #E8EFCB · Lime Soft #D6E3A0
 * Deep Teal #356F73 · Fresh Blue #5A9298 · Soft Blue #A9C8C9 · Pale Blue #E4F0F0
 * Graphite #394243 · Slate Gray #667274 · Cool Gray #A3ADAE
 * Light Gray #E5E9E8 · Warm White #F8F9F6 · Sunny Yellow #E8D75A
 * Soft Yellow #F5EFAF · Clean White #FFFFFF
 */
export const colors = {
  // Named aliases matching the design board
  freshLime: "#B8C96B",
  limeLight: "#E8EFCB",
  limeSoft: "#D6E3A0",
  deepTeal: "#356F73",
  freshBlue: "#5A9298",
  softBlue: "#A9C8C9",
  paleBlue: "#E4F0F0",
  graphite: "#394243",
  slateGray: "#667274",
  coolGray: "#A3ADAE",
  lightGray: "#E5E9E8",
  warmWhite: "#F8F9F6",
  sunnyYellow: "#E8D75A",
  softYellow: "#F5EFAF",
  cleanWhite: "#FFFFFF",

  // Existing semantic keys (kept for call sites)
  darker: "#356F73", // Deep Teal
  medium: "#667274", // Slate Gray
  lighter: "#FFFFFF", // Clean White
  page: "#F8F9F6", // Warm White
  surface: "#E4F0F0", // Pale Blue
  canvas: "#E5E9E8", // Light Gray
  yellow: "#E8D75A", // Sunny Yellow
  action: "#B8C96B", // Fresh Lime
  red: "#C62828",
  green: "#356F73", // Deep Teal
  white: "#FFFFFF",
  black: "#394243", // Graphite
  gray: "#A3ADAE", // Cool Gray
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
