import React from "react";
import { RadioButtonComponent } from "@/components/shared";
import { FormStateProps } from "../shared-types";

const Currency: React.FC<FormStateProps> = ({ formState, setFormState }) => {
  const handleClick = (value: string) => {
    setFormState((prev) => {
      return {
        ...prev,
        verify_token: { ...prev.verify_token, currency: value },
      };
    });
  };
  return (
    <div className="col-span-1 mb-6 w-full text-sm font-medium text-white md:mb-0">
      <label
        htmlFor="currency"
        className="mb-4 block font-normal tracking-wide"
      >
        Currency
        <span className="text-gradient ml-[2px]">*</span>
      </label>
      <div className="flex items-center gap-4">
        <RadioButtonComponent
          selectedValue={formState.verify_token.currency}
          value={"MATIC"}
          handleClick={(value) => handleClick(value as string)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.currency}
          value={"USDT"}
          handleClick={(value) => handleClick(value as string)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.currency}
          value={"USDC"}
          handleClick={(value) => handleClick(value as string)}
        />
      </div>
    </div>
  );
};

export default Currency;
