import React from "react";
import dayjs from "dayjs";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { BNBIcon, GradientCopy } from "@/assets/svgs";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import Button from "@/components/button";
import { CgSpinner } from "react-icons/cg";
import { formatEther } from "ethers/lib/utils";
import clsx from "clsx";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { copyText } from "@/utils/copy.text";
import toast from "react-hot-toast";

export const RefDataCardClaimable: React.FC<{
  item: any;
  stakeCoin?: CoinDetails;
  rewardCoin?: CoinDetails;
  claim: any;
  restake: any;
  claimInProcess: string[];
  restakeInProgress: string[];
  reload: any;
}> = ({
  item,
  stakeCoin,
  rewardCoin,
  claim,
  restake,
  claimInProcess,
  restakeInProgress,
  reload,
}) => {
  console.log("in the tab:", item.nextTime, item.claimableReward);

  return (
    <div className="col-span-1 flex flex-col gap-3 rounded-xl border border-gray-shade-3 p-4 fxm:p-6">
      {item.user?.length && (
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
        <div className={textLeft}>Join Date</div>
        <div className={textRight}>
          <span>{dayjs(item.joinedAt * 1000).format("DD-MMM-YYYY")}</span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Staked Amount</div>
        <div className={textRight}>
          <span className="flex h-4 w-4 flex-shrink-0">
            <BNBIcon />
          </span>
          <span>{formatEther(item.stakedAmount)}</span>
          <span>{stakeCoin?.symbol}</span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Claimable Rewards</div>
        <div className={textRight}>
          <span className="flex h-4 w-4 flex-shrink-0">
            <BNBIcon />
          </span>
          <span>{formatEther(item.claimableReward)}</span>
          <span>{rewardCoin?.symbol}</span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Rewards Available</div>
        <div className={textRight}>
          {+item.nextTime > +new Date() / 1000 ? (
            <span>
              <Countdown
                date={new Date(+item.nextTime * 1000)}
                renderer={countdownRenderer}
                onComplete={() => reload()}
              />
            </span>
          ) : item.claimableReward > 0 ? (
            <div className="flex flex-shrink-0 items-center gap-2">
              <Button
                className="text-sm"
                title="Claim"
                borderRounded="10px"
                onClick={async () => await claim([item.user])}
                disabled={
                  claimInProcess.length > 0 || restakeInProgress.length > 0
                }
                loaderIcon={
                  claimInProcess.findIndex((e) => e == item.user) != -1 ? (
                    <CgSpinner className="h-5 animate-spin text-white" />
                  ) : undefined
                }
              />

              <Button
                className="text-sm"
                title="Restake"
                borderRounded="10px"
                onClick={async () => await restake([item.user])}
                disabled={
                  claimInProcess.length > 0 || restakeInProgress.length > 0
                }
                loaderIcon={
                  restakeInProgress.findIndex((e) => e == item.user) != -1 ? (
                    <CgSpinner className="h-5 animate-spin text-white" />
                  ) : undefined
                }
              />
            </div>
          ) : null}
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

const countdownRenderer: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <div className="flex gap-1">
      <p className={countDown}>{days} D</p>
      <p className={countDown}>{hours} H</p>
      <p className={countDown}>{minutes} M</p>
      <p className={countDown}>{seconds} S</p>
    </div>
  );
};
