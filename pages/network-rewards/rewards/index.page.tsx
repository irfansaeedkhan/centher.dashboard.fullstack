import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { useNetworkRewards } from "@/store/network.rewards";
import { useGetClaimableBusdForReferral } from "@/web3/hooks/use.get.claimable.busd.for.referral";
import { useGetClaimableNtrForReferral } from "@/web3/hooks/use.get.claimable.ntr.for.referral";
import React, { useEffect } from "react";
import NetworkTabs from "../_components/network.tabs";

const Rewards: NextPageWithLayout = () => {
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
      <div className="flex items-center gap-16">
        <h3 className="text-white font-semibold text-xl">
          Your Network Rewards
        </h3>

        <h3 className="text-white font-semibold text-xl">Lunchpad Rewards</h3>

        <h3 className="text-white font-semibold text-xl">NFT Rewards</h3>
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
