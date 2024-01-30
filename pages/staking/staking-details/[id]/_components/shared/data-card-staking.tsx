import React from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import { CgSpinner } from "react-icons/cg";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { DXCIconBG } from "@/assets/svgs";
import { UserStakingTransfers } from "@/staking/types/get.projects.interface";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { formatUnits } from "viem";
import Button from "@/components/button";
interface ComponentProps {
  data: UserStakingTransfers;
  tokenName: string;
  tokenDecimal: number;
  nonRefundable: boolean;
  unstake: any;
  unstakeInProgress: boolean;
  reload: any;
}
export const DataCardStaking: React.FC<ComponentProps> = (props) => {
  let status = "";
  if (props.nonRefundable) {
    if (props.data.endAt < +new Date() / 1000) {
      status = "Expired";
    } else {
      status = "Live";
    }
  } else {
    if (props.data.endAt < +new Date() / 1000) {
      if (props.data.unstake) {
        status = "Unstaked";
      } else {
        status = "Unstakable";
      }
    } else {
      status = "Live";
    }
  }

  return (
    <div className="relative col-span-1 flex flex-col gap-3 rounded-xl border border-gray-shade-3 p-4 fxm:p-6">
      <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <div className="flex w-fit items-center justify-center rounded-xl border border-gray-shade-3 bg-[#1E1F28] px-3 py-1">
          <span
            className={clsx(
              "text-sm font-medium",
              status?.toLowerCase() === "live" && "staking-text-gradient-live",
              status?.toLowerCase() === "staked" &&
                "staking-text-gradient-staked",
              status?.toLowerCase() === "unstaked" &&
                "staking-text-gradient-unstaked",
              status?.toLowerCase() === "unstakable" &&
                "staking-text-gradient-unstakable",
              status?.toLowerCase() === "expired" && "text-[#E34048]"
            )}
          >
            {status}
          </span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Staked Amount</div>
        <div className={textRight}>
          <span className="flex h-4 w-4 flex-shrink-0">
            <DXCIconBG className="flex size-4 flex-shrink-0" />
          </span>
          <span>
            {Number(
              normalizeValue(
                formatUnits(BigInt(props.data.amount), props.tokenDecimal)
              )
            ).toFixed(4)}
          </span>
          <span>{props.tokenName}</span>
        </div>
      </div>
      <div className={mainDiv}>
        <div className={textLeft}>Start Date</div>
        <div className={textRight}>
          <span>
            {dayjs(props.data.createdAt * 1000).format("DD-MMM-YYYY")}
          </span>
        </div>
      </div>

      <div className={mainDiv}>
        <div className={textLeft}>End Staking</div>
        <div className={textRight}>
          <span>{dayjs(props.data.endAt * 1000).format("DD-MMM-YYYY")}</span>
        </div>
      </div>

      {!props.nonRefundable ? (
        props.data.unstake ? (
          <div className={mainDiv}>
            <div className={textLeft}>Unstaked date</div>
            <div className={textRight}>
              <span>
                {" "}
                {dayjs(props.data.unstake.createdAt * 1000).format(
                  "DD-MMM-YYYY"
                )}
              </span>
            </div>
          </div>
        ) : (
          <div className={mainDiv}>
            <div className={textLeft}>
              {props.data.endAt > +new Date() / 1000
                ? "Time to Unstaking"
                : "Action"}
            </div>
            <div className={textRight}>
              {props.data.endAt > +new Date() / 1000 ? (
                <span>
                  <Countdown
                    date={new Date(props.data.endAt * 1000)}
                    renderer={countdownRenderer}
                    onComplete={() => props.reload()}
                  />
                </span>
              ) : (
                <div className="flex flex-shrink-0 items-center gap-2">
                  {props.unstakeInProgress}
                  <Button
                    className="text-sm"
                    title="Unstake"
                    borderRounded="10px"
                    onClick={async () => await props.unstake([props.data.id])}
                    disabled={props.unstakeInProgress}
                    loaderIcon={
                      props.unstakeInProgress ? (
                        <CgSpinner className="h-5 animate-spin text-white" />
                      ) : undefined
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )
      ) : null}
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
