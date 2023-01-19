// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  claimCentherHistory,
  purchaseWithBusdHistory,
  purchaseWithNtrHistory,
  registrationHistory,
} from "@/subgraph/querys";
import { LoadingState } from "@/models/common";
import {
  ClaimHistory,
  Overview,
  PurchaseHistory,
  RegistrationHistory,
  Rewards,
} from "@/models/referral";
import { ethers } from "ethers";
import { getPresaleContract } from "@/web3/utils/contract.helpers";
import { getRegistrationAddress } from "@/web3/utils/address.helpers";
import { SUBGRAPH_URL, ZeroAddress } from "@/web3/constants/common";
import { Web3Provider } from "@ethersproject/providers";
import { simpleRpcProvider } from "@/web3/utils/providers";

export interface NetworkRewards {
  totalMembersWithoutReferrer: number;
  totalMembersWithReferrer: number;
  totalMembers: number;
  registrationHistory: RegistrationHistory[];
  claimableBNB: number;
  claimedBNB: number;
  fetchRegistrationInfo: () => Promise<void>;
  loading: LoadingState;
}

export const useAdminRegistration = create<NetworkRewards>()(
  devtools(
    (set, get) => ({
      totalMembersWithoutReferrer: 0,
      totalMembersWithReferrer: 0,
      totalMembers: 0,
      registrationHistory: [],
      claimableBNB: 0,
      claimedBNB: 0,
      loading: "idle",

      fetchRegistrationInfo: async () => {
        try {
          set({ loading: "loading" });
          const client = new ApolloClient({
            uri: SUBGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _registrationHistory: RegistrationHistory[] = [];

          const { data: result, error: error } = await client.query({
            query: gql(registrationHistory),
            variables: {
              first: 1000,
              skip: 0,
            },
            fetchPolicy: "cache-first",
          });

          if (result && !error) {
            _registrationHistory = result.users.map((item: any) => {
              const date = new Date(item.createdAt * 1000);
              return {
                date: `${date.getDate()}-${
                  date.getMonth() + 1
                }-${date.getFullYear()}`,
                publicKey: item.publicKey,
                paidAmount: Number(
                  ethers.utils.formatEther(item.paidAmountForRegistration)
                ),
                referrer: item.referrer,
              };
            });
          }

          const registrationAddress = getRegistrationAddress();
          const _claimableBNB = Number(
            ethers.utils.formatEther(
              await simpleRpcProvider.getBalance(registrationAddress)
            )
          );

          set((state) => {
            const _totalMembersWithoutReferrer = _registrationHistory.filter(
              (item: any) => item.referrer === ZeroAddress
            );
            const _totalMembersWithReferrer = _registrationHistory.filter(
              (item: any) => item.referrer !== ZeroAddress
            );
            const _totalEarningBNB: number =
              _registrationHistory.length > 0
                ? _registrationHistory
                    .map((item: any) => item.paidAmount)
                    .reduce((prev: any, next: any) => prev + next)
                : 0;
            return {
              ...state,
              totalMembers: _registrationHistory.length,
              totalMembersWithoutReferrer: _totalMembersWithoutReferrer.length,
              totalMembersWithReferrer: _totalMembersWithReferrer.length,
              registrationHistory: _registrationHistory,
              claimableBNB: _claimableBNB,
              claimedBNB: _totalEarningBNB - _claimableBNB,
              loading: "loaded",
            };
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
    }),
    { name: "AdminRegistrationStore" }
  )
);
