import { useEffect } from "react";
import { useCentherStaking } from "@/store/staking.store";
import { CentherStaking } from "@/staking";
import { config } from "@/staking/config";

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
