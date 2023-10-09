import React from "react";
import { ethers } from "ethers";
import { RoundInfo } from "@/web3/constants/types";
import { TimeCount } from "./time-count";

interface PresaleCardProps {
  roundInfo: RoundInfo;
}

export const PresaleCard: React.FC<PresaleCardProps> = ({ roundInfo }) => {
  if (!roundInfo) {
    return null;
  }
  let busdPrice = ethers.utils.formatEther(roundInfo.priceForBusd);
  let ntrPrice = ethers.utils.formatEther(roundInfo.priceForNtr);
  return (
    <div className="rounded-2xl bg-background-shade-1 bg-buydao-pattern bg-cover bg-left-top bg-no-repeat p-3.5 fsm:p-8 flg:p-9">
      <div className="content flex flex-col items-center justify-between gap-4 fsm:gap-8 flg:flex-row">
        <div className="max-w-[400px]">
          <h1 className="pb-2.5 text-center text-base font-semibold text-white fsm:text-xl flg:text-left flg:text-[22px]">
            Join with USDT to claim your DXC Tokens
          </h1>
          <div className="relative flex flex-col items-center justify-center gap-2 fsm:flex-row flg:justify-start">
            <div className="w-full max-w-[150px] rounded-10px border border-solid border-white/[0.10] bg-white/[0.04] px-2 py-1 text-center text-[10px] font-semibold text-white backdrop-blur-lg fsm:text-xs">
              1 DXC = {busdPrice} USDT
            </div>
            <div className="w-full max-w-[150px] rounded-10px border border-solid border-white/[0.10] bg-white/[0.04] px-2 py-1 text-center text-[10px] font-semibold text-white backdrop-blur-lg fsm:text-xs">
              1 DXC = {ntrPrice} NTR
            </div>
          </div>
        </div>

        <TimeCount roundInfo={roundInfo} />
      </div>
    </div>
  );
};
