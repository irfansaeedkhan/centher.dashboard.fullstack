import React from "react";
import { PresaleDataType } from "../../../_components/launchpad-card-data";

export const ReferralData: React.FC<PresaleDataType> = ({}) => {
  return (
    <div className="flex h-auto w-full flex-col gap-6 bg-black-shade-9 p-4 fxm:p-6">
      <h2 className="text-xl font-semibold leading-7 text-white">
        Referrals Program
      </h2>
      <div className="flex flex-col gap-4">
        <div className={mainDiv}>
          <div className={textLeft}>Your Rewards</div>
          <div className={textRight}></div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Realtime Reward Percentage</div>
          <div className={textRight}></div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Current Rewards</div>
          <div className={textRight}></div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Max Rewards</div>
          <div className={textRight}></div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Total Ref Amount</div>
          <div className={textRight}></div>
        </div>
      </div>
    </div>
  );
};

const mainDiv = "flex w-full items-center justify-between gap-3";
const textLeft = "text-sm font-medium text-gray-shade-14";
const textRight =
  "text-sm font-medium text-white flex flex-shrink-0 items-center gap-1";
