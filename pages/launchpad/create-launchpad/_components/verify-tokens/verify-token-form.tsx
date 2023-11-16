import React from "react";
import SaleRounds from "./sale-rounds";
import Currency from "./currency";
import FeeOptions from "./fee-options";
import { FormStateProps } from "../shared-types";

const VerifyTokenForm: React.FC<FormStateProps> = ({
  formState,
  setFormState,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => {
      return {
        ...prev,
        verify_token: {
          ...prev.verify_token,
          [name]: value,
        },
      };
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={gradientBorderInputMain}>
        <label htmlFor="token_address" className={label}>
          Token Address
          <span className={labelSpan}>*</span>
        </label>
        <div className={gradientBorderInputParent}>
          <input
            type="text"
            id="token_address"
            name="token_address"
            placeholder="Example: Centher Token"
            className={gradientBorderInput}
            value={formState.verify_token.token_address}
            onChange={handleChange}
          />
        </div>
        <p className="text-gradient w-fit pb-2 pt-1 text-xs font-medium">
          Pool creation fee: 100 BNB
        </p>
      </div>
      <SaleRounds formState={formState} setFormState={setFormState} />
      <Currency formState={formState} setFormState={setFormState} />
      <FeeOptions formState={formState} setFormState={setFormState} />
      <p className="text-sm text-gray-shade-14">
        <span className="text-white">Note: </span>
        Disclaimer: The information provided shall not in any way constitute a
        recommendation as to whether you should invest in any product discussed.
        We accept no liability for any loss occasioned to any person acting or
        refraining from action as a result of any material provided or
        published.
      </p>
      <div className={gradientBorderInputMain}>
        <label htmlFor="liquidity_lockup" className={label}>
          Liquidity lockup (days)
          <span className={labelSpan}>*</span>
        </label>
        <div className={gradientBorderInputParent}>
          <input
            type="text"
            id="liquidity_lockup"
            name="liquidity_lockup"
            placeholder="Example: 0"
            className={gradientBorderInput}
            value={formState.verify_token.liquidity_lockup}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyTokenForm;

const gradientBorderInputParent =
  "focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]";
const gradientBorderInput =
  "block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0";
const gradientBorderInputMain =
  "col-span-1 mb-6 w-full text-sm font-medium text-white md:mb-0";
const label = "block font-normal tracking-wide";
const labelSpan = "text-gradient ml-[2px]";
