import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CentherStaking } from "@/staking";
import { OptionalType } from "@/staking/types";

export interface CentherStakingStore {
  sdk: OptionalType<CentherStaking>;
  setSdk: (instance: CentherStaking) => void;
}

// export interface CentherStakingPoolsStore {
//   pools: OptionalType<StakingProject[]>;
//   setPools: (pools: OptionalType<StakingProject[]>) => void;
// }

export const useCentherStaking = create<CentherStakingStore>()(
  devtools(
    (set) => ({
      sdk: null,
      setSdk: (sdk: CentherStaking) => set({ sdk }),
    }),
    { name: "CentherStakingStore" }
  )
);

// export const useCentherStakingPools = create<CentherStakingPoolsStore>()(
//   devtools(
//     (set) => ({
//       pools: null,
//       setPools: (pools: OptionalType<StakingProject[]>) => set({ pools }),
//     }),
//     { name: "CentherStakingStore" }
//   )
// );
