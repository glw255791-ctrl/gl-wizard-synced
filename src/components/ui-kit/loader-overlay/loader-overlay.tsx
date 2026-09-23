import {
  StyledBackdrop,
  LoaderContent,
  LoaderText,
  LoaderMeta,
  StyledLinearProgress,
} from "./style";
import { formatBytes, type FileReadProgress } from "@/utils/read-file";

interface Props {
  loadingStatus: boolean;
  fileProgress?: FileReadProgress | null;
}

export function Loader(props: Props) {
  const { loadingStatus, fileProgress } = props;
  const total = fileProgress?.total ?? 0;
  const loaded = fileProgress?.loaded ?? 0;
  const countingRows = fileProgress?.unit === "rows" && total > 0;
  const readingFile =
    fileProgress?.phase === "reading" && fileProgress.unit !== "rows" && total > 0;
  const percent =
    readingFile || countingRows
      ? Math.min(100, Math.round((loaded / total) * 100))
      : 0;

  const title = countingRows
    ? "Analyzing the ledger"
    : readingFile
      ? `Loading ${fileProgress?.name}`
      : fileProgress?.phase === "workbook"
        ? `Reading ${fileProgress.name}`
        : "Analyzing the ledger";

  const detail = readingFile
    ? `${formatBytes(loaded)} of ${formatBytes(total)}`
    : countingRows
      ? `Row ${loaded.toLocaleString("en-US")} of ${total.toLocaleString("en-US")}`
      : fileProgress
        ? `${formatBytes(fileProgress.total)} in memory. Parsing the sheet.`
        : "This may take a while.";

  return (
    <StyledBackdrop open={loadingStatus}>
      <LoaderContent>
        <LoaderText>{title}</LoaderText>
        <LoaderMeta>{detail}</LoaderMeta>
        <StyledLinearProgress
          variant={readingFile || countingRows ? "determinate" : "indeterminate"}
          value={readingFile || countingRows ? percent : undefined}
        />
      </LoaderContent>
    </StyledBackdrop>
  );
}
