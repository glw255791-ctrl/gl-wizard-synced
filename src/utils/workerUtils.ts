/**
 * Web Worker utility functions
 */

/**
 * Creates a standardized error handler for Web Workers
 * @param setError - Function to set error state
 * @param setLoadingStatus - Function to set loading status
 * @param worker - The worker instance to terminate
 * @returns Error handler function
 */
export const createWorkerErrorHandler = (
  setError: (error: string | undefined) => void,
  setLoadingStatus: (loading: boolean) => void,
  worker: Worker
) => {
  return (error: ErrorEvent) => {
    setError(error.message);
    console.error("Worker error:", error);
    setLoadingStatus(false);
    worker.terminate();
  };
};

/**
 * Validates Excel file before processing
 * @param file - The file to validate
 * @param setError - Function to set error state
 * @returns true if file is valid, false otherwise
 */
export const validateExcelFile = (
  file: File | undefined,
  setError: (error: string | undefined) => void
): boolean => {
  if (!file) return false;

  const validMimeTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  if (!validMimeTypes.includes(file.type) && !file.name.endsWith(".xlsx")) {
    setError("Invalid file type. Please upload an Excel file.");
    setTimeout(() => setError(undefined), 4000);
    return false;
  }

  return true;
};

