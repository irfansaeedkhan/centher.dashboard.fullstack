import { CrownIcon, GiftIcon, StakingUsers } from "@/assets/svgs";
import React from "react";

export const RewardsTopSection = () => {
  return (
    <div className="flex w-full flex-col gap-5 rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
      <div className="text-[min(10vw, 20px)] font-semibold text-white">
        Referrals Overview
      </div>
      <div className="grid-col-1 grid max-w-full flex-grow flex-wrap gap-5 fmd:grid-cols-2 flg:grid-cols-3">
        <div className="col-span-2 flex h-[48px] w-full gap-4 rounded-xl bg-transparent fmd:col-span-1">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-red-shade-2/60 bg-red-shade-2/10">
            <GiftIcon />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-shade-14">
              Total Claimed Rewards
            </p>
            <p className="mt-[6px] font-semibold text-white">11.1162 DXC</p>
          </div>
        </div>
        <div className="col-span-2 flex h-[48px] w-full gap-4 rounded-xl bg-transparent fmd:col-span-1">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-yellow-shade-2/60 bg-yellow-shade-2/10">
            <CrownIcon />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-shade-14">
              Total Claimable Rewards
            </p>
            <p className="mt-[6px] font-semibold text-white">11.1162 DXC</p>
          </div>
        </div>
        <div className="col-span-2 flex h-[48px] w-full gap-4 rounded-xl bg-transparent flg:col-span-1">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-green-shade-2/60 bg-green-shade-2/10">
            <StakingUsers />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-shade-14">
              Total Referrals
            </p>
            <p className="mt-[6px] font-semibold text-white">20000000</p>
          </div>
        </div>
      </div>
    </div>
  );
};
