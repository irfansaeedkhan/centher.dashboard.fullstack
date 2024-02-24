import React, { useState } from "react";
import { HistoryMainTabs } from "./history-main-tabs";
import { LaunchpadReferralsClaimable, LaunchpadReferralsClaimed } from "./";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import { ClaimableDataType, ClaimedDataType } from "../data";

interface Props {
  metaData: { token_name: string; token_symbol: string; website: string };
  launchpadData: PresaleDataType;
  claimableRefData: ClaimableDataType[];
  claimedRefData: ClaimedDataType[];
}

export const LaunchpadReferralTabs: React.FC<Props> = ({
  launchpadData,
  metaData,
  claimableRefData,
  claimedRefData,
}) => {
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
        claimedRefData={claimedRefData}
        launchpadData={launchpadData}
      />
      <LaunchpadReferralsClaimable
        open={isClaimable}
        launchpadData={launchpadData}
        metaData={metaData}
        claimableRefData={claimableRefData}
      />
      {/* <HistoryMainTabs
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
      <LaunchpadReferralsEarned open={isReward} /> */}
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
        claimedRefData={claimedRefData}
        launchpadData={launchpadData}
      />
      <LaunchpadReferralsClaimed
        open={isClaimed}
        claimedRefData={claimedRefData}
      />
    </div>
  );
};
