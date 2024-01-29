import React from "react";
import dayjs from "dayjs";
import { OptionalType } from "@/staking/types";
import { Referral } from "@/staking/types/referrals.interface";
import { formatUnits } from "ethers/lib/utils";

const SmallScreenReferralData: React.FC<{
  isClaiming: string;
  data: OptionalType<Referral[]>;
  token: string;
  rewardToken: string;
  claimRefReward: (user: string) => void;
  rewardTokenDecimals: string;
  decimals: string;
  claimable: boolean;
}> = ({
  isClaiming,
  data,
  token,
  claimRefReward,
  rewardToken,
  rewardTokenDecimals,
  decimals,
  claimable,
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {data?.map((e: Referral, i: number) => (
        <div className="flex w-full flex-col gap-2" key={i}>
          <div className={main}>
            <p className={text}>User Address</p>
            <p className={text2}>
              {e.id.split("-")[0].slice(0, 6)}...
              {e.id.split("-")[0].slice(-4)}
            </p>
          </div>
          <div className={main}>
            <p className={text}>Join Date</p>
            <p className={text2}>
              {dayjs(new Date(Number(+e.joinedAt) * 1000)).format(
                "DD-MMM-YYYY"
              )}
            </p>
          </div>
          <div className={main}>
            <p className={text}>Level</p>
            <p className={text2}>{e.level}</p>
          </div>
          <div className={main}>
            <p className={text}>Staked Amount</p>
            <p className={text2}>
              {Number(
                formatUnits(
                  e.stakedAmount ? e.stakedAmount + "" : "0",
                  decimals
                )
              )}{" "}
              {token}
            </p>
          </div>
          {claimable && (
            <div className={main}>
              <p className={text}>Claimable Reward</p>
              <p className={text2}>
                {Number(
                  formatUnits(
                    e.claimableReward ? e.claimableReward + "" : "0",
                    rewardTokenDecimals
                  )
                ).toFixed(3)}{" "}
                {rewardToken}
              </p>
            </div>
          )}
          {claimable && (
            <div className={main}>
              <p className={text}>Action</p>
              <p
                className="text-gradient flex-shrink-0 cursor-pointer text-xs font-medium underline fxm:text-sm"
                onClick={() => claimRefReward(e.id.split("-")[0])}
              >
                Claim
              </p>
            </div>
          )}
          {data.length - 1 !== i && (
            <hr className="my-2 border border-gray-shade-3" />
          )}
        </div>
      ))}
      {!data?.length && (
        <span className="flex h-20 w-full !min-w-full items-center justify-center rounded-bl-xl text-center text-gray-shade-7">
          No record found!
        </span>
      )}
    </div>
  );
};

export default SmallScreenReferralData;

const main = "flex w-full items-center justify-between gap-4";
const text = "fxm:text-sm text-xs font-medium text-gray-shade-14";
const text2 = "fxm:text-sm text-xs font-medium text-white flex-shrink-0";
