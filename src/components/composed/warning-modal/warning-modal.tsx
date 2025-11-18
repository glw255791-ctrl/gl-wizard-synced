import { Modal, Stack, Typography, Button } from "@mui/material";
import { styles } from "./style";
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function WarningModal(props: Props) {
  const { isOpen, onClose } = props;

  return (
    <Modal open={isOpen}>
      <Stack style={styles.modalContent}>
        <Stack style={styles.modalInnerContent}>
          <Stack style={styles.modalHeader}>
            <Typography style={styles.title}>
              Not all items are mapped
            </Typography>
          </Stack>

          <Stack style={styles.modalContentWrapper}>
            <Typography style={styles.message}>
              We found account codes in the GL that are not included in the CoA.
              Matching for these items is disabled, and they will be marked as
              ‘not mapped’.
            </Typography>
            <Typography style={styles.highlight}>
              You can continue or upload a new CoA.
            </Typography>

            <Button variant="contained" onClick={onClose}>
              Close
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
}
