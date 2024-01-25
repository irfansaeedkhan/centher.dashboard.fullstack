import React from "react";
import TrxInProgressModal from "@/utils/modal/trx-modal";
import ModalContainer from "./modal-container";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TrxModal: React.FC<Props> = ({ open, onClose }) => {
  return (
    <ModalContainer
      modalId="trx-modal"
      isOpen={open}
      onClose={onClose}
      modalContentClassName="max-w-2xl p-6 rounded-2xl"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <TrxInProgressModal />
    </ModalContainer>
  );
};

export default TrxModal;
