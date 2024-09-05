import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ProductStaking } from "@/staking";
import { OptionalType } from "@/staking/types";

export interface ProductStakingStore {
  sdk: OptionalType<ProductStaking>;
  setSdk: (instance: ProductStaking) => void;
}

// export interface ProductStakingPoolsStore {
//   pools: OptionalType<StakingProject[]>;
//   setPools: (pools: OptionalType<StakingProject[]>) => void;
// }

export const useProductStaking = create<ProductStakingStore>()(
  devtools(
    (set) => ({
      sdk: null,
      setSdk: (sdk: ProductStaking) => set({ sdk }),
    }),
    {
      name: "ProductStakingStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);

// export const useProductStakingPools = create<ProductStakingPoolsStore>()(
//   devtools(
//     (set) => ({
//       pools: null,
//       setPools: (pools: OptionalType<StakingProject[]>) => set({ pools }),
//     }),
//     { name: "ProductStakingStore" }
//   )
// );
