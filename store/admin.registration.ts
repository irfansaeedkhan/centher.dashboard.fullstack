// React, Next, NPM Packages
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { LoadingState } from "@/models/common";
import { RegistrationHistory } from "@/models/referral";
import { ethers } from "ethers";
import { ZeroAddress } from "@/web3/constants/common";
import { BlockchainRead } from "@/web3/blockchain";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { simpleRpcProvider } from "@/web3/blockchain/helpers/provider.helper";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";

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

          let _registrationHistory: RegistrationHistory[] = [];
          const result = await BlockchainRead.getRegistrationHistory(1000, 0);

          if (result?.length) {
            _registrationHistory = result.map((item: any) => {
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
                createdAt: 0,
              };
            });
          }

          const registrationAddress = AddressFactory.getContractAddress(
            SmartContractName.REGISTRATION
          );
          const _claimableBNB = Number(
            ethers.utils.formatEther(
              await simpleRpcProvider().getBalance(registrationAddress)
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
