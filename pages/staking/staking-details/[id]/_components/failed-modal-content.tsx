import React from "react";
import { CircularClose } from "@/assets/svgs";

const FailedModalContent: React.FC<{ message?: string; title?: string }> = ({
  message,
  title,
}) => {
  return (
    <div className={modalBodyWrapper1}>
      <div className="flex flex-col items-center justify-center">
        <CircularClose />
        <h2 className="text-18px font-semibold text-white">
          {title?.length ? title : `Couldn't Create Staking`}
        </h2>
      </div>
      <p className="text-14px text-center font-normal leading-6 text-gray-shade-2">
        {message?.length
          ? message
          : `Please review the data, make sure you filled out all the mandatory
        fields and try again.`}
      </p>
    </div>
  );
};

export default FailedModalContent;

const modalBodyWrapper1 = `flex flex-col gap-4 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 items-center`;
