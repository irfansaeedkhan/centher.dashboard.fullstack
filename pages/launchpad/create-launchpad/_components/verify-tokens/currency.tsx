import React from "react";
import { RadioButtonComponent } from "@/components/shared";
import { FormStateProps } from "../shared-types";

const Currency: React.FC<FormStateProps> = ({ formState, setFormState }) => {
  const handleClick = (value: "BNB" | "USDT") => {
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
        className="mb-4 block font-normal tracking-wide text-gray-shade-14"
      >
        Currency
        <span className="text-gradient ml-[2px]">*</span>
      </label>
      <div className="flex items-center gap-4">
        <RadioButtonComponent
          selectedValue={formState.verify_token.currency}
          value={"BNB"}
          handleClick={(value) => handleClick(value as "BNB")}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.currency}
          value={"USDT"}
          handleClick={(value) => handleClick(value as "USDT")}
        />
      </div>
    </div>
  );
};

export default Currency;
