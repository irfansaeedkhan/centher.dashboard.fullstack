import React from "react";
import { RadioButtonComponent } from "@/components/shared";
import { FormStateProps } from "../shared-types";

const ReleaseMonth: React.FC<FormStateProps> = ({
  formState,
  setFormState,
}) => {
  const handleClick = (value: string) => {
    setFormState((prev) => {
      return {
        ...prev,
        verify_token: { ...prev.verify_token, release_month: value },
      };
    });
  };
  return (
    <div className="col-span-1 mb-6 w-full text-sm font-medium text-white md:mb-0">
      <label
        htmlFor="currency"
        className="mb-4 block font-normal tracking-wide text-gray-shade-14"
      >
        Release Month
        <span className="text-gradient ml-[2px]">*</span>
      </label>
      <div className="flex items-center gap-4">
        <RadioButtonComponent
          selectedValue={formState.verify_token.release_month}
          value={"0 Day"}
          handleClick={(value) => handleClick(value as string)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.release_month}
          value={"30 Days"}
          handleClick={(value) => handleClick(value as string)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.release_month}
          value={"90 Days"}
          handleClick={(value) => handleClick(value as string)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.release_month}
          value={"120 Days"}
          handleClick={(value) => handleClick(value as string)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.release_month}
          value={"360 Days"}
          handleClick={(value) => handleClick(value as string)}
        />
      </div>
    </div>
  );
};

export default ReleaseMonth;
