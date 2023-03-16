import React from "react";

import { RoundInfo } from "@/web3/constants/types";

import { TimeCountV2 } from "./time.count.vs";
import { SnakeArrow } from "@/assets/svgs";

interface PresaleCardProps {
  roundInfo: RoundInfo;
}

export const PresaleCardV2: React.FC<PresaleCardProps> = ({ roundInfo }) => {
  return (
    <div
      className={`rounded-2xl bg-background-shade-1 bg-buydao-pattern bg-cover bg-left-top bg-no-repeat p-3.5 fsm:p-8 flg:p-14`}
    >
      <div
        className={`content flex flex-col items-center justify-between gap-4 fsm:gap-8 flg:flex-row`}
      >
        <div className="max-w-[388px]">
          <h1
            className={`pb-2.5 text-center text-base font-semibold text-white fsm:text-xl flg:text-left flg:text-2xl`}
          >
            Join with BUSD to Claim Your DXC
          </h1>
          <div className="relative flex flex-col items-center justify-center gap-2 fsm:flex-row flg:justify-start">
            <span className="absolute hidden fsm:right-[-75px] fsm:top-[-2.5rem] fsm:block flg:right-[-60px] flg:top-[-4rem]">
              <SnakeArrow />
            </span>
            <div
              className={`w-full max-w-[190px] rounded-10px border border-solid border-white/20 bg-white/20 py-1 px-2.5 text-center text-[10px] font-bold text-white backdrop-blur-lg fsm:text-xs flg:text-sm`}
            >
              1 BUSD = {roundInfo?.priceForBusd} DXC
            </div>
            <div
              className={`w-full max-w-[190px] rounded-10px border border-solid border-white/20 bg-white/20 py-1 px-2.5 text-center text-[10px] font-bold text-white backdrop-blur-lg fsm:text-xs flg:text-sm`}
            >
              {roundInfo?.lockMonths} Months Lock Period
            </div>
          </div>
        </div>

        <TimeCountV2 roundInfo={roundInfo} />
      </div>
    </div>
  );
};
