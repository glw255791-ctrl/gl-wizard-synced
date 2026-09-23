import { LinearProgress, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import {
  ModalContent,
  ModalInnerContent,
  ModalHeader,
  Title,
  ModalContentWrapper,
  Message,
  Highlight,
  ButtonsWrapper,
  ButtonStyled,
} from "./style";
import { theme } from "../../../constants/theme";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPressExportUnmappedRows: (
    onProgress?: (done: number, total: number) => void
  ) => Promise<void> | void;
}

export function WarningModal(props: Props) {
  const { isOpen, onClose, onPressExportUnmappedRows } = props;
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const handleExport = async () => {
    setExporting(true);
    setProgress({ done: 0, total: 0 });
    try {
      await onPressExportUnmappedRows((done, total) =>
        setProgress({ done, total })
      );
    } finally {
      setExporting(false);
    }
  };

  const writingFile = progress.total > 0 && progress.done >= progress.total;
  const percent =
    progress.total > 0
      ? Math.min(100, Math.round((progress.done / progress.total) * 100))
      : 0;

  return (
    <Modal open={isOpen}>
      <ModalContent>
        <ModalInnerContent>
          <ModalHeader>
            <Title>Not all items are mapped</Title>
          </ModalHeader>

          <ModalContentWrapper>
            <Message>
              We found account codes in the GL that are not included in the CoA.
              Matching for these items is disabled, and they will be marked as
              ‘not mapped’.
            </Message>
            <Highlight>You can continue or upload a new CoA.</Highlight>

            {exporting && (
              <Stack spacing={0.5} sx={{ width: "100%" }}>
                <Typography
                  sx={{ color: theme.colors.medium, fontSize: "0.85rem" }}
                >
                  {writingFile
                    ? "Writing the file…"
                    : progress.total > 0
                      ? `Row ${progress.done.toLocaleString("en-US")} of ${progress.total.toLocaleString("en-US")}`
                      : "Preparing the file…"}
                </Typography>
                <LinearProgress
                  variant={
                    progress.total > 0 && !writingFile
                      ? "determinate"
                      : "indeterminate"
                  }
                  value={
                    progress.total > 0 && !writingFile ? percent : undefined
                  }
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: theme.colors.surface,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      backgroundColor: theme.colors.action,
                    },
                  }}
                />
              </Stack>
            )}

            <ButtonsWrapper>
              <ButtonStyled
                variant="contained"
                disabled={exporting}
                onClick={handleExport}
              >
                {exporting ? "Exporting…" : "Export Unmapped Rows"}
              </ButtonStyled>
              <ButtonStyled
                variant="contained"
                disabled={exporting}
                onClick={onClose}
              >
                Close
              </ButtonStyled>
            </ButtonsWrapper>
          </ModalContentWrapper>
        </ModalInnerContent>
      </ModalContent>
    </Modal>
  );
}
