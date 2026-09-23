export type FileReadPhase = "reading" | "workbook";

export type FileReadProgress = {
  name: string;
  loaded: number;
  total: number;
  phase: FileReadPhase;
  unit?: "bytes" | "rows";
};

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function readFileWithProgress(
  file: File,
  onProgress: (loaded: number, total: number) => void
) {
  const total = file.size;
  if (!total) {
    return Promise.reject(new Error("That file is empty."));
  }

  const chunkSize = 256 * 1024;
  const chunks: ArrayBuffer[] = [];
  let offset = 0;

  const readNext = (): Promise<void> => {
    const end = Math.min(offset + chunkSize, total);
    return file
      .slice(offset, end)
      .arrayBuffer()
      .then((chunk) => {
        chunks.push(chunk);
        offset = end;
        onProgress(offset, total);
        if (offset < total) return readNext();
      });
  };

  return readNext().then(
    () => new Blob(chunks).arrayBuffer()
  );
}
