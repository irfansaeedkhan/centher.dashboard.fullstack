import React from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import dayjs from "dayjs";
import { DXCIconBG, GradientCopy } from "@/assets/svgs";
import { copyText } from "@/utils/copy.text";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { ClaimedRewards } from "@/staking/types/rewards.interface";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { formatEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
interface ComponentProp {
  data: ClaimedRewards;
  tax: number;
  index: number;
  tokenName: string;
  tokenDecimals: number;
}
export const DataCardClaimed: React.FC<ComponentProp> = (props) => {
  const total = BigNumber.from(props.data.amount).add(props.data.paidTax);
  return (
    <div className="relative col-span-1 flex flex-col gap-3 rounded-xl border border-gray-shade-3 p-4 pt-6 fxm:p-6">
      <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <div className="flex w-fit items-center justify-center rounded-xl border border-gray-shade-3 bg-[#1E1F28] px-3 py-1">
          <span
            className={clsx(
              "text-center text-xs font-medium fxm:text-sm",
              props.data.destination == "wallet"
                ? "staking-text-gradient-staked"
                : "staking-text-gradient-unstaked"
            )}
          >
            {props.data.destination == "wallet"
              ? "Claimed to wallet"
              : "Restaked by User"}
          </span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Date</div>
        <div className={textRight}>
          <span>
            {dayjs(props.data.createdAt * 1000).format("DD-MMM-YYYY")}
          </span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>
          {" "}
          {props.data.destination == "wallet"
            ? "Claim Amount"
            : "Restake Amount"}
        </div>
        <div className={textRight}>
          <DXCIconBG className="flex size-4 flex-shrink-0" />
          <span>{Number(normalizeValue(formatEther(total))).toFixed(4)}</span>
          <span>{props.tokenName}</span>
        </div>
      </div>
      {props.tax > 0 && props.data.destination == "wallet" ? (
        <>
          {" "}
          <div className={mainDiv}>
            <div className={textLeft}>Burn Tax</div>
            <div className={textRight}>
              <span>{props.tax / 100}%</span>
            </div>
          </div>
          <div className={mainDiv}>
            <div className={textLeft}>Burned Amount</div>
            <div className={textRight}>
              <DXCIconBG className="flex size-4 flex-shrink-0" />
              <span>
                {Number(
                  formatEther(BigNumber.from(props.data.paidTax))
                ).toFixed(4)}
              </span>
              <span>{props.tokenName}</span>
            </div>
          </div>
        </>
      ) : null}
      <div className={mainDiv}>
        <div className={textLeft}>Net Profit</div>
        <div className={textRight}>
          <DXCIconBG className="flex size-4 flex-shrink-0" />
          <span>{Number(formatEther(props.data.amount)).toFixed(4)}</span>
          <span>{props.tokenName}</span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Claim Number</div>
        <div className={textRight}>
          <span>{props.index}</span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Transaction Hash</div>
        <div className={clsx(textRight, "group")}>
          <span className="group-hover:textGradient">
            {sliceAccountAddress(props.data.txId)}
          </span>
          <GradientCopy
            className="cursor-pointer"
            onClick={async () => {
              await copyText(props.data.txId ?? "");
              toast.success("Trx hash copied!");
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
