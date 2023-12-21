import React, { useState } from "react";
import clsx from "clsx";
import PreviwCommonComponent from "./previw-common-component";
import { FormStateProps, TokenDetail } from "../shared-types";

interface Props extends FormStateProps {
  tokenDetails: TokenDetail | null;
  totalPresaleSellingAmount: number;
}

export const Preview: React.FC<Props> = ({
  formState,
  tokenDetails,
  totalPresaleSellingAmount,
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  return (
    <div className="flex flex-col gap-6">
      <div className="mt-2 flex flex-col gap-2">
        <h3 className="textGradient text-lg font-semibold">
          Review and submit
        </h3>
        <p className="w-full max-w-[422px] text-sm leading-6 text-gray-shade-18">
          Make sure you to check all provided details, if all go please click on
          submit.
        </p>
      </div>
      <div className={boxMianDiv}>
        <div className={bigBox}>
          <h6 className={h6Text}>Total</h6>
          <span className={spanText}>
            {totalPresaleSellingAmount} {tokenDetails?.token_symbol}{" "}
          </span>
        </div>
        <div className={smallBox}>
          <h6 className={h6Text}>Symbol</h6>
          <span className={spanText}>{tokenDetails?.token_symbol ?? "-"}</span>
        </div>
      </div>
      <div className={boxMianDiv}>
        <div className={bigBox}>
          <h6 className={h6Text}>Name</h6>
          <span className={spanText}>{tokenDetails?.token_name ?? "-"}</span>
        </div>
        <div className={smallBox}>
          <h6 className={h6Text}>Decimals</h6>
          <span className={spanText}>{tokenDetails?.token_decimal ?? "-"}</span>
        </div>
      </div>
      <div className="mb-3 flex w-full items-center gap-6">
        {Array.from(
          { length: formState.verify_token.sale_rounds },
          (_, index) => index
        ).map((index: number) => (
          <div
            key={index}
            className={clsx(
              "text-sm text-white",
              currentRound === index + 1
                ? "myBox w-fit font-medium"
                : "cursor-pointer"
            )}
            onClick={() => {
              setCurrentRound(index + 1);
            }}
          >
            Round {index + 1}
          </div>
        ))}
      </div>
      <PreviwCommonComponent
        total_selling_amount={
          formState.rounds_settings.round[currentRound - 1].total_selling_amount
        }
        soft_cap_busd={
          formState.rounds_settings.round[currentRound - 1].soft_cap_busd
        }
        start_time={
          formState.rounds_settings.round[currentRound - 1].start_time
        }
        end_time={formState.rounds_settings.round[currentRound - 1].end_time}
      />
      <div className={roundMainDiv}>
        <h6 className={h6Text}>Liquidity lockup time</h6>
        <span className={spanText2}>
          {formState.verify_token.liquidity_lockup}
        </span>
      </div>
      <div className={roundMainDiv}>
        <h6 className={h6Text}>Website</h6>
        <span className={spanText2}>
          {formState.add_additional_info.website_url}
        </span>
      </div>
      <div className="flex gap-5">
        <h6 className={h6Text}>Description:</h6>
        <span className={spanText2}>
          {formState.add_additional_info.description}
        </span>
      </div>
    </div>
  );
};

const h6Text = "text-sm text-gray-shade-18";
const spanText = "fmd:text-2xl text-white fsm:text-xl text-lg font-semibold";
const spanText2 = "text-sm font-semibold text-white";
const boxMianDiv = "w-fll flex h-[118px] gap-6";
const roundMainDiv = "flex w-full items-center justify-between gap-3";
const bigBox =
  "h-ful flex w-full justify-between max-w-[444px] flex-col gap-[10px] rounded-[10px] border border-gray-shade-3 px-3 py-4 fmd:px-4 fmd:py-6";
const smallBox =
  "flex h-full w-full max-w-[160px] justify-between flex-col gap-[10px] rounded-[10px] border border-gray-shade-3 px-3 py-4 fmd:px-4 fmd:py-6";
