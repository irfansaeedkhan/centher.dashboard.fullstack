import React from "react";
import { RadioButtonComponent } from "@/components/shared";
import { FormStateProps } from "../shared-types";

const FeeOptions: React.FC<FormStateProps> = ({ formState, setFormState }) => {
  return (
    <div className="col-span-1 mb-6 w-full text-sm font-medium text-white md:mb-0">
      <label
        htmlFor="fee_option"
        className="mb-4 block font-normal tracking-wide text-gray-shade-14"
      >
        Fee Option
        <span className="text-gradient ml-[2px]">*</span>
      </label>
      <div className="flex flex-col gap-4">
        <RadioButtonComponent
          selectedValue={formState.verify_token.fee_option}
          value={"5% MATIC raised only"}
          handleClick={(value) =>
            setFormState((prev) => {
              return {
                ...prev,
                verify_token: {
                  ...prev.verify_token,
                  fee_option: value as string,
                },
              };
            })
          }
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.fee_option}
          value={"Other"}
          handleClick={(value) =>
            setFormState((prev) => {
              return {
                ...prev,
                verify_token: {
                  ...prev.verify_token,
                  fee_option: value as string,
                },
              };
            })
          }
        />
      </div>
    </div>
  );
};

export default FeeOptions;
