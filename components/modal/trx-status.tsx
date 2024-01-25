import React from "react";
import { useRouter } from "next/router";
import { IconFailure, SuccessIcon } from "@/assets/svgs";
import ModalContainer from "./modal-container";
import Button from "../button";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  success: boolean;
}

const TrxStatus: React.FC<Props> = ({
  open,
  onClose,
  title,
  description,
  success,
}) => {
  const router = useRouter();
  return (
    <ModalContainer
      modalId="tx-modal"
      isOpen={open}
      onClose={onClose}
      modalContentClassName="max-w-2xl p-6 rounded-2xl"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
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
