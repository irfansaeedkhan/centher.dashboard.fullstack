// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  claimCentherHistory,
  purchaseWithBusdHistory,
  purchaseWithNtrHistory,
} from "@/subgraph/querys";
import { LoadingState } from "@/models/common";
import {
  ClaimHistory,
  Overview,
  PurchaseHistory,
  Rewards,
} from "@/models/referral";
import { ethers } from "ethers";
import { getPresaleContract } from "@/web3/utils/contract.helpers";

export interface NetworkRewards {
  coreTeamRewards: Rewards;
  companyRewards: Rewards;
  overview: Overview;
  purchaseWithBusdHistory: PurchaseHistory[];
  purchaseWithNtrHistory: PurchaseHistory[];
  claimHistory: ClaimHistory[];
  fetchPurchaseWithBusdHistoryInLaunchpad: () => Promise<void>;
  fetchPurchaseWithNtrHistoryInLaunchpad: () => Promise<void>;
  fetchClaimHistoryInLaunchpad: () => Promise<void>;
  loadingPurchaseWithBusdHistory: LoadingState;
  loadingPurchaseWithNtrHistory: LoadingState;
  loadingClaimHistory: LoadingState;
}

export const useAdminLaunchpadRewards = create<NetworkRewards>()(
  devtools(
    (set, get) => ({
      coreTeamRewards: {
        totalEarning: { busd: 0, ntr: 0 },
        claimed: { busd: 0, ntr: 0 },
        claimable: { busd: 0, ntr: 0 },
      },
      companyRewards: {
        totalEarning: { busd: 0, ntr: 0 },
        claimed: { busd: 0, ntr: 0 },
        claimable: { busd: 0, ntr: 0 },
      },
      overview: {
        totalBusdContributors: 0,
        totalNtrContributors: 0,
        totalRaisingBusd: 0,
        totalRaisingNtr: 0,
        totalCentherTobeDistributedFromBusd: 0,
        totalCentherTobeDistributedFromNtr: 0,
      },
      purchaseWithBusdHistory: [],
      purchaseWithNtrHistory: [],
      claimHistory: [],
      loadingPurchaseWithBusdHistory: "idle",
      loadingPurchaseWithNtrHistory: "idle",
      loadingClaimHistory: "idle",

      fetchPurchaseWithBusdHistoryInLaunchpad: async () => {
        try {
          set({ loadingPurchaseWithBusdHistory: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _purchaseWithBusdHistory: PurchaseHistory[] = [];

          const { data: result, error: error } = await client.query({
            query: gql(purchaseWithBusdHistory),
            variables: {
              first: 1000,
              skip: 0,
            },
            fetchPolicy: "cache-first",
          });

          if (result && !error) {
            _purchaseWithBusdHistory =
              result.presalePurchaseWithBusdHistories.map((item: any) => {
                const date = new Date(item.createdAt * 1000);
                const paidAmount = Number(
                  ethers.utils.formatEther(item.busdAmount.toString())
                );
                const company = Number(
                  ethers.utils.formatEther(item.busdAmountForOwner.toString())
                );
                const coreTeam = paidAmount / 10;
                const referralNetwork = paidAmount - company - coreTeam;
                console.log("sniper: item: ", item);
                return {
                  date: `${date.getDate()}-${
                    date.getMonth() + 1
                  }-${date.getFullYear()}`,
                  publicKey: item.publicKey,
                  paidAmount: paidAmount,
                  round: Number(item.roundIndex) + 1,
                  coreTeam: coreTeam,
                  referralNetwork: referralNetwork,
                  company: company,
                };
              });
          }

          const presaleContract = getPresaleContract();
          const claimableBusdCompanyRaw =
            await presaleContract.busdAmountForOwner();
          const claimableBusdCompany = Number(
            ethers.utils.formatEther(claimableBusdCompanyRaw.toString())
          );
          const claimableBusdCoreTeamRaw =
            await presaleContract.busdAmountForCoreTeam();
          const claimableBusdCoreTeam = Number(
            ethers.utils.formatEther(claimableBusdCoreTeamRaw.toString())
          );

          set((state) => {
            let company = state.companyRewards;
            let coreTeam = state.coreTeamRewards;
            const busdCompany = _purchaseWithBusdHistory
              .map((item: any) => item.company)
              .reduce((prev: any, next: any) => prev + next);
            const busdCoreTeam = _purchaseWithBusdHistory
              .map((item: any) => item.coreTeam)
              .reduce((prev: any, next: any) => prev + next);
            company.totalEarning.busd = busdCompany;
            company.claimable.busd = claimableBusdCompany;
            company.claimed.busd = busdCompany - claimableBusdCompany;
            coreTeam.totalEarning.busd = busdCoreTeam;
            coreTeam.claimable.busd = claimableBusdCoreTeam;
            coreTeam.claimed.busd = busdCoreTeam - claimableBusdCoreTeam;

            let overview = state.overview;
            overview.totalBusdContributors = _purchaseWithBusdHistory.length;
            overview.totalRaisingBusd = _purchaseWithBusdHistory
              .map((item: any) => item.paidAmount)
              .reduce((prev: any, next: any) => prev + next);
            return {
              ...state,
              overview: overview,
              companyRewards: company,
              coreTeamRewards: coreTeam,
              purchaseWithBusdHistory: _purchaseWithBusdHistory,
              loadingPurchaseWithBusdHistory: "loaded",
            };
          });
        } catch (error) {
          set({ loadingPurchaseWithBusdHistory: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },

      fetchPurchaseWithNtrHistoryInLaunchpad: async () => {
        try {
          set({ loadingPurchaseWithNtrHistory: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _purchaseWithNtrHistory: PurchaseHistory[] = [];

          const { data: result, error: error } = await client.query({
            query: gql(purchaseWithNtrHistory),
            variables: {
              first: 1000,
              skip: 0,
            },
            fetchPolicy: "cache-first",
          });

          if (result && !error) {
            _purchaseWithNtrHistory =
              result.presalePurchaseWithNtrHistories.map((item: any) => {
                const date = new Date(item.createdAt * 1000);
                const paidAmount = Number(
                  ethers.utils.formatEther(item.ntrAmount.toString())
                );
                const company = Number(
                  ethers.utils.formatEther(item.ntrAmountForOwner.toString())
                );
                const coreTeam = paidAmount / 10;
                const referralNetwork = paidAmount - company - coreTeam;
                return {
                  date: `${date.getDate()}-${
                    date.getMonth() + 1
                  }-${date.getFullYear()}`,
                  publicKey: item.publicKey,
                  paidAmount: paidAmount,
                  round: Number(item.roundIndex) + 1,
                  coreTeam: coreTeam,
                  referralNetwork: referralNetwork,
                  company: company,
                };
              });
          }

          const presaleContract = getPresaleContract();
          const claimableNtrCompanyRaw =
            await presaleContract.ntrAmountForOwner();
          const claimableNtrCompany = Number(
            ethers.utils.formatEther(claimableNtrCompanyRaw.toString())
          );
          const claimableNtrCoreTeamRaw =
            await presaleContract.ntrAmountForCoreTeam();
          const claimableNtrCoreTeam = Number(
            ethers.utils.formatEther(claimableNtrCoreTeamRaw.toString())
          );

          set((state) => {
            let company = state.companyRewards;
            let coreTeam = state.coreTeamRewards;
            const ntrCompany =
              _purchaseWithNtrHistory.length > 0
                ? _purchaseWithNtrHistory
                    .map((item: any) => item.company)
                    .reduce((prev: any, next: any) => prev + next)
                : 0;
            const ntrCoreTeam =
              _purchaseWithNtrHistory.length > 0
                ? _purchaseWithNtrHistory
                    .map((item: any) => item.coreTeam)
                    .reduce((prev: any, next: any) => prev + next)
                : 0;
            company.totalEarning.ntr = ntrCompany;
            company.claimable.ntr = claimableNtrCompany;
            company.claimed.ntr = ntrCompany - claimableNtrCompany;
            coreTeam.totalEarning.ntr = ntrCoreTeam;
            coreTeam.claimable.ntr = claimableNtrCoreTeam;
            coreTeam.claimed.ntr = ntrCoreTeam - claimableNtrCoreTeam;

            let overview = state.overview;
            overview.totalNtrContributors = _purchaseWithNtrHistory.length;
            overview.totalRaisingNtr =
              _purchaseWithNtrHistory.length > 0
                ? _purchaseWithNtrHistory
                    .map((item: any) => item.paidAmount)
                    .reduce((prev: any, next: any) => prev + next)
                : 0;

            return {
              ...state,
              overview: overview,
              companyRewards: company,
              coreTeamRewards: coreTeam,
              purchaseWithNtrHistory: _purchaseWithNtrHistory,
              loadingPurchaseWithNtrHistory: "loaded",
            };
          });
        } catch (error) {
          set({ loadingPurchaseWithNtrHistory: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },

      fetchClaimHistoryInLaunchpad: async () => {
        try {
          set({ loadingClaimHistory: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _claimHistory: ClaimHistory[] = [];

          const { data: result, error: error } = await client.query({
            query: gql(claimCentherHistory),
            variables: {
              first: 1000,
              skip: 0,
            },
            fetchPolicy: "cache-first",
          });

          if (result && !error) {
            _claimHistory = result.presaleCentherClaimHistories.map(
              (item: any) => {
                const date = new Date(item.createdAt * 1000);
                const paidAmount = 0; //Number(ethers.utils.formatEther(item.busdAmount.toString()))
                const claimAmount = Number(
                  ethers.utils.formatEther(item.centherAmount.toString())
                );
                return {
                  date: `${date.getDate()}-${
                    date.getMonth() + 1
                  }-${date.getFullYear()}`,
                  publicKey: item.publicKey,
                  paidAmount: paidAmount,
                  round: Number(item.roundIndex) + 1,
                  claimAmount: claimAmount,
                };
              }
            );
          }

          set((state) => {
            return {
              ...state,
              claimHistory: _claimHistory,
              loadingClaimHistory: "loaded",
            };
          });
        } catch (error) {
          set({ loadingClaimHistory: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },
    }),
    { name: "ExploreStore" }
  )
);
