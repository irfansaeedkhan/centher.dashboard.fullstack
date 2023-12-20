import React from "react";
import { FormStateProps, TokenDetail } from "../shared-types";

interface Props extends FormStateProps {
  tokenDetails: TokenDetail | null;
}

export const Preview: React.FC<Props> = ({ formState, tokenDetails }) => {
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
            {tokenDetails?.total_selling ?? 0} {tokenDetails?.token_symbol}{" "}
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
      <div className={roundMainDiv}>
        <h6 className={h6Text}>Total Selling amount</h6>
        <span className={spanText2}>
          {formState.rounds_settings?.round[0]?.total_selling_amount}
        </span>
      </div>
      <div className={roundMainDiv}>
        <h6 className={h6Text}>Soft cap</h6>
        <span className={spanText2}>
          {formState.rounds_settings?.round[0]?.soft_cap_busd}
        </span>
      </div>
      <div className={roundMainDiv}>
        <h6 className={h6Text}>Liquidity</h6>
        <span className={spanText2}>{formState.verify_token.fee_option}</span>
      </div>
      <div className={roundMainDiv}>
        <h6 className={h6Text}>Start Time</h6>
        <span className={spanText2}>
          {formState.rounds_settings?.round[0]?.start_time?.toDateString()}
        </span>
      </div>
      <div className={roundMainDiv}>
        <h6 className={h6Text}>End Time</h6>
        <span className={spanText2}>
          {formState.rounds_settings?.round[0]?.end_time?.toDateString()}
        </span>
      </div>
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
          Describe something or someone. [count] Reporters called the scene “a
          disaster area,” and I think that was an accurate descri-ption. I
          applied for the position after reading the job description.
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
