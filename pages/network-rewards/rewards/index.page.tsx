import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ClaimableRewardsSkeleton from "@/components/loading.skeletons/network.rewards.claimable";
import { NextPageWithLayout } from "@/pages/_app.page";
import clsx from "clsx";
import React, { useState } from "react";
import LaunchpadClaimableRewards from "../_components/launchpad.claimable.rewards";
import NetworkTabs from "../_components/network.tabs";

const Rewards: NextPageWithLayout = () => {
  const [rewardState, setRewardState] = useState<
    "lunchpad-rewards" | "marketplace-rewards"
  >("lunchpad-rewards");
  return (
    <div>
      <div className="flex items-center gap-4 fsm:gap-10">
        <h3
          onClick={() => setRewardState("lunchpad-rewards")}
          className={clsx(
            `cursor-pointer font-semibold fsm:text-xl`,
            rewardState === "lunchpad-rewards"
              ? "text-sm text-white"
              : "text-xs text-gray-shade-7"
          )}
        >
          Launchpad Rewards
        </h3>
        <h3
          onClick={() => setRewardState("marketplace-rewards")}
          className={clsx(
            `cursor-pointer font-semibold fsm:text-xl`,
            rewardState === "marketplace-rewards"
              ? "text-sm text-white"
              : "text-xs text-gray-shade-7"
          )}
        >
          Marketplace Rewards
        </h3>
      </div>
      <div className="mt-6">
        {rewardState ? (
          <LaunchpadClaimableRewards rewardState={rewardState} />
        ) : (
          <ClaimableRewardsSkeleton />
        )}
      </div>
    </div>
  );
};

Rewards.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Rewards">
      <div className="mx-auto w-full max-w-[1136px]">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default Rewards;
