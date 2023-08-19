import FinalButton from "@/components/button/final.button";
import { CustomNumberInput } from "@/components/custom-number-input";
import React from "react";

const UnstakeModal: React.FC<{
  valueChanged: (val: string) => void;
  submit: () => void;
  errors: string;
}> = ({ valueChanged, submit, errors }) => {
  return (
    <div className="mt-4 p-4">
      <div>
        <label htmlFor="unstake" className="text-sm text-white">
          Amount to Unstake
        </label>
        <CustomNumberInput
          onChange={(e) => valueChanged(e.target.value)}
          id="unstake"
          placeholder="0.0"
          className="mt-2 w-full rounded-lg border-0 bg-black-shade-3 px-5 py-3 text-white focus:ring-1 focus:ring-brand-primary"
        />
        <p className="m-1 text-sm text-danger">{errors}</p>
      </div>
      <FinalButton
        className="mt-4 h-11 w-full"
        title="Unstake"
        borderRounded="14px"
        variant="primary"
        onClick={submit}
        disabled={errors.length > 0}
      />
    </div>
  );
};

export default UnstakeModal;
