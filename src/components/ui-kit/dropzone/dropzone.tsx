import { Grid2, Stack } from "@mui/material";
import { useDropzone } from "react-dropzone";
import {
  StyledCard,
  StyledCardDisabled,
  StyledDropzoneRoot,
  StyledDownloadDoneIcon,
  StyledAdditionalDropzoneRoot,
  ZoneLabel,
  ZoneHint,
} from "./style";
interface Props {
  onDrop: (acceptedFiles: File[]) => void;
  text: string;
  uploaded: boolean;
  children: React.ReactNode;
  isDisabled?: boolean;
  onAdditionalDrop?: (acceptedFiles: File[]) => void;
  isAdditionalDisabled?: boolean;
  additionalText?: string;
  additionalUploaded?: boolean;
  fileName?: string;
  additionalFileName?: string;
  optional?: boolean;
  compact?: boolean;
  fieldsBelow?: boolean;
}

export function FileDropzone(props: Props) {
  const {
    text,
    uploaded,
    onDrop,
    children,
    isDisabled,
    onAdditionalDrop,
    additionalText,
    additionalUploaded,
    isAdditionalDisabled,
    fileName,
    additionalFileName,
    optional,
    compact,
    fieldsBelow,
  } = props;
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const {
    getRootProps: getAdditionalRootProps,
    getInputProps: getAdditionalInputProps,
  } = useDropzone({ onDrop: onAdditionalDrop ?? onDrop });

  const CardComponent = isDisabled ? StyledCardDisabled : StyledCard;
  const hasSide = Boolean(children) && !fieldsBelow;
  const hasBelow = Boolean(children) && fieldsBelow;

  return (
    <CardComponent
      sx={compact ? { minHeight: 0, height: "auto" } : { flex: 1 }}
    >
      <Grid2 container spacing={2} sx={{ width: "100%", flex: 1, alignItems: "stretch" }}>
        <Grid2 size={hasSide ? 6 : 12} sx={{ display: "flex" }}>
          <Stack spacing={1} sx={{ width: "100%", flex: 1 }}>
            <StyledDropzoneRoot
              {...getRootProps()}
              sx={{
                ...(compact ? { minHeight: "4.75rem", flex: "0 0 auto" } : {}),
                ...(uploaded ? { pointerEvents: "none" } : {}),
              }}
            >
              <input {...getInputProps()} />
              {uploaded ? (
                <Stack alignItems="center" spacing={0.5}>
                  <StyledDownloadDoneIcon />
                  {fileName ? <ZoneLabel>{fileName}</ZoneLabel> : null}
                </Stack>
              ) : (
                <Stack alignItems="center" spacing={0.5}>
                  <ZoneLabel>{text}</ZoneLabel>
                  <ZoneHint>{optional ? "Optional" : "Required"}</ZoneHint>
                </Stack>
              )}
            </StyledDropzoneRoot>
            {hasBelow ? children : null}
          </Stack>
        </Grid2>
        {hasSide && (
        <Grid2 size={6}>
          {children}
          {onAdditionalDrop && additionalText && (
            <StyledAdditionalDropzoneRoot
              isDisabled={isAdditionalDisabled}
              {...getAdditionalRootProps()}
              sx={additionalUploaded ? { pointerEvents: "none" } : {}}
            >
              <input {...getAdditionalInputProps()} />
              {additionalUploaded ? (
                <Stack alignItems="center" spacing={0.5}>
                  <StyledDownloadDoneIcon />
                  {additionalFileName ? (
                    <ZoneLabel>{additionalFileName}</ZoneLabel>
                  ) : null}
                </Stack>
              ) : (
                <Stack alignItems="center" spacing={0.5}>
                  <ZoneLabel>{additionalText}</ZoneLabel>
                  <ZoneHint>Optional</ZoneHint>
                </Stack>
              )}
            </StyledAdditionalDropzoneRoot>
          )}
        </Grid2>
        )}
      </Grid2>
    </CardComponent>
  );
}
