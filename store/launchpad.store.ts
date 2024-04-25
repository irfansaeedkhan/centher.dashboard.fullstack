import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CentherLaunchpad } from "@/launchpad";
import { OptionalType } from "@/staking/types";

export interface CentherLaunchpadStore {
  sdk: OptionalType<CentherLaunchpad>;
  setSdk: (instance: CentherLaunchpad) => void;
}

export const useCentherLaunchpad = create<CentherLaunchpadStore>()(
  devtools(
    (set) => ({
      sdk: null,
      setSdk: (sdk: CentherLaunchpad) => set({ sdk }),
    }),
    {
      name: "CentherLaunchpadStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
