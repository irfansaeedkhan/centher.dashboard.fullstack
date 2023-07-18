import React from "react";
import Image from "next/image";

import FinalButton from "../../button/final.button";
import { IconFailure } from "@/assets/svgs";

interface CustomModalProps {
  onClickClose: () => void;
  retryFunc: () => void;
}

export const CitizenShipFailureModal: React.FC<CustomModalProps> = ({
  onClickClose,
  retryFunc,
}) => {
  return (
    <div className="flex flex-col gap-8  text-center">
      <IconFailure className="mx-auto" />
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-white fsm:text-lg">
          Couldn&apos;t Verify Subscription
        </h2>
        <p className="text-14px font-medium text-gray-shade-14">
          Sorry, we couldn&apos;t verify your{" "}
          <span className="text-gradient">Centher Passport CITIZEN </span>{" "}
          Membership subscription. Please make sure that you&apos;re connected
          to the Internet.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <FinalButton
          onClick={onClickClose}
          title="Cancel"
          variant="secondary"
          className="text-14px w-full rounded-[14px] py-3 hover:text-black"
        />
        <FinalButton
          onClick={retryFunc}
          title="Retry"
          variant="primary"
          className="text-14px w-full py-3 hover:text-black"
        />
      </div>
    </div>
  );
};
