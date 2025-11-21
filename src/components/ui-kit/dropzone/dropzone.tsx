import { Grid2, Stack, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import {
  StyledCard,
  StyledCardDisabled,
  StyledDropzoneRoot,
  StyledDownloadDoneIcon,
  StyledAdditionalDropzoneRoot,
} from "./style";
interface Props {
  onDrop: (acceptedFiles: File[]) => void;
  text: string;
  uploaded: boolean;
  children: React.ReactNode;
  isDisabled?: boolean;
  onAdditionalDrop?: (acceptedFiles: File[]) => void;
  additionalText?: string;
  additionalUploaded?: boolean;
}

export function FileDropzone(props: Props) {
  const { text, uploaded, onDrop, children, isDisabled, onAdditionalDrop, additionalText, additionalUploaded } = props;
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const { getRootProps: getAdditionalRootProps, getInputProps: getAdditionalInputProps } = useDropzone({ onDrop: onAdditionalDrop ?? onDrop })

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
        <Grid2 size={6}>{children}
          {onAdditionalDrop && additionalText && (
            <StyledAdditionalDropzoneRoot
              {...getAdditionalRootProps()}
              sx={additionalUploaded ? { pointerEvents: "none" } : {}}
            >
              <input {...getAdditionalInputProps()} />
              {additionalUploaded ? <StyledDownloadDoneIcon /> : <Stack>{additionalText} <Typography>(Optional)</Typography></Stack>}
            </StyledAdditionalDropzoneRoot>
          )}
        </Grid2>
      </Grid2>
    </CardComponent>
  );
}
