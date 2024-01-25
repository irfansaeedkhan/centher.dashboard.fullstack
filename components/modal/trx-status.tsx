import React from "react";
import { IconFailure, SuccessIcon } from "@/assets/svgs";
import Button from "../button";
import ModalContainer from "./modal-container";

interface Props {
  open: boolean;
  success: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

const TrxStatus: React.FC<Props> = ({
  open,
  success,
  title,
  description,
  onClose,
}) => {
  return (
    <ModalContainer
      modalId="trx-status-modal"
      isOpen={open}
      onClose={onClose}
      modalContentClassName="max-w-2xl p-6 rounded-2xl"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={false}
    >
      <div className="flex flex-col items-center gap-8 text-center">
        {success ? <SuccessIcon /> : <IconFailure />}
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-white fsm:text-lg">
            {title}
          </h2>
          <p className="text-sm font-medium text-gray-shade-14">
            {description}
          </p>
        </div>
        <Button
          onClick={onClose}
          title="Close"
          variant="primary"
          className="w-full py-3 text-sm hover:text-black"
        />
      </div>
    </ModalContainer>
  );
};

export default TrxStatus;
