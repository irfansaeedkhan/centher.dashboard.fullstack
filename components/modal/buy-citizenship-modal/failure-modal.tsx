import React from "react";

import Button from "../../button";
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
        <p className="text-sm font-medium text-gray-shade-14">
          Sorry, we couldn&apos;t verify your{" "}
          <span className="text-gradient">369x Passport CITIZEN </span>{" "}
          Membership subscription. Please make sure that you have enough BNB in
          your wallet.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <Button
          onClick={onClickClose}
          title="Cancel"
          variant="secondary"
          className="w-full rounded-[14px] py-3 text-sm"
        />
        <Button
          onClick={retryFunc}
          title="Retry"
          variant="primary"
          className="w-full py-3 text-sm"
        />
      </div>
    </div>
  );
};
