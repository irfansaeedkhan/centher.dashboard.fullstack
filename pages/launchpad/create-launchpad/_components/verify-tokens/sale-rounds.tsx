import React from "react";
import RadioButtonComponent from "../radio-button-component";
import { FormState } from "../../index.page";

interface Props {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}

const SaleRounds: React.FC<Props> = ({ formState, setFormState }) => {
  const handleClick = (value: number) => {
    setFormState((prev) => {
      return {
        ...prev,
        verify_token: { ...prev.verify_token, sale_rounds: value },
        rounds_settings: {
          round: Array.from({ length: value }, (_, index) => index + 1).map(
            (index) => {
              return {
                round_no: index,
                total_selling_amount: "",
                soft_cap_busd: "",
                start_time: "",
                end_time: "",
                min_contribution: "",
                max_contribution: "",
              };
            }
          ),
        },
      };
    });
  };

  return (
    <div className="col-span-1 mb-6 w-full text-sm font-medium text-white md:mb-0">
      <label
        htmlFor="sale_rounds"
        className="mb-4 block font-normal tracking-wide"
      >
        Select amount of sale rounds
        <span className="text-gradient ml-[2px]">*</span>
      </label>
      <div className="flex items-center gap-4">
        <RadioButtonComponent
          selectedValue={formState.verify_token.sale_rounds}
          value={1}
          handleClick={(value) => handleClick(value as number)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.sale_rounds}
          value={2}
          handleClick={(value) => handleClick(value as number)}
        />
        <RadioButtonComponent
          selectedValue={formState.verify_token.sale_rounds}
          value={3}
          handleClick={(value) => handleClick(value as number)}
        />
      </div>
    </div>
  );
};

export default SaleRounds;
