import React from "react";
import { RadioButtonComponent } from "@/components/shared";
import { FormStateProps } from "../shared-types";

const LiquidityLockups: React.FC<FormStateProps> = ({
  formState,
  setFormState,
}) => {
  const handleClick = (value: string) => {
    setFormState((prev) => {
      return {
        ...prev,
        verify_token: { ...prev.verify_token, liquidity_lockup: value },
      };
    });
  };
  return (
    <div className="col-span-1 mb-6 w-full text-sm font-medium text-white md:mb-0">
      <label
        htmlFor="currency"
        className="mb-4 block font-normal tracking-wide text-gray-shade-14"
      >
        Liquidity lockup (days)
        <span className="text-gradient ml-[2px]">*</span>
      </label>
      <div className="flex items-center gap-4">
        <RadioButtonComponent
          selectedValue={formState.verify_token.liquidity_lockup}
          value={"30 Days"}
          handleClick={(value) => handleClick(value as string)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.liquidity_lockup}
          value={"60 Days"}
          handleClick={(value) => handleClick(value as string)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.liquidity_lockup}
          value={"90 Days"}
          handleClick={(value) => handleClick(value as string)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.liquidity_lockup}
          value={"120 Days"}
          handleClick={(value) => handleClick(value as string)}
        />
      </div>
    </div>
  );
};

export default LiquidityLockups;
