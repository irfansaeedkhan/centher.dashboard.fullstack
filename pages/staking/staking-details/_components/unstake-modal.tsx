import FinalButton from "@/components/button/final.button";
import { CustomNumberInput } from "@/components/custom-number-input";
import React from "react";

const UnstakeModal = () => {
  return (
    <div className="mt-4 p-4">
      <div>
        <label htmlFor="unstake" className="text-sm text-white">
          Amount to Unstake
        </label>
        <CustomNumberInput
          id="unstake"
          placeholder="0.0"
          className="mt-2 w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 text-white focus:ring-1 focus:ring-brand-primary"
        />
      </div>
      <FinalButton
        className="mt-4 h-11 w-full"
        title="Unstake"
        borderRounded="14px"
        variant="primary"
      />
    </div>
  );
};

export default UnstakeModal;
