import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { useNetworkRewards } from "@/store/network.rewards";
import { useGetClaimableBusdForReferral } from "@/web3/hooks/use.get.claimable.busd.for.referral";
import { useGetClaimableNtrForReferral } from "@/web3/hooks/use.get.claimable.ntr.for.referral";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import LaunchpadClaimableRewards from "../_components/launchpad.claimable.rewards";
import NetworkTabs from "../_components/network.tabs";

const Rewards: NextPageWithLayout = () => {
  const [rewardState, setRewardState] = useState<
    "lunchpad-rewards" | "marketplace-rewards"
  >("lunchpad-rewards");
  const { user: loggedInUser } = useUser();
  const {
    rewardsInLaunchpad,
    rewardsEachLevel,
    rewardsTotal,
    fetchReferralRewardsInLaunchpad,
  } = useNetworkRewards((state) => ({
    rewardsInLaunchpad: state.rewardsInLaunchpad,
    rewardsEachLevel: state.rewardsEachLevel,
    rewardsTotal: state.rewardsTotal,
    fetchReferralRewardsInLaunchpad: state.fetchReferralRewardsInLaunchpad,
  }));
  console.log("sniper: rewardsInLaunchpad: ", rewardsInLaunchpad);
  console.log("sniper: rewardsEachLevel: ", rewardsEachLevel);
  console.log("sniper: rewardsTotal: ", rewardsTotal);

  const claimableBusd = useGetClaimableBusdForReferral(
    loggedInUser?.account_address
  );
  const claimableNtr = useGetClaimableNtrForReferral(
    loggedInUser?.account_address
  );
  console.log("sniper: claimableBusd: ", claimableBusd);
  console.log("sniper: claimableNtr: ", claimableNtr);

  useEffect(() => {
    if (loggedInUser?.account_address) {
      fetchReferralRewardsInLaunchpad(loggedInUser?.account_address);
    }
  }, [fetchReferralRewardsInLaunchpad, loggedInUser?.account_address]);

  return (
    <div>
      <div className="flex items-center fsm:gap-10 gap-4">
        <h3
          onClick={() => setRewardState("lunchpad-rewards")}
          className={clsx(
            `font-semibold fsm:text-xl cursor-pointer`,
            rewardState === "lunchpad-rewards"
              ? "text-white text-sm"
              : "text-gray-shade-7 text-xs"
          )}
        >
          Lunchpad Rewards
        </h3>
        <h3
          onClick={() => setRewardState("marketplace-rewards")}
          className={clsx(
            `font-semibold fsm:text-xl cursor-pointer`,
            rewardState === "marketplace-rewards"
              ? "text-white text-sm"
              : "text-gray-shade-7 text-xs"
          )}
        >
          Marketplace Rewards
        </h3>
      </div>
      <div className="mt-6">
        <LaunchpadClaimableRewards rewardState={rewardState} />
      </div>
    </div>
  );
};

Rewards.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Rewards">
      <div className="w-full max-w-[1136px] mx-auto">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default Rewards;
