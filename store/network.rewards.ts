// React, Next, NPM Packages
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { LoadingState } from "@/models/common";
import {
  ReferralClaim,
  ReferralReward,
  RewardsEachAsset,
} from "@/models/referral";
import { ethers } from "ethers";
import { BlockchainRead } from "@/web3/blockchain";

export interface NetworkRewards {
  rewardsInLaunchpad: ReferralReward[];
  claimsInLaunchpad: ReferralClaim;
  rewardsInMarketplace: ReferralReward[];
  rewardsEachLevel: RewardsEachAsset[];
  rewardsTotal: RewardsEachAsset;
  fetchReferralRewardsInLaunchpad: (referrer: string) => Promise<void>;
  fetchReferralClaimsInLaunchpad: (referrer: string) => Promise<void>;
  updateOffset: () => void;
  limit: number;
  offset: number;
  loading: LoadingState;
}

export const useNetworkRewards = create<NetworkRewards>()(
  devtools(
    (set, get) => ({
      rewardsInLaunchpad: [],
      claimsInLaunchpad: { busd: [], ntr: [] },
      rewardsInMarketplace: [],
      rewardsEachLevel: [],
      rewardsTotal: { busd: 0, ntr: 0, bnb: 0 },
      limit: 1000,
      offset: 0,
      loading: "idle",

      updateOffset: () =>
        set((state) => ({
          offset: state.rewardsInLaunchpad.length,
        })),

      fetchReferralRewardsInLaunchpad: async (referrer) => {
        try {
          set({ loading: "loading" });
          let _rewardsInLaunchpad: ReferralReward[] = [];
          const result = await BlockchainRead.getReferralRewardInPresale(
            get().limit,
            get().offset,
            referrer
          );

          if (result?.length) {
            _rewardsInLaunchpad = result.map((item: any) => {
              return {
                id: item.id,
                createdAt: item.createdAt,
                user: item.user,
                level: item.level,
                round: item.round,
                isBusd: item.isBusd,
                amount: Number(ethers.utils.formatEther(item.amount)),
              };
            });
          }

          set((state) => {
            // Filter out all nfts that are already in the store
            const filteredItems = state.rewardsInLaunchpad.filter(
              (item) =>
                !_rewardsInLaunchpad.some(
                  (item1: ReferralReward) => item.id === item1.id
                )
            );

            const _rewardsInLaunchpadFinal = [
              ...filteredItems,
              ..._rewardsInLaunchpad,
            ];
            const _rewardsEachLevel: RewardsEachAsset[] = [];
            for (let i = 0; i < 6; i++) {
              const group = _rewardsInLaunchpadFinal.filter(
                (item: any) => item.level === i + 1
              );
              const sumBusd = group
                .filter((item: any) => item.isBusd)
                .map((item: any) => item.amount)
                .reduce((prev: any, next: any) => prev + next, 0);
              const sumNtr = group
                .filter((item: any) => !item.isBusd)
                .map((item: any) => item.amount)
                .reduce((prev: any, next: any) => prev + next, 0);
              _rewardsEachLevel.push({
                busd: sumBusd,
                ntr: sumNtr,
                bnb: 0,
              });
            }

            const _rewardsTotal: RewardsEachAsset = get().rewardsTotal;
            _rewardsTotal.busd = _rewardsEachLevel
              .map((item: any) => item.busd)
              .reduce((prev: any, next: any) => prev + next, 0);
            _rewardsTotal.ntr = _rewardsEachLevel
              .map((item: any) => item.ntr)
              .reduce((prev: any, next: any) => prev + next, 0);
            _rewardsTotal.bnb = _rewardsEachLevel
              .map((item: any) => item.bnb)
              .reduce((prev: any, next: any) => prev + next, 0);

            return {
              ...state,
              rewardsInLaunchpad: _rewardsInLaunchpadFinal,
              rewardsEachLevel: _rewardsEachLevel,
              rewardsTotal: _rewardsTotal,
              loading: "loaded",
            };
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
      fetchReferralClaimsInLaunchpad: async (referrer) => {
        try {
          const result = await BlockchainRead.getReferrerClaimInPresale(
            referrer
          );
          let _claimsInLaunchpad: ReferralClaim = { busd: [], ntr: [] };
          if (result?.length) {
            _claimsInLaunchpad.busd = result
              .filter((item: any) => item.isBusd)
              .map((item1: any) => {
                return {
                  createdAt: item1.createdAt,
                  amount: Number(
                    ethers.utils.formatEther(item1.amount.toString())
                  ),
                };
              });
            _claimsInLaunchpad.ntr = result.presaleGenalogyClaimHistories
              .filter((item: any) => !item.isBusd)
              .map((item1: any) => {
                return {
                  createdAt: item1.createdAt,
                  amount: Number(
                    ethers.utils.formatEther(item1.amount.toString())
                  ),
                };
              });
          }

          set((state) => {
            return {
              ...state,
              claimsInLaunchpad: _claimsInLaunchpad,
            };
          });
        } catch (error) {
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
    }),
    { name: "ExploreStore" }
  )
);
