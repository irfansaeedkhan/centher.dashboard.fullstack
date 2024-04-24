import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CentherLaunchpad } from "@/launchpad";
import { OptionalType } from "@/staking/types";

export interface CentherLaunchpadStore {
  sdk: OptionalType<CentherLaunchpad>;
  setSdk: (instance: CentherLaunchpad) => void;
}

// export interface CentherLaunchpadPoolsStore {
//   pools: OptionalType<StakingProject[]>;
//   setPools: (pools: OptionalType<StakingProject[]>) => void;
// }

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

// export const useCentherLaunchpadPools = create<CentherLaunchpadPoolsStore>()(
//   devtools(
//     (set) => ({
//       pools: null,
//       setPools: (pools: OptionalType<StakingProject[]>) => set({ pools }),
//     }),
//     { name: "CentherLaunchpadStore" }
//   )
// );
