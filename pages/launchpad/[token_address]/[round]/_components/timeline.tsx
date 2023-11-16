import React from "react";
import clsx from "clsx";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { formatNum2DispNum } from "@/utils/format.address";
import { ClaimCentherFrom } from "@/web3/blockchain/types";

interface TimelineProps {
  isBUSD: boolean;
  index: number;
  title: string;
  endTime: number;
  claimablePerMonth: number;
  claimed: number;
  claimable: number;
  lock: number;
  lockMonths: number;
  purchaseTimeForBusd: number;
  purchaseTimeForNtr: number;
  openClaimModal: (claimFrom: ClaimCentherFrom) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  isBUSD,
  index,
  title,
  endTime,
  claimablePerMonth,
  claimable,
  claimed,
  lock,
  lockMonths,
  purchaseTimeForNtr,
  purchaseTimeForBusd,
  openClaimModal,
}) => {
  let monthInEpoch = 2592000;
  // let monthInEpoch = 900;

  const claimTime = isBUSD
    ? purchaseTimeForBusd * 1000 +
      lockMonths * monthInEpoch * 1000 +
      monthInEpoch * 1000 * (index + 1)
    : purchaseTimeForNtr * 1000 +
      lockMonths * monthInEpoch * 1000 +
      monthInEpoch * 1000 * (index + 1);

  let statusText = "";
  if (claimable > 0) {
    statusText = "can be claimed now";
  } else if (claimed > 0) {
    statusText = "was already claimed";
  } else if (lock > 0) {
    statusText = "will be released in";
  }

  return (
    <div className="relative flex w-full items-center gap-4">
      <div
        className={clsx(
          "flex !h-11 !min-w-[44px] items-center justify-center rounded-full text-xs font-semibold",
          Math.floor(Date.now() / 1000) > endTime
            ? "bg-gray-shade-16"
            : "bg-gray-shade-12"
        )}
      >
        {title}
      </div>
      <div className="rainbow-scroll flex h-auto min-h-[88px] max-w-full flex-grow items-center justify-between gap-10 overflow-x-auto rounded-[14px] bg-elevation-1 px-6 py-5">
        <div className="min-w-[260px]">
          <p className="text-sm text-gray-shade-7">
            Amount (
            {lock > 0 ? "Locked" : claimable > 0 ? "Claimable Now" : "Claimed"})
          </p>
          <h4 className="mt-[6px] text-sm font-semibold text-white">
            {formatNum2DispNum(claimablePerMonth)} DXC (10%) {statusText}
          </h4>
        </div>
        <Countdown date={new Date(claimTime)} renderer={countdownRenderer} />

        <div className="min-w-[90px]">
          <p className="text-sm text-gray-shade-7">Claimable</p>
          <h4
            className={clsx(
              "text-sm font-semibold",
              claimable > 0 ? "text-white" : "text-[#45474D]"
            )}
          >
            {claimable > 0 ? formatNum2DispNum(claimable) : 0}
          </h4>
        </div>
        <div className="min-w-[90px]">
          <p className="text-sm text-gray-shade-7">Claimed</p>
          <h4
            className={clsx(
              "text-sm font-semibold",
              claimed > 0 ? "text-white" : "text-[#45474D]"
            )}
          >
            {claimed > 0 ? formatNum2DispNum(claimed) : 0}
          </h4>
        </div>
        <div className="min-w-[90px]">
          <p className="text-sm text-gray-shade-7">Action</p>
          <button
            className={clsx(
              "text-sm font-semibold",
              claimable
                ? "textGradient cursor-pointer"
                : claimed
                ? "textGradient opacity-30"
                : "text-[#45474D]"
            )}
            onClick={() => {
              claimable > 0 && claimed === 0
                ? isBUSD
                  ? openClaimModal("BUSD")
                  : openClaimModal("NTR")
                : null;
            }}
            disabled={claimable === 0 || claimed > 0}
          >
            Claim now
          </button>
        </div>
      </div>
    </div>
  );
};

// Countdown Renderer
const countdownRenderer: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <div className="flex !w-[160px] gap-4">
      <div className="flex flex-col items-center">
        <p className="text-xs font-bold text-gray-shade-7">Days</p>
        <h4 className="text-sm font-semibold text-white">{days}</h4>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-xs font-bold text-gray-shade-7">Hrs</p>
        <h4 className="text-sm font-semibold text-white">{hours}</h4>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-xs font-bold text-gray-shade-7">Min</p>
        <h4 className="text-sm font-semibold text-white">{minutes}</h4>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-xs font-bold text-gray-shade-7">Sec</p>
        <h4 className="text-sm font-semibold text-white">{seconds}</h4>
      </div>
    </div>
  );
};
