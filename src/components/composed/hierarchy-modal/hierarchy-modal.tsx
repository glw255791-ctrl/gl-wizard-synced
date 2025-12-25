import { Modal, Stack } from "@mui/material";
import {
  ModalContent,
  ModalInnerContent,
  ModalHeader,
  Title,
  ModalContentWrapper,
  ButtonsWrapper,
  ButtonStyled,
} from "./style";
import { AnyType } from "../../../types";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { useState } from "react";

interface Props {
  hierarchyData: Record<string, AnyType>[];
  isOpen: boolean;
  onClose: () => void;
  setHierarchyData: (data: Record<string, AnyType>[]) => void;
}

export function HierarchyModal(props: Props) {
  const { hierarchyData, isOpen, onClose, setHierarchyData } = props;

  const options = Array.from({ length: hierarchyData.length }, (_, index) => ({
    title: String(index + 1),
    value: String(index + 1),
  }));

  const [currentValues, setCurrentValues] = useState<Record<string, AnyType>[]>(
    hierarchyData.map((item) => ({ value: item.value, level: item.level }))
  );

  return (
    <Modal open={isOpen}>
      <ModalContent>
        <ModalInnerContent>
          <ModalHeader>
            <Title>Set item hierarchy</Title>
          </ModalHeader>

          <ModalContentWrapper>
            {hierarchyData.map((item, index) => (
              <Stack key={`${item.value}-${index}`} style={{ width: 200 }}>
                <Dropdown
                  items={options}
                  label={`${String(item.value)} level:`}
                  value={
                    currentValues.find((it) => it.value === item.value)
                      ?.level as string
                  }
                  onChange={(e) => {
                    setCurrentValues((prev) =>
                      prev.map((prevItem) => {
                        if (prevItem.value === item.value) {
                          return {
                            ...prevItem,
                            level: e.target.value as number,
                          };
                        }
                        return prevItem;
                      })
                    );
                  }}
                />
              </Stack>
            ))}
            <ButtonsWrapper>
              <ButtonStyled
                variant="contained"
                onClick={() => {
                  setHierarchyData(currentValues);
                  onClose();
                }}
              >
                Confirm
              </ButtonStyled>
            </ButtonsWrapper>
          </ModalContentWrapper>
        </ModalInnerContent>
      </ModalContent>
    </Modal>
  );
}
