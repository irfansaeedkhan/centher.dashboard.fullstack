import React from "react";
import dayjs from "dayjs";
import { BNBIcon, GradientCopy } from "@/assets/svgs";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { formatEther } from "ethers/lib/utils";
import clsx from "clsx";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { copyText } from "@/utils/copy.text";
import toast from "react-hot-toast";

export const RefDataCardEarned: React.FC<{
  item: any;
  coin: CoinDetails | undefined;
}> = ({ item, coin }) => {
  return (
    <div className="col-span-1 flex flex-col gap-3 rounded-xl border border-gray-shade-3 p-4 fxm:p-6">
      {item.referral?.length ? (
        <div className={mainDiv}>
          <div className={textLeft}>User Address</div>
          <div className={clsx(textRight, "group")}>
            <span className="group-hover:textGradient">
              {sliceAccountAddress(item.referral)}
            </span>
            <GradientCopy
              className="cursor-pointer"
              onClick={async () => {
                await copyText(item.referral ?? "");
                toast.success("Address copied!");
              }}
            />
          </div>
        </div>
      ) : (
        <div className={mainDiv}>
          <div className={textLeft}>User Address</div>
          <div className={clsx(textRight, "group")}>
            <span className="group-hover:textGradient">
              {sliceAccountAddress(item.user)}
            </span>
            <GradientCopy
              className="cursor-pointer"
              onClick={async () => {
                await copyText(item.user ?? "");
                toast.success("Address copied!");
              }}
            />
          </div>
        </div>
      )}
      {+item.level > 0 && (
        <div className={mainDiv}>
          <div className={textLeft}>Level</div>
          <div className={textRight}>
            <span>{item.level}</span>
          </div>
        </div>
      )}

      <div className={mainDiv}>
        <div className={textLeft}>Earned Rewards</div>
        <div className={textRight}>
          <span className="flex h-4 w-4 flex-shrink-0">
            <BNBIcon />
          </span>
          <span>
            {formatEther(
              item.claimableReward ? item.claimableReward : item.amount
            )}
          </span>
          <span>{coin?.symbol}</span>
        </div>
      </div>

      {item.destination && (
        <div className={mainDiv}>
          <div className={textLeft}>Date Received</div>
          <div className={textRight}>
            <span>
              {dayjs(new Date(+item.createdAt * 1000)).format("DD-MMM-YYYY")}
            </span>
          </div>
        </div>
      )}

      <div className={mainDiv}>
        <div className={textLeft}>Status</div>
        <div className={textRight}>
          {item.destination ? (
            <span className="flex h-7 w-[85px] items-center justify-center rounded-full bg-red-shade-2/[0.16] text-red-shade-2">
              Claimed
            </span>
          ) : (
            <span className="flex h-7 w-[85px] items-center justify-center rounded-full bg-green-shade-2/[0.16] text-green-shade-2">
              Claimable
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
