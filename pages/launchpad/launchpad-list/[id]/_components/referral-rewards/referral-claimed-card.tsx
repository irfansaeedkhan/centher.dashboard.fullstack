import React from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { formatEther } from "ethers/lib/utils";
import { BNBIcon, USDTIcon, GradientCopy } from "@/assets/svgs";
import { copyText } from "@/utils/copy.text";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { ClaimedDataType } from "../data";

export const ReferralClaimedCard: React.FC<ClaimedDataType> = ({ ...item }) => {
  return (
    <div className="relative col-span-1 flex flex-col gap-4 rounded-xl border border-gray-shade-3 p-4 fxm:p-6">
      <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <div className="flex w-fit items-center justify-center rounded-xl border border-gray-shade-3 bg-[#1E1F28] px-3 py-1">
          <span
            className={clsx(
              "text-sm font-medium",
              item.amount
                ? "staking-text-gradient-staked"
                : "staking-text-gradient-unstaked"
            )}
          >
            {item.amount ? "Claimed to wallet" : "Restaked by User"}
          </span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>User Address</div>
        <div className={clsx(textRight, "group")}>
          <span className="group-hover:textGradient">
            {sliceAccountAddress(item.referrer)}
          </span>
          <GradientCopy
            className="cursor-pointer"
            onClick={async () => {
              await copyText(item.referrer);
              toast.success("Address copied!");
            }}
          />
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Claim Date</div>
        <div className={textRight}>
          <span>
            {dayjs(Number(item.blockTimestamp) * 1000).format("DD-MMM-YYYY")}
          </span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Claimed Amount</div>
        <div className={textRight}>
          <span className="flex h-4 w-4 flex-shrink-0">
            {item.fundType === 0 ? <BNBIcon /> : <USDTIcon />}
          </span>
          <span>{Number(formatEther(item.amount)).toFixed(3)}</span>
          <span>{item.fundType === 0 ? "BNB" : "USDT"}</span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Transaction Hash</div>
        <div className={clsx(textRight, "group")}>
          <span className="group-hover:textGradient">
            {sliceAccountAddress(item.transactionHash)}
          </span>
          <GradientCopy
            className="cursor-pointer"
            onClick={async () => {
              await copyText(item.transactionHash);
              toast.success("Address copied!");
            }}
          />
        </div>
      </div>
    </div>
  );
};

const mainDiv = "flex w-full items-center justify-between gap-3";
const textLeft = "text-sm font-medium text-gray-shade-14";
const textRight = "text-sm font-medium text-white flex items-center gap-1";
