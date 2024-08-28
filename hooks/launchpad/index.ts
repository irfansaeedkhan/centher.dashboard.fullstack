import { useEffect } from "react";
import { useProductLaunchpad } from "@/store/launchpad.store";
import { ProductLaunchpad } from "@/launchpad";
import { config } from "@/launchpad/config";

export const useLaunchpad = () => {
  const { sdk, setSdk } = useProductLaunchpad((state) => ({
    sdk: state.sdk,
    setSdk: state.setSdk,
  }));

  useEffect(() => {
    if (!sdk && setSdk) {
      setSdk(new ProductLaunchpad({ ...config }));
    }
  }, [sdk, setSdk]);

  return { sdk };
};
