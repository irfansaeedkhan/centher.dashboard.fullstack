import { CentherStaking } from "@/staking";
import { config } from "@/staking/config";
import { GetStakingProjectInput } from "@/staking/types/get.projects.interface";
import { useCentherStaking } from "@/store/staking.store";
import { useEffect } from "react";

export const useStaking = () => {
  const { sdk, setSdk } = useCentherStaking((state) => ({
    sdk: state.sdk,
    setSdk: state.setSdk,
  }));

  useEffect(() => {
    if (!sdk && setSdk) {
      setSdk(new CentherStaking({ ...config }));
    }
  }, [sdk, setSdk]);

  return { sdk };
};
