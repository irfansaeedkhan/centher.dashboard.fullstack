import React from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { formatEther } from "ethers/lib/utils";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { copyText } from "@/utils/copy.text";
import { BNBIcon, USDTIcon, GradientCopy } from "@/assets/svgs";
import { ClaimableDataType } from "../data";

export const ReferralClaimableCard: React.FC<ClaimableDataType> = ({
  ...item
}) => {
  return (
    <div className="col-span-1 flex flex-col gap-4 rounded-xl border border-gray-shade-3 p-4 fxm:p-6">
      <div className={mainDiv}>
        <div className={textLeft}>User Address</div>
        <div className={clsx(textRight, "group")}>
          <span className="group-hover:textGradient">
            {sliceAccountAddress(item.user)}
          </span>
          <GradientCopy
            className="cursor-pointer"
            onClick={async () => {
              await copyText(item.user);
              toast.success("Address copied!");
            }}
          />
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Booking Date</div>
        <div className={textRight}>
          <span>
            {dayjs(Number(item.blockTimestamp) * 1000).format("DD-MMM-YYYY")}
          </span>
        </div>
      </div>

      <div className={mainDiv}>
        <div className={textLeft}>Booking Round</div>
        <div className={textRight}>
          <span>{item.round + 1}</span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Rewards Available</div>
        <div className={textRight}>
          <span className="flex h-4 w-4 flex-shrink-0">
            {item.fundType === 0 ? <BNBIcon /> : <USDTIcon />}
          </span>
          <span>{Number(formatEther(item.amount)).toFixed(3)}</span>
          <span>{item.fundType === 0 ? "BNB" : "USDT"}</span>
        </div>
      </div>
    </div>
  );
};

const mainDiv = "flex w-full items-center justify-between gap-3";
const textLeft = "text-sm font-medium text-gray-shade-14";
const textRight = "text-sm font-medium text-white flex items-center gap-1";
