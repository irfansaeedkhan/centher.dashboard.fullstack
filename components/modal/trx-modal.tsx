import React from "react";
import ModalContainer from "./modal-container";
import TrxInProgressModal from "@/utils/modal/trx-modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TrxModal: React.FC<Props> = ({ open, onClose }) => {
  return (
    <ModalContainer
      modalId="tx-modal"
      isOpen={open}
      onClose={onClose}
      modalContentClassName="max-w-2xl p-6 rounded-2xl"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <TrxInProgressModal />
    </ModalContainer>
  );
};

export default TrxModal;
