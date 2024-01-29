import React from "react";
import dayjs from "dayjs";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { BNBIcon } from "@/assets/svgs";
import { stakeReward } from "@/staking/types";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import Button from "@/components/button";
import { CgSpinner } from "react-icons/cg";
import { formatEther } from "ethers/lib/utils";

export const DataCardClaimable: React.FC<{
  item: stakeReward;
  coin?: CoinDetails;
  claim: any;
  restake: any;
  claimInProcess: number[];
  restakeInProgress: number[];
  reload: any;
}> = ({
  item,
  coin,
  claim,
  restake,
  claimInProcess,
  restakeInProgress,
  reload,
}) => {
  return (
    <div className="col-span-1 flex flex-col gap-3 rounded-xl border border-gray-shade-3 p-4 fxm:p-6">
      <div className={mainDiv}>
        <div className={textLeft}>Staking Started</div>
        <div className={textRight}>
          <span>
            {dayjs(item.stake.createdAt * 1000).format("DD-MMM-YYYY")}
          </span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Staked Amount</div>
        <div className={textRight}>
          <span className="flex h-4 w-4 flex-shrink-0">
            <BNBIcon />
          </span>
          <span>{formatEther(item.stake.amount)}</span>
          <span>{coin?.symbol}</span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Claimable Rewards</div>
        <div className={textRight}>
          <span className="flex h-4 w-4 flex-shrink-0">
            <BNBIcon />
          </span>
          <span>{formatEther(item.amount)}</span>
          <span>{coin?.symbol}</span>
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
          ) : (
            <div className="flex flex-shrink-0 items-center gap-2">
              <Button
                className="text-sm"
                title="Claim"
                borderRounded="10px"
                onClick={async () => await claim([item.stake.id])}
                disabled={
                  claimInProcess.length > 0 || restakeInProgress.length > 0
                }
                loaderIcon={
                  claimInProcess.findIndex((e) => e == item.stake.id) != -1 ? (
                    <CgSpinner className="h-5 animate-spin text-white" />
                  ) : undefined
                }
              />

              <Button
                className="text-sm"
                title="Restake"
                borderRounded="10px"
                onClick={async () => await restake([item.stake.id])}
                disabled={
                  claimInProcess.length > 0 || restakeInProgress.length > 0
                }
                loaderIcon={
                  restakeInProgress.findIndex((e) => e == item.stake.id) !=
                  -1 ? (
                    <CgSpinner className="h-5 animate-spin text-white" />
                  ) : undefined
                }
              />
            </div>
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
