import clsx from "clsx";
import React from "react";
import SingleLevelReward from "./single.level.reward";

export interface ClaimableRewardsProps {
  rewardState: "lunchpad-rewards" | "marketplace-rewards";
}

const LaunchpadClaimableRewards: React.FC<ClaimableRewardsProps> = ({
  rewardState,
}) => {
  return (
    <div className="w-full h-auto bg-elevation-1 rounded-[14px]">
      <div
        className={clsx(
          `w-full fsm:h-[92px] h-[146px] bg-no-repeat bg-center bg-cover py-5 fsm:pl-7 pl-3 fsm:pr-4 pr-3 rounded-t-[14px] flex fsm:flex-row flex-col fsm:items-center justify-between gap-4`,
          rewardState === "marketplace-rewards"
            ? "bg-[url(/images/liscense1.png)]"
            : "bg-[url(/images/liscense3.png)]"
        )}
      >
        <div className="text-white fsm:text-sm text-xs space-y-1">
          {rewardState === "lunchpad-rewards" ? (
            <p className="">Lunchpad Rewards</p>
          ) : rewardState === "marketplace-rewards" ? (
            <p className="">Marketplace Rewards</p>
          ) : null}
          {rewardState === "lunchpad-rewards" ? (
            <span className="font-semibold flex gap-2 items-center">
              <p>00 (BUSD)</p>
              <span className="border-l border-white/[0.1] h-3" />
              <p>00 (NTR)</p>
            </span>
          ) : rewardState === "marketplace-rewards" ? (
            <p className="font-semibold flex gap-2 items-center">00 (BNB)</p>
          ) : null}
        </div>
        {rewardState === "lunchpad-rewards" && (
          <button className="fsm:w-[172px] w-full h-10 text-black-shade-3 text-sm font-bold text-center bg-brand-primary rounded-xl">
            Claim Reward
          </button>
        )}
      </div>
      <div className="py-6 flex flex-wrap gap-10 md:pl-10 pl-6">
        <SingleLevelReward rewardState={rewardState} />
        <SingleLevelReward rewardState={rewardState} />
        <SingleLevelReward rewardState={rewardState} />
        <SingleLevelReward rewardState={rewardState} />
        <SingleLevelReward rewardState={rewardState} />
        <SingleLevelReward rewardState={rewardState} />
      </div>
    </div>
  );
};

export default LaunchpadClaimableRewards;
