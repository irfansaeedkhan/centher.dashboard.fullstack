import React from "react";
import dayjs from "dayjs";
import { BNBIcon } from "@/assets/svgs";
import { AllUserReward } from "@/staking/types";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { formatEther } from "ethers/lib/utils";

export const DataCardEarned: React.FC<{
  item: AllUserReward;
  coin: CoinDetails | undefined;
}> = ({ item, coin }) => {
  return (
    <div className="col-span-1 flex flex-col gap-3 rounded-xl border border-gray-shade-3 p-4 fxm:p-6">
      <div className={mainDiv}>
        <div className={textLeft}>Earned Rewards</div>
        <div className={textRight}>
          <span className="flex h-4 w-4 flex-shrink-0">
            <BNBIcon />
          </span>
          <span>{formatEther(item.amount)}</span>
          <span>{coin?.symbol}</span>
        </div>
      </div>
      {item.claimedAt && (
        <div className={mainDiv}>
          <div className={textLeft}>Date Received</div>
          <div className={textRight}>
            <span>
              {dayjs(new Date(+item.claimedAt * 1000)).format("DD-MMM-YYYY")}
            </span>
          </div>
        </div>
      )}

      <div className={mainDiv}>
        <div className={textLeft}>Status</div>
        <div className={textRight}>
          {item.status == "Claimed" ? (
            <span className="flex h-7 w-[85px] items-center justify-center rounded-full bg-red-shade-2/[0.16] text-red-shade-2">
              {item.status}
            </span>
          ) : (
            <span className="flex h-7 w-[85px] items-center justify-center rounded-full bg-green-shade-2/[0.16] text-green-shade-2">
              {item.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const mainDiv = "flex w-full items-center justify-between gap-3";
const textLeft = "text-sm font-medium text-gray-shade-14";
const textRight = "text-sm font-medium text-white flex items-center gap-1";
const countDown =
  "flex h-8 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white text-[11px] font-medium text-black";
