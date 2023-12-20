import React from "react";
import clsx from "clsx";
import { BNBIcon } from "@/assets/svgs";
import SaleRounds from "./sale-rounds";
import Currency from "./currency";
import FeeOptions from "./fee-options";
import ReleaseMonth from "./release_month";
import LiquidityLockups from "./liquidity-lockups";
import { FormStateProps } from "../shared-types";
import { NoteDisclamer } from "../note-disclamer";
import { CustomNumberInput } from "@/components/custom-number-input";
import { formatUnits } from "ethers/lib/utils";

interface Props extends FormStateProps {
  presaleCreationFees: string | number | null;
}

export const VerifyTokenForm: React.FC<Props> = ({
  formState,
  setFormState,
  presaleCreationFees,
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
        <p className="text-gradient flex w-fit gap-0.5 pb-2 pt-1 text-xs font-medium">
          <span>Pool creation fee: </span>
          <span className="flex h-3.5 w-3.5 flex-shrink-0">
            <BNBIcon />
          </span>
          {presaleCreationFees && (
            <span>{formatUnits(presaleCreationFees.toString())} BNB</span>
          )}
        </p>
      </div>
      <SaleRounds formState={formState} setFormState={setFormState} />
      <Currency formState={formState} setFormState={setFormState} />
      <FeeOptions formState={formState} setFormState={setFormState} />
      {formState.verify_token.fee_option === "Other" && (
        <div className={gradientBorderInputMain}>
          <label
            htmlFor="add_fee"
            className={clsx(label, "text-gray-shade-14")}
          >
            Add Fee
          </label>
          <div className={gradientBorderInputParent}>
            <CustomNumberInput
              min={0}
              max={100}
              id="add_fee"
              name="add_fee"
              placeholder="Example: 3%"
              className={gradientBorderInput}
              value={formState.verify_token.add_fee}
              onChange={(value) =>
                setFormState((prev) => {
                  return {
                    ...prev,
                    verify_token: {
                      ...prev.verify_token,
                      add_fee: Number(value),
                    },
                  };
                })
              }
            />
          </div>
        </div>
      )}
      <LiquidityLockups formState={formState} setFormState={setFormState} />
      <ReleaseMonth formState={formState} setFormState={setFormState} />
      <NoteDisclamer />
    </div>
  );
};

const gradientBorderInputParent =
  "focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]";
const gradientBorderInput =
  "block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0";
const gradientBorderInputMain =
  "col-span-1 mb-6 w-full text-sm font-medium text-white md:mb-0";
const label = "block font-normal tracking-wide";
const labelSpan = "text-gradient ml-[2px]";
