import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { formatNum2DispNum } from "@/utils/format.address";
import { getUTCNow } from "@/web3/utils/utils";
import { ClaimCentherFrom } from "@/web3/blockchain/types";

interface TimelineProps {
  index: number;
  title: string;
  endTime: number;
  claimablePerMonth: number;
  claimed: number;
  claimable: number;
  lock: number;
  openClaimModal: (claimFrom: ClaimCentherFrom) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  index,
  title,
  endTime,
  claimablePerMonth,
  claimable,
  claimed,
  lock,
  openClaimModal,
}) => {
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    let timeRemaining = 0;
    const _now = getUTCNow();

    timeRemaining = endTime * 1000 - getUTCNow();
    if (timeRemaining > 0) setCountdownFor(timeRemaining);

    const interval = setInterval(() => {
      if (timeRemaining > 1000) {
        timeRemaining -= 1000;
        setCountdownFor(timeRemaining);
      }

      if (timeRemaining <= 1000) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [endTime]);

  const setCountdownFor = (deadline: number) => {
    const _days = Math.floor(deadline / (1000 * 60 * 60 * 24));
    const _hours = Math.floor((deadline / (1000 * 60 * 60)) % 24);
    const _minutes = Math.floor((deadline / 1000 / 60) % 60);
    const _seconds = Math.floor((deadline / 1000) % 60);

    setDays(_days <= 0 ? "00" : _days.toString());
    setHours(_hours <= 0 ? "00" : _hours.toString());
    setMinutes(_minutes <= 0 ? "00" : _minutes.toString());
    setSeconds(_seconds <= 0 ? "00" : _seconds.toString());
  };

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
        className={`flex !h-11 !min-w-[44px] items-center justify-center rounded-full text-xs font-semibold ${
          Math.floor(Date.now() / 1000) > endTime
            ? "bg-yellow-shade-1"
            : "bg-gray-shade-2"
        }`}
      >
        {title}
      </div>
      <div className="scrollSetLight2 flex h-auto min-h-[88px] max-w-full flex-grow justify-between gap-10 overflow-x-auto rounded-[14px] bg-elevation-1 py-5 px-6">
        <div className="min-w-[260px]">
          <p className="text-sm text-gray-shade-7">
            Amount (
            {lock > 0 ? "Locked" : claimable > 0 ? "Claimable Now" : "Claimed"})
          </p>
          <h4 className="text-sm font-semibold text-white">
            {formatNum2DispNum(claimablePerMonth)}DXC (10%) {statusText}
          </h4>
        </div>
        {lock > 0 && (
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
        )}
        {claimable > 0 && (
          <div className="min-w-[90px]">
            <p className="text-sm text-gray-shade-7">Action</p>
            <div
              className={clsx(
                `text-sm font-semibold`,
                claimable
                  ? "cursor-pointer text-brand-primary"
                  : "text-[#45474D]",
                claimable || (claimed && "underline")
              )}
              onClick={() => {
                openClaimModal("BUSD");
              }}
            >
              {claimable || claimed ? "Claim now" : "--"}
            </div>
          </div>
        )}
        {/* <div className="min-w-[90px]">
          <p className="text-sm text-gray-shade-7">
            {lock > 0 ? "Locked" : claimable > 0 ? "Claimable Now" : "Claimed"}
          </p>
          <h4 className="font-semibold text-white text-sm">
            {lock > 0
              ? formatNum2DispNum(lock)
              : claimable > 0
              ? formatNum2DispNum(claimable)
              : formatNum2DispNum(claimed)}
          </h4>
        </div> */}
      </div>
    </div>
  );
};

export default Timeline;
