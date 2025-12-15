/**
 * File validation utilities
 */

import { fileValidation } from "../constants/theme";

/**
 * Validates if a file is a valid Excel file
 * @param file - The file to validate
 * @returns true if the file is a valid Excel file, false otherwise
 */
export const isValidExcelFile = (file: File): boolean => {
  return (
    fileValidation.validMimeTypes.includes(
      file.type as (typeof fileValidation.validMimeTypes)[number]
    ) || file.name.endsWith(fileValidation.validExtension)
  );
};

/**
 * Gets the error message for invalid file type
 * @returns Error message string
 */
export const getInvalidFileTypeError = (): string => {
  return "Invalid file type. Please upload an Excel file.";
};
