import React from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { formatEther } from "ethers/lib/utils";
import { BNBIcon, GradientCopy } from "@/assets/svgs";
import { copyText } from "@/utils/copy.text";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { EarnedDataType } from "../data";

export const ReferralEarnedCard: React.FC<EarnedDataType> = ({ ...item }) => {
  return (
    <div className="col-span-1 flex flex-col gap-4 rounded-xl border border-gray-shade-3 p-4 fxm:p-6">
      <div className={mainDiv}>
        <div className={textLeft}>User Address</div>
        <div className={clsx(textRight, "group")}>
          <span className="group-hover:textGradient">
            {sliceAccountAddress(item.user_address)}
          </span>
          <GradientCopy
            className="cursor-pointer"
            onClick={async () => {
              await copyText(item.user_address);
              toast.success("Address copied!");
            }}
          />
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Earned Rewards</div>
        <div className={textRight}>
          <span className="flex h-4 w-4 flex-shrink-0">
            <BNBIcon />
          </span>
          <span>
            {Number(formatEther(item.earned_reward_amount)).toFixed(3)}
          </span>
          <span>{item.earned_reward_amount_coin}</span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Date Received</div>
        <div className={textRight}>
          <span>{dayjs(item.date_received).format("DD-MMM-YYYY")}</span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Status</div>
        <div className={textRight}>
          {item.status === "Claimed" ? (
            <span className="flex h-7 w-[85px] items-center justify-center rounded-full bg-red-shade-2/[0.16] text-red-shade-2">
              Claimed
            </span>
          ) : (
            <span className="flex h-7 w-fit items-center justify-center rounded-full bg-green-shade-2/[0.16] px-3 text-green-shade-2">
              UnClaimed
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
