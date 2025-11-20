import { Grid2 } from "@mui/material";
import { useDropzone } from "react-dropzone";
import {
  StyledCard,
  StyledCardDisabled,
  StyledDropzoneRoot,
  StyledDownloadDoneIcon,
} from "./style";
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

  const CardComponent = isDisabled ? StyledCardDisabled : StyledCard;

  return (
    <CardComponent>
      <Grid2 container spacing={2} height="100%">
        <Grid2 size={6}>
          <StyledDropzoneRoot
            {...getRootProps()}
            sx={uploaded ? { pointerEvents: "none" } : {}}
          >
            <input {...getInputProps()} />
            {uploaded ? <StyledDownloadDoneIcon /> : text}
          </StyledDropzoneRoot>
        </Grid2>
        <Grid2 size={6}>{children}</Grid2>
      </Grid2>
    </CardComponent>
  );
}
