import { Modal } from "@mui/material";
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPressExportUnmappedRows: () => void;
}

export function WarningModal(props: Props) {
  const { isOpen, onClose, onPressExportUnmappedRows } = props;

  return (
    <Modal open={isOpen}>
      <ModalContent>
        <ModalInnerContent>
          <ModalHeader>
            <Title>
              Not all items are mapped
            </Title>
          </ModalHeader>

          <ModalContentWrapper>
            <Message>
              We found account codes in the GL that are not included in the CoA.
              Matching for these items is disabled, and they will be marked as
              ‘not mapped’.
            </Message>
            <Highlight>
              You can continue or upload a new CoA.
            </Highlight>

            <ButtonsWrapper>
              <ButtonStyled variant="contained" onClick={onPressExportUnmappedRows}>
                Export Unmapped Rows
              </ButtonStyled>
              <ButtonStyled variant="contained" onClick={onClose}>
                Close
              </ButtonStyled>
            </ButtonsWrapper>
          </ModalContentWrapper>
        </ModalInnerContent>
      </ModalContent>
    </Modal>
  );
}
