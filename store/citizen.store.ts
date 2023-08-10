import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export enum CitizenShipType {
  annualMemberShipPrice = "annualMemberShipPrice",
  oneMonthMemberShipPrice = "oneMonthMemberShipPrice",
}

export type CitizenShipPrice = Record<keyof typeof CitizenShipType, number>;

const defaultPrices: CitizenShipPrice = {
  oneMonthMemberShipPrice: 0,
  annualMemberShipPrice: 0,
};

export interface CitizenStore {
  isCitizen: boolean;
  prices: CitizenShipPrice;
  updateStatusLoading: boolean;
  updatePricesLoading: boolean;
  buyCitizenShipLoading: boolean;
  subscriptionEndAt: string;

  updateCitizenShipStatus: (library: Web3Provider, account: string) => void;
  updatePrices: (library: Web3Provider) => void;
  buyCitizenShip: (
    library: Web3Provider,
    type: CitizenShipType,
    account: string
  ) => Promise<void>;
}

export const useCitizenStore = create<CitizenStore>()(
  devtools(
    (set, get) => ({
      isCitizen: false,
      prices: defaultPrices,
      updateStatusLoading: false,
      updatePricesLoading: false,
      buyCitizenShipLoading: false,
      subscriptionEndAt: +new Date() + "",
      updateCitizenShipStatus: async (
        library: Web3Provider,
        account: string
      ) => {
        try {
          validateAccount(account);
          validateProvider(library);

          set({ updateStatusLoading: true });

          const subscriptionEndAt = await BlockchainRead.isCitizen(
            library,
            account
          );

          const isCitizen = +subscriptionEndAt > Math.floor(+new Date() / 1000);

          set({
            isCitizen,
            subscriptionEndAt,
            updateStatusLoading: false,
          });
        } catch (error) {
          set({ updateStatusLoading: false });
          throw error;
        }
      },
      updatePrices: async (library: Web3Provider) => {
        try {
          validateProvider(library);

          set({ updatePricesLoading: true });

          const getPriceRequests = Object.keys(CitizenShipType).map(
            (e: string) =>
              BlockchainRead.getCitizenPrice(library, e as CitizenShipType)
          );

          const result = await Promise.all(getPriceRequests);

          const prices = Object.fromEntries(result);

          set({ prices, updatePricesLoading: false });
        } catch (error) {
          set({ updatePricesLoading: false });
          throw error;
        }
      },
      buyCitizenShip: async (
        library: Web3Provider,
        type: CitizenShipType,
        account: string
      ) => {
        try {
          validateProvider(library);
          set({ buyCitizenShipLoading: true });

          if (get().prices[type] == 0) {
            await get().updatePrices(library);
          }

          const price = get().prices[type];

          if (price == 0) {
            throw new Error("Invalid price");
          }

          const txHash = await BlockchainWrite.buyCitizenShip(price, library);
          if (!txHash?.length) {
            throw new Error("Invalid tx hash");
          }

          set({ buyCitizenShipLoading: false });

          await get().updateCitizenShipStatus(library, account);
        } catch (error) {
          set({ buyCitizenShipLoading: false });
          throw error;
        }
      },
    }),
    { name: "CitizenStore" }
  )
);

const validateAccount = (account: string) => {
  if (!account || !ethers.utils.isAddress(account)) {
    throw new Error("Invalid account");
  }
};

const validateProvider = (library: Web3Provider) => {
  if (!library) {
    throw new Error("Invalid Web3 Provider");
  }
};
