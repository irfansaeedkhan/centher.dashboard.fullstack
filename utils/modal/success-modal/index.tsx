import React from "react";
import Image from "next/image";
import Button from "@/components/button";
import { CircularClose, GreenTick } from "@/assets/svgs";

interface SMMProps {
  heading: React.ReactNode;
  subHeading: React.ReactNode;
  txStatus: boolean;
  msg?: string;
  dismissModal: () => void;
  proceedFunc: () => void;
}

const SuccessMessageModal: React.FC<SMMProps> = ({
  heading,
  subHeading,
  txStatus,
  dismissModal,
  proceedFunc,
  msg,
}) => {
  return (
    <div className="mt-4 flex w-full flex-col pt-4 text-center">
      <div className="word-break flex flex-col items-center justify-center gap-4">
        {txStatus ? <GreenTick /> : <CircularClose />}
        {heading}
      </div>
      {txStatus && subHeading}
      {!txStatus && (
        <p className="text-14px font-normal leading-6 text-gray-shade-2">
          Transaction Failed: {msg}
        </p>
      )}
      <div className="mt-4 flex flex-col-reverse gap-2 pt-4 fsm:flex-row">
        {txStatus ? (
          <Button
            title={"View"}
            variant="primary"
            className="w-full"
            onClick={proceedFunc}
          />
        ) : (
          <Button
            title={"Try Again"}
            variant="secondary"
            className="w-full rounded-[14px]"
            onClick={dismissModal}
          />
        )}
      </div>
    </div>
  );
};

export default SuccessMessageModal;
