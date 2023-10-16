import React, { FC } from "react";
import { WarningGradient } from "@/assets/svgs";
import Button from "@/components/button";

interface IProps {
  onClose: () => void;
  onConfirm: () => void;
}

const StakeRewardModal: FC<IProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div>
        <WarningGradient />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-center text-lg font-semibold text-white">
          Are you sure want to claim your reward?
        </p>
        {/* <p className="text-center text-sm font-medium text-gray-shade-14">
          Sorry, we couldn&apos;t Create your{" "}
          <span className="textGradient">Staking</span> right now, Please make
          sure that you&apos;re connected to the Internet.
        </p> */}
      </div>
      <div className="flex w-full items-center gap-2">
        <Button
          className="h-11 w-full"
          title="Go back"
          borderRounded="14px"
          variant="secondary"
          onClick={onClose}
        />
        <Button
          className="h-11 w-full"
          title="Proceed"
          borderRounded="14px"
          variant="primary"
          onClick={onConfirm}
        />
      </div>
    </div>
  );
};

export default StakeRewardModal;
