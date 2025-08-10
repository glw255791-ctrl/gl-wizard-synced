import { Card, Grid2, Stack } from "@mui/material";
import { useDropzone } from "react-dropzone";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import { styles } from "./style";
interface Props {
  onDrop: (acceptedFiles: File[]) => void;
  text: string;
  uploaded: boolean;
  children: React.ReactNode;
  isDisabled?: boolean;
}

export function FileDropzone(props: Props) {
  const { text, uploaded, onDrop, children, isDisabled } = props;
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Card style={isDisabled ? styles.disabledCard : styles.card}>
      <Grid2 container spacing={2} height="100%">
        <Grid2 size={6}>
          <Stack
            {...getRootProps()}
            style={{
              ...styles.root,
              ...(uploaded ? { pointerEvents: "none" } : {}),
            }}
          >
            <input {...getInputProps()} />
            {uploaded ? (
              <DownloadDoneIcon style={{ fontSize: "5rem" }} />
            ) : (
              text
            )}
          </Stack>
        </Grid2>
        <Grid2 size={6}>{children}</Grid2>
      </Grid2>
    </Card>
  );
}
