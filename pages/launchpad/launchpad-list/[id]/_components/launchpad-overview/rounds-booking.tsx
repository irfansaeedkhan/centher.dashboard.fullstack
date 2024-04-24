import React from "react";
import clsx from "clsx";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import Image from "next/image";
import { BigNumber } from "ethers";
import { parseEther } from "viem";

interface PresaleDataProps extends PresaleDataType {
  token_name: string;
  token_symbol: string;
  website: string;
  description: string;
  currentRound: number;
}

export const RoundsBooking: React.FC<PresaleDataProps> = ({
  token_symbol,
  roundInfos,
  roundDeep,
  currentRound,
  tokenPurchaseWithBNB,
  tokenPurchaseWithBUSD,
  fundType,
}) => {
  const thisRound =
    currentRound > -1 ? currentRound - 1 : Number(roundDeep) - 1;
  const purchaseThrough = fundType === 0 ? "BNB" : "USDT";

  let allPurchases;
  let totalPurchaseInQuote = 0;

  if (purchaseThrough === "BNB") {
    allPurchases = tokenPurchaseWithBNB;
  } else {
    allPurchases = tokenPurchaseWithBUSD;
  }

  for (let i = 0; i < allPurchases.length; i++) {
    totalPurchaseInQuote += Number(allPurchases[i].amount);
  }

  const tokenSellForThisRound =
    (Number(roundInfos[thisRound].tokensToSell) *
      Number(roundInfos[thisRound].pricePerToken)) /
    1e18;

  let percentSoldOut =
    (Number(Number(totalPurchaseInQuote) * 1e18) /
      Number(tokenSellForThisRound)) *
    100;

  percentSoldOut = Number(percentSoldOut) / 1e18;

  const currentTime = Number((Date.now() / 1000).toFixed());
  let timeToShow;

  if (Number(roundInfos[0].startTime) > currentTime) {
    timeToShow = Number(roundInfos[0].startTime);
  } else {
    timeToShow = Number(roundInfos[Number(roundDeep) - 1].endTime);
  }

  return (
    <div className="col-span-1 flex h-auto w-full flex-col gap-6 rounded-xl bg-black-shade-9 p-4 fxm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex w-full items-center justify-between gap-4">
          <h2 className="text-sm font-medium leading-6 text-white">Rounds</h2>
          <p className="flex items-center gap-1 text-sm font-medium text-white">
            <span
              className={clsx(
                currentRound === 1 ? gradientRoundMain : simpleRoundMain
              )}
            >
              <span
                className={clsx(
                  currentRound === 1 ? gradientRoundInner : simpleRoundInner
                )}
              >
                1
              </span>
            </span>
            <span
              className={clsx(
                currentRound === 2 ? gradientRoundMain : simpleRoundMain
              )}
            >
              <span
                className={clsx(
                  currentRound === 2 ? gradientRoundInner : simpleRoundInner
                )}
              >
                2
              </span>
            </span>
            <span
              className={clsx(
                currentRound === 3 ? gradientRoundMain : simpleRoundMain
              )}
            >
              <span
                className={clsx(
                  currentRound === 3 ? gradientRoundInner : simpleRoundInner
                )}
              >
                3
              </span>
            </span>
          </p>
        </div>
        <div className="relative flex h-14 w-full items-center justify-center gap-2 px-4">
          <Image
            src={"/images/timer.png"}
            alt="timer"
            width={312}
            height={56}
            className="absolute left-0 top-0 m-auto h-[56px] w-full fmd:inset-0"
          />
          <p className="max-w-[85px] text-[11px] font-semibold text-white">
            The presale will {currentTime > timeToShow ? "start" : "end"} in
          </p>
          <Countdown
            date={new Date(timeToShow * 1000)}
            renderer={countdownRenderer}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium leading-6 text-white">Bookings</h2>
        <div className="flex flex-col gap-2">
          <div
            className={clsx(
              "relative h-3 w-full overflow-hidden rounded-3xl",
              // status === "live" &&
              `bg-green-shade-1/[0.16]`
              // status === "upcoming" && `bg-brand-primary/[0.16]`,
              // status === "ended" && `bg-red-shade-1/[0.16]`
            )}
          >
            <div
              style={{ width: `${percentSoldOut}%` }}
              className={clsx(
                `absolute top-0 z-50 h-3 rounded-3xl`,
                // status === "live" &&
                `bg-green-shade-1`
                // status === "upcoming" && `bg-brand-primary`,
                // status === "ended" && `bg-red-shade-1`
              )}
            ></div>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs font-medium text-gray-shade-14">
            <p>
              {(Number(totalPurchaseInQuote) / 1e18).toFixed(
                purchaseThrough === "BNB" ? 4 : 0
              )}{" "}
              {purchaseThrough}
            </p>
            <p>
              {Number(tokenSellForThisRound / 1e18).toFixed(
                purchaseThrough === "BNB" ? 4 : 0
              )}{" "}
              {purchaseThrough}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const textDays = "text-[8px] font-medium text-white";
const textActive = "text-xs font-semibold text-white";
const gradientRoundMain =
  "gradient-borders-2 relative flex h-[22px] w-8 cursor-pointer items-center justify-center rounded-3xl p-px";
const gradientRoundInner = "text-gradient-1 py-1 font-medium";
const simpleRoundMain =
  "relative flex h-[22px] w-8 cursor-pointer items-center justify-center rounded-3xl border border-gray-shade-14 p-px";
const simpleRoundInner = "py-1 font-medium text-gray-shade-14";

// Countdown Renderer
const countdownRenderer: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <h6 className={textActive}>{days}</h6>
        <p className={textDays}>DAYS</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className={textActive}>{hours}</h6>
        <p className={textDays}>HOURS</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className={textActive}>{minutes}</h6>
        <p className={textDays}>MIN</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className={textActive}>{seconds}</h6>
        <p className={textDays}>SEC</p>
      </div>
    </div>
  );
};
