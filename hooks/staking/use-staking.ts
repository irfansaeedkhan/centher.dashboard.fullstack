import { useEffect } from "react";
import { useProductStaking } from "@/store/staking.store";
import { ProductStaking } from "@/staking";
import { config } from "@/staking/config";

export const useStaking = () => {
  const { sdk, setSdk } = useProductStaking((state) => ({
    sdk: state.sdk,
    setSdk: state.setSdk,
  }));

  useEffect(() => {
    if (!sdk && setSdk) {
      setSdk(new ProductStaking({ ...config }));
    }
  }, [sdk, setSdk]);

  return { sdk };
};
