import React from "react";
import { RadioButtonComponent } from "@/components/shared";
import { FormStateProps } from "../shared-types";

const ReleaseMonth: React.FC<FormStateProps> = ({
  formState,
  setFormState,
}) => {
  const handleClick = (value: number) => {
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
      <div className="flex flex-wrap items-center gap-4">
        <RadioButtonComponent
          selectedValue={formState.verify_token.release_month}
          value={1}
          additionalValue={"Months"}
          handleClick={(value) => handleClick(value as number)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.release_month}
          value={3}
          additionalValue={"Months"}
          handleClick={(value) => handleClick(value as number)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.release_month}
          value={6}
          additionalValue={"Months"}
          handleClick={(value) => handleClick(value as number)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.release_month}
          value={12}
          additionalValue={"Months"}
          handleClick={(value) => handleClick(value as number)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.release_month}
          value={"Other"}
          handleClick={(value) =>
            setFormState((prev) => {
              return {
                ...prev,
                verify_token: {
                  ...prev.verify_token,
                  release_month: value as string,
                  add_release_month: 1,
                },
              };
            })
          }
        />
      </div>
    </div>
  );
};

export default ReleaseMonth;
