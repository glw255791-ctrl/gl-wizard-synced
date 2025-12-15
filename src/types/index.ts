/**
 * Shared type definitions used across the application
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Generic type for any value that can appear in data structures
 */
export type AnyType = string | number | boolean | object;

/**
 * Raw data structure containing GL (General Ledger) and CoA (Chart of Accounts) data
 */
export interface RawData {
  glData: Record<string, any>[];
  glHeaders: string[];
  coaData: Record<string, any>[];
  coaHeaders: string[];
}

/**
 * GL (General Ledger) header field mappings
 */
export interface GlHeaders {
  account: string;
  jen: string;
  date: string;
  value: string;
}

/**
 * CoA (Chart of Accounts) header field mappings
 */
export interface CoaHeaders {
  mappingValue: string;
  displayValue: string;
  groupingValue: string;
}

/**
 * Selected headers for both GL and CoA
 */
export interface SelectedHeaders {
  glHeaders: GlHeaders;
  coaHeaders: CoaHeaders;
}

/**
 * Review data summary containing date range, row count, and total value
 */
export interface ReviewData {
  startDate: string;
  endDate: string;
  rows: number;
  total: number;
}

/**
 * Analysis workflow steps
 */
export enum AnalysisStep {
  TO_UPLOAD_GL,
  UPLOADED_GL,
  TO_UPLOAD_COA,
  TO_UPLOAD_DICTIONARY,
  UPLOADED_DICTIONARY,
  ANALYZED,
}

/**
 * Table header definition
 */
export interface TableHeader {
  key: string;
  title: string;
}

/**
 * Dropdown item structure
 */
export interface DropdownItem {
  title: string;
  value: string;
}

/**
 * Process value structure for data processing
 */
export type ProcessValue = {
  [key: string]: any;
};

/**
 * Column definition for data tables
 */
export interface Column {
  key: string;
  label: string;
  width?: number;
  flex?: number;
  align?: "center" | "left" | "right" | "justify" | "inherit";
}

/**
 * User data structure
 */
export interface UserData {
  name: string;
  licencevaliduntil: string;
  email: string;
  id: string;
  role: string;
}

/**
 * Modal action types
 */
export type ModalAction = "EXTEND" | "DEACTIVATE" | "INVITE";

/**
 * Modal props structure
 */
export interface ModalProps {
  modalAction: ModalAction;
  date: Date;
  id: string;
  email: string;
}

/**
 * Snackbar severity levels
 */
export type SnackbarSeverity = "error" | "success" | "warning" | "";

/**
 * Snackbar props structure
 */
export interface SnackbarProps {
  message: string;
  severity: SnackbarSeverity;
  open: boolean;
}

/**
 * Login form data
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Register form data
 */
export interface RegisterData {
  name: string;
  password: string;
}

/**
 * CoA filter structure
 */
export interface CoaFilters {
  header: string;
  value: string[];
}
