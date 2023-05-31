import { WarningIcon } from "@/assets/svgs";
import FinalButton from "@/components/button/final.button";
import React from "react";

interface MMProps {
  heading: string;
  subHeading: string;
  dismissModal: () => void;
  proceedFunc: () => void;
}

const MessageModal: React.FC<MMProps> = ({
  heading,
  subHeading,
  dismissModal,
  proceedFunc,
}) => {
  return (
    <div className="flex w-full flex-col gap-2 px-2 pt-2 text-center fmd:px-4 fmd:pt-4">
      <WarningIcon className="mx-auto" />
      <h3 className="fmd:text-18px mt-2 text-base font-semibold leading-6 text-white">
        {heading}
      </h3>
      <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
        {subHeading}
      </p>
      <div className="mt-2 flex items-center gap-4">
        <FinalButton
          title={"Go back"}
          variant="secondary"
          onClick={dismissModal}
          className="w-full rounded-[14px]"
        />
        <FinalButton
          title={"Proceed"}
          variant="primary"
          onClick={proceedFunc}
          className="w-full rounded-[14px]"
        />
      </div>
    </div>
  );
};

export default MessageModal;
