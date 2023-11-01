import React from "react";
import Button from "@/components/button";
import { WarningIcon } from "@/assets/svgs";

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
      <WarningIcon className="mx-auto mb-4 mt-5" />
      <h3 className="mt-2 text-base font-semibold leading-6 text-white fmd:text-lg">
        {heading}
      </h3>
      <p className="word-break text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
        {subHeading}
      </p>
      <div className="mt-6 flex items-center gap-4">
        <Button
          title={"Go back"}
          variant="secondary"
          onClick={dismissModal}
          className="w-full rounded-[14px]"
        />
        <Button
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
