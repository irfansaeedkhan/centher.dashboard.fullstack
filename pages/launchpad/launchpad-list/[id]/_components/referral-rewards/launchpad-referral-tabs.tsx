import React, { useState } from "react";
import { HistoryMainTabs } from "./history-main-tabs";
import {
  LaunchpadReferralsClaimable,
  LaunchpadReferralsClaimed,
  LaunchpadReferralsEarned,
} from "./";

export const LaunchpadReferralTabs = () => {
  const [isClaimable, setIsClaimable] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isReward, setIsReward] = useState(false);
  const [isStakingToken, setIsStakingToken] = useState(false);
  const [batchLoading, setBatchLoading] = useState<string>("Claim All");
  const [batchActions, setBatchActions] = useState<
    { title: string; handler: any }[]
  >([]);

  return (
    <div className="flex flex-col">
      <HistoryMainTabs
        isOpen={isClaimable}
        onClose={() => {
          setIsClaimed(false);
          setIsReward(false);
          setIsStakingToken(false);
          setIsClaimable(!isClaimable);
        }}
        buttons={batchActions}
        title="Claimable Rewards History"
        loader={batchLoading}
        actionAreaLoading={false}
      />
      <LaunchpadReferralsClaimable open={isClaimable} />
      <HistoryMainTabs
        isOpen={isReward}
        onClose={() => {
          setIsClaimable(false);
          setIsClaimed(false);
          setIsStakingToken(false);
          setIsReward(!isReward);
        }}
        buttons={batchActions}
        title="Earned Rewards History"
        loader={batchLoading}
        actionAreaLoading={false}
      />
      <LaunchpadReferralsEarned open={isReward} />
      <HistoryMainTabs
        isOpen={isClaimed}
        onClose={() => {
          setIsClaimable(false);
          setIsReward(false);
          setIsStakingToken(false);
          setIsClaimed(!isClaimed);
        }}
        buttons={batchActions}
        title="Claimed Rewards History"
        loader={batchLoading}
        actionAreaLoading={false}
      />
      <LaunchpadReferralsClaimed open={isClaimed} />
    </div>
  );
};
