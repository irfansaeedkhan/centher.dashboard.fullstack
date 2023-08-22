import { GreenTick } from "@/assets/svgs";
import FinalButton from "@/components/button/final.button";
import React from "react";

const SuccessModalContent = () => {
  return (
    <div className={modalBodyWrapper1}>
      <div className="flex flex-col items-center justify-center">
        <GreenTick />
        <h2 className="text-18px font-semibold text-white">
          Staking Project Created Successfully
        </h2>
      </div>
      <p className="text-14px text-center font-normal leading-6 text-gray-shade-2">
        Congratulations! you have successfully create your Staking Project on
        centher platform.
      </p>
    </div>
  );
};

export default SuccessModalContent;

const modalBodyWrapper1 = `flex flex-col gap-4 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 items-center`;
