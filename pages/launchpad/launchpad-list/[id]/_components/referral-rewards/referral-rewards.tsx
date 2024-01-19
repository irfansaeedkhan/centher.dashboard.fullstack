import React from "react";
import { LaunchpadReferralTabs, RewardsTopSection } from "./";

export const ReferralRewards = () => {
  return (
    <div className="flex flex-col gap-6">
      <RewardsTopSection />
      <LaunchpadReferralTabs />
    </div>
  );
};
