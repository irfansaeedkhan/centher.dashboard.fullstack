import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ProductLaunchpad } from "@/launchpad";
import { OptionalType } from "@/staking/types";

export interface ProductLaunchpadStore {
  sdk: OptionalType<ProductLaunchpad>;
  setSdk: (instance: ProductLaunchpad) => void;
}

export const useProductLaunchpad = create<ProductLaunchpadStore>()(
  devtools(
    (set) => ({
      sdk: null,
      setSdk: (sdk: ProductLaunchpad) => set({ sdk }),
    }),
    {
      name: "ProductLaunchpadStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
