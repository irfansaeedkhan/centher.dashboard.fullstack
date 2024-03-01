import React, { useCallback, useEffect, useState } from "react";
import { LaunchpadReferralTabs, RewardsTopSection } from "./";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import { useLaunchpad } from "@/hooks/launchpad";
import useUser from "@/hooks/use.user";
import { useRouter } from "next/router";
import { customLog } from "@/utils/custom.log";

interface Props {
  metaData: { token_name: string; token_symbol: string; website: string };
  launchpadData: PresaleDataType;
}
export const ReferralRewards: React.FC<Props> = ({
  metaData,
  launchpadData,
}) => {
  const { sdk } = useLaunchpad();
  const { user } = useUser();

  const router = useRouter();
  const { id } = router.query;
  const [claimableRefData, setclaimableRefData] = useState<any[]>([]);
  const [claimedRefData, setclaimedRefData] = useState<any[]>([]);

  const [refRewardDetails, setRefRewardDetails] = useState<{
    claimedRewards: string;
    claimableRewards: string;
    referrerCounts: number;
  }>({ claimableRewards: "", claimedRewards: "", referrerCounts: 0 });

  const loadData = useCallback(async () => {
    if (!sdk) return;
    if (!user) return;
    if (!id) return;
    try {
      let claimableAmount = 0;
      let claimedAmount = 0;

      const result = await sdk.getRefRewards(id.toString(), user._id);

      let rewardTokenType = launchpadData.fundType;

      for (let i = 0; i < result.length; i++) {
        claimableAmount += Number(result[i].amount);
      }

      const result2 = await sdk.getClaimedRefRewards(id.toString(), user._id);

      if (result2.length === 0) {
        setclaimableRefData(result);
      }

      for (let i = 0; i < result2.length; i++) {
        claimedAmount += Number(result2[i].amount);
      }

      setclaimedRefData(result2);

      claimableAmount = claimableAmount - claimedAmount;

      setRefRewardDetails({
        claimableRewards: `${(claimableAmount / 1e18).toString()} ${
          rewardTokenType === 0 ? "BNB" : "USDT"
        }`,
        claimedRewards: `${(claimedAmount / 1e18).toString()} ${
          rewardTokenType === 0 ? "BNB" : "USDT"
        }`,
        referrerCounts: result.length,
      });
    } catch (err) {
      customLog(["development", "staging"], err);
    }
  }, [id, sdk, user, launchpadData.fundType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex flex-col gap-6">
      <RewardsTopSection {...refRewardDetails} />
      <LaunchpadReferralTabs
        launchpadData={launchpadData}
        metaData={metaData}
        claimableRefData={claimableRefData}
        claimedRefData={claimedRefData}
      />
    </div>
  );
};
