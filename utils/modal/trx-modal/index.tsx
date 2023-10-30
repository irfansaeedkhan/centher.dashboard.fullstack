import React from "react";

import { LoaderIcon } from "@/assets/svgs";
import Button from "@/components/button";

const TrxInProgressModal: React.FC = () => {
  return (
    <div className="flex w-full flex-col px-2 pt-2 text-center fmd:px-4 fmd:pt-4">
      <div className="mb-6 mt-5 w-full">
        <LoaderIcon className="mx-auto animate-spin" />
      </div>
      <h3 className="text-base font-semibold leading-6 text-white f2xl:text-lg">
        Transaction in progress
      </h3>
      <p className="text-sm font-normal leading-6 text-gray-shade-2">
        Your transaction is in progress, Please wait.
      </p>
      <Button
        title="Cancel"
        variant={"primary"}
        disabled
        className="mt-6 rounded-[14px] opacity-50"
      />
    </div>
  );
};

export default TrxInProgressModal;
