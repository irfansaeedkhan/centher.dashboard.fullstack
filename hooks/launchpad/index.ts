import { useEffect } from "react";
import { useCentherLaunchpad } from "@/store/launchpad.store";
import { CentherLaunchpad } from "@/launchpad";
import { config } from "@/launchpad/config";

export const useLaunchpad = () => {
  const { sdk, setSdk } = useCentherLaunchpad((state) => ({
    sdk: state.sdk,
    setSdk: state.setSdk,
  }));

  useEffect(() => {
    if (!sdk && setSdk) {
      setSdk(new CentherLaunchpad({ ...config }));
    }
  }, [sdk, setSdk]);

  return { sdk };
};
