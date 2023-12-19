import React, { useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { BNBIcon } from "@/assets/svgs";
import { DateInputField } from "@/components/shared";
import { CurrentComponent, FormStateProps } from "../shared-types";
import { NoteDisclamer } from "../note-disclamer";
import { CustomNumberInput } from "@/components/custom-number-input";

export const RoundsSettingsForm: React.FC<FormStateProps> = ({
  formState,
  setFormState,
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentComponent, setCurrentComponent] = useState<CurrentComponent>({
    token_price: "",
    total_selling_amount: "",
    soft_cap_busd: "",
    start_time: null,
    end_time: null,
    min_contribution: "",
    max_contribution: "",
  });

  const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentComponent((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setFormState((prev) => {
      return {
        ...prev,
        rounds_settings: {
          ...prev.rounds_settings,
          round: prev.rounds_settings.round.map((round) => {
            if (round.round_no === currentRound) {
              return {
                ...round,
                [name]: value,
              };
            } else {
              return round;
            }
          }),
        },
      };
    });
  };

  const handleDateChangeEvent = (value: Date | null, name: string) => {
    setCurrentComponent((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setFormState((prev) => {
      return {
        ...prev,
        rounds_settings: {
          ...prev.rounds_settings,
          round: prev.rounds_settings.round.map((round) => {
            if (round.round_no === currentRound) {
              return {
                ...round,
                [name]: value,
              };
            } else {
              return round;
            }
          }),
        },
      };
    });
  };

  return (
    <div>
      <div className="mb-3 flex w-full items-center gap-6">
        {Array.from(
          { length: formState.verify_token.sale_rounds },
          (_, index) => index
        ).map((index: number) => (
          <div
            key={index}
            className={clsx(
              "text-xl font-semibold",
              currentRound === index + 1
                ? "text-white"
                : "cursor-pointer text-gray-shade-1"
            )}
            onClick={() => {
              if (
                currentComponent.total_selling_amount === "" ||
                currentComponent.soft_cap_busd === "" ||
                currentComponent.start_time === null ||
                currentComponent.end_time === null ||
                currentComponent.min_contribution === "" ||
                currentComponent.max_contribution === ""
              ) {
                toast.error("Please fill all the fields");
                return;
              }
              setFormState((prev) => {
                return {
                  ...prev,
                  rounds_settings: {
                    ...prev.rounds_settings,
                    round: [
                      ...prev.rounds_settings.round,
                      {
                        round_no: index + 1,
                        token_price: currentComponent.token_price,
                        total_selling_amount:
                          currentComponent.total_selling_amount,
                        soft_cap_busd: currentComponent.soft_cap_busd,
                        start_time: currentComponent.start_time,
                        end_time: currentComponent.end_time,
                        min_contribution: currentComponent.min_contribution,
                        max_contribution: currentComponent.max_contribution,
                      },
                    ],
                  },
                };
              });
              setCurrentRound(index + 1);
              setCurrentComponent({
                total_selling_amount: "",
                token_price: "",
                soft_cap_busd: "",
                start_time: null,
                end_time: null,
                min_contribution: "",
                max_contribution: "",
              });
            }}
          >
            Round {index + 1}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-5">
        <div className={gradientBorderInputMain}>
          <label htmlFor="token_price" className={label}>
            Price/Token
            <span className={labelSpan}>*</span>
          </label>
          <div className={gradientBorderInputParent}>
            <CustomNumberInput
              id="token_price"
              name="token_price"
              placeholder="Example: 100"
              className={gradientBorderInput}
              value={
                formState.rounds_settings.round[currentRound - 1].token_price ??
                currentComponent.token_price
              }
              onChange={handleChangeEvent}
            />
          </div>
          <p className="text-gradient flex w-fit gap-0.5 pb-2 pt-1 text-xs font-medium">
            <span className="flex h-3.5 w-3.5 flex-shrink-0">
              <BNBIcon />
            </span>
            <span>00 BNB</span>
            <span> = </span>
            <span>00 Token</span>
          </p>
        </div>
        <div className={gradientBorderInputMain}>
          <label htmlFor="total_selling_amount" className={label}>
            Total Selling Amount
            <span className={labelSpan}>*</span>
          </label>
          <div className={gradientBorderInputParent}>
            <CustomNumberInput
              id="total_selling_amount"
              name="total_selling_amount"
              placeholder="Example: 100"
              className={gradientBorderInput}
              value={
                formState.rounds_settings.round[currentRound - 1]
                  .total_selling_amount ?? currentComponent.total_selling_amount
              }
              onChange={handleChangeEvent}
            />
          </div>
        </div>
        <div className={gradientBorderInputMain}>
          <label htmlFor="soft_cap_busd" className={label}>
            Soft Cap Busd
            <span className={labelSpan}>*</span>
          </label>
          <div className={gradientBorderInputParent}>
            <CustomNumberInput
              id="soft_cap_busd"
              name="soft_cap_busd"
              placeholder="Example: 0"
              className={gradientBorderInput}
              value={
                formState.rounds_settings.round[currentRound - 1]
                  .soft_cap_busd ?? currentComponent.soft_cap_busd
              }
              onChange={handleChangeEvent}
            />
          </div>
        </div>
        <p className="textGradient w-fit text-[13px] leading-5">
          Enter the percentage of funds raised that should be allocated to the
          liquidity pool (Min 51%, Max 100%)
          <br />
          Ex: How many tokens will I receive if I spend 1 BNB? The amount is
          going to be lower to allow a higher listing price.
        </p>
        <div className={gridParent}>
          <DateInputField
            title="Start Time"
            type="datetime"
            value={
              formState.rounds_settings.round[currentRound - 1].start_time ??
              currentComponent.start_time
            }
            handleChangeEvent={(value: Date | null) =>
              handleDateChangeEvent(value, "start_time")
            }
          />
          <DateInputField
            title="End Time"
            type="datetime"
            value={
              formState.rounds_settings.round[currentRound - 1].end_time ??
              currentComponent.end_time
            }
            handleChangeEvent={(value: Date | null) =>
              handleDateChangeEvent(value, "end_time")
            }
          />
        </div>
        <div className={gridParent}>
          <div className={gradientBorderInputMain}>
            <label htmlFor="min_contribution" className={label}>
              Min Contribution
              <span className={labelSpan}>*</span>
            </label>
            <div className={gradientBorderInputParent}>
              <input
                type="text"
                id="min_contribution"
                name="min_contribution"
                placeholder="Example: 0"
                className={gradientBorderInput}
                value={
                  formState.rounds_settings.round[currentRound - 1]
                    .min_contribution ?? currentComponent.min_contribution
                }
                onChange={handleChangeEvent}
              />
            </div>
          </div>
          <div className={gradientBorderInputMain}>
            <label htmlFor="max_contribution" className={label}>
              Max Contribution
              <span className={labelSpan}>*</span>
            </label>
            <div className={gradientBorderInputParent}>
              <input
                type="text"
                id="max_contribution"
                name="max_contribution"
                placeholder="Example: 0"
                className={gradientBorderInput}
                value={
                  formState.rounds_settings.round[currentRound - 1]
                    .max_contribution ?? currentComponent.max_contribution
                }
                onChange={handleChangeEvent}
              />
            </div>
          </div>
        </div>
        <NoteDisclamer />
      </div>
    </div>
  );
};

const gradientBorderInputParent =
  "focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]";
const gradientBorderInput =
  "block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0";
const gradientBorderInputMain =
  "col-span-full mb-6 text-sm font-medium text-white fmd:mb-0 fmd:col-span-1";
const label = "block font-normal tracking-wide";
const labelSpan = "text-gradient ml-[2px]";
const gridParent = "grid gap-5 fmd:grid-cols-2";
