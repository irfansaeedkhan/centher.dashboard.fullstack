import Image from "next/image";
import React from "react";

import FinalButton from "@/components/button/final.button";
import { CircularClose, GreenTick } from "@/assets/svgs";

interface SMMProps {
  heading: React.ReactNode;
  subHeading: React.ReactNode;
  txStatus: boolean;
  dismissModal: () => void;
  proceedFunc: () => void;
}

const SuccessMessageModal: React.FC<SMMProps> = ({
  heading,
  subHeading,
  txStatus,
  dismissModal,
  proceedFunc,
}) => {
  return (
    <div className="mt-8 flex w-full flex-col gap-2 text-center">
      <div className="flex flex-col items-center justify-center">
        {txStatus ? <GreenTick /> : <CircularClose />}
        {heading}
      </div>
      {txStatus && subHeading}
      {!txStatus && (
        <p className="text-14px font-normal leading-6 text-gray-shade-2">
          Transaction Failed.
        </p>
      )}
      <div className="mt-4 flex flex-col-reverse gap-2 fsm:flex-row">
        {txStatus ? (
          <FinalButton
            title={"View"}
            variant="primary"
            className="w-full"
            onClick={proceedFunc}
          />
        ) : (
          <FinalButton
            title={"Try Again"}
            variant="secondary"
            className="w-full"
            onClick={dismissModal}
          />
        )}
      </div>
    </div>
  );
};

export default SuccessMessageModal;
