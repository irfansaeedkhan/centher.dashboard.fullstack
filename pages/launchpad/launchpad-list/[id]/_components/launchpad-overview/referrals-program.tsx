import React from "react";
import { PresaleDataType } from "../../../_components/launchpad-card-data";

export const ReferralsProgram: React.FC<PresaleDataType> = ({}) => {
  return (
    <div className="col-span-1 flex h-auto w-full flex-col gap-6 rounded-xl bg-black-shade-9 p-4 fxm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex w-full items-center justify-between gap-4">
          <h2 className="text-sm font-medium leading-6 text-white">
            Referrals Program
          </h2>
          <span className="rounded-10px bg-brand-primary/[0.16] px-3 text-xs font-semibold leading-6 text-brand-primary">
            3%
          </span>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Level 1</div>
          <div className={textRight}>1%</div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Level 2</div>
          <div className={textRight}>2%</div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Level 3</div>
          <div className={textRight}>3%</div>
        </div>
      </div>
    </div>
  );
};

const mainDiv = "flex w-full items-center justify-between gap-3";
const textLeft = "text-sm font-medium text-gray-shade-14";
const textRight =
  "text-sm font-medium text-white flex flex-shrink-0 items-center gap-1";
