import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import { LoadingState } from "@/models/common";
import { Collection, NFT } from "@/models/nft";
import { MoralisFetcher } from "@/utils/fetch.files.tools/moralis.fetcher.util";
import { BlockchainRead } from "@/web3/blockchain";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";

export interface ProfileNFTStore {
  collections: Collection[] | undefined;
  ownedNfts: NFT[];
  listedNfts: NFT[];
  listedUserNfts: NFT[];
  createdNfts: NFT[];
  fetchCollections: (account: string) => Promise<void>;
  fetchOwnedNFTs: (account: string) => Promise<void>;
  fetchCreatedNFTs: (
    account: string,
    offset?: number,
    limit?: number,
    reload?: boolean
  ) => Promise<void>;
  fetchListedNFTs: (
    account: string,
    offset?: number,
    limit?: number,
    reload?: boolean
  ) => Promise<void>;
  fetchListedUserNFTs: (
    account: string,
    offset?: number,
    limit?: number,
    reload?: boolean
  ) => Promise<void>;
  ownedOffset: number;
  listedOffset: number;
  listedUserOffset: number;
  createdOffset: number;
  updateOwnedOffset: () => void;
  updateListedOffset: () => void;
  updateListedUserOffset: () => void;
  updateCreatedOffset: () => void;
  limit: number;
  loadingCollections: LoadingState;
  loadingOwnedNFTs: LoadingState;
  loadingListedNFTs: LoadingState;
  loadingListedUserNFTs: LoadingState;
  loadingCreatedNFTs: LoadingState;
}

export const useProfileNFTStore = create<ProfileNFTStore>()(
  devtools(
    (set) => ({
      collections: [],
      ownedNfts: [],
      listedNfts: [],
      listedUserNfts: [],
      createdNfts: [],
      listedOffset: 0,
      listedUserOffset: 0,
      ownedOffset: 0,
      createdOffset: 0,
      limit: 20,
      loadingCollections: "idle",
      loadingListedNFTs: "idle",
      loadingListedUserNFTs: "idle",
      loadingOwnedNFTs: "idle",
      loadingCreatedNFTs: "idle",

      updateListedOffset: () =>
        set((state) => ({
          listedOffset: state.listedNfts.length,
        })),

      updateListedUserOffset: () =>
        set((state) => ({
          listedOffset: state.listedNfts.length,
        })),

      updateOwnedOffset: () =>
        set((state) => ({
          ownedOffset: state.ownedNfts.length,
        })),

      updateCreatedOffset: () =>
        set((state) => ({
          createdOffset: state.createdNfts.length,
        })),

      fetchCollections: async (account) => {
        try {
          set({ loadingCollections: "loading" });
          let _collections = await BlockchainRead.getCollectionByAccount(
            account
          );
          set((state) => {
            return {
              collections: _collections,
              loadingCollections: "loaded",
            };
          });
        } catch (error) {
          set({ loadingCollections: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchListedNFTs: async (account, offset = 0, limit = 20, reload) => {
        try {
          set({ loadingListedNFTs: "loading" });

          let _nfts: NFT[] = [];

          const result = await BlockchainRead.getAccountListedNfts(
            limit,
            offset,
            account
          );
          if (result?.length) {
            _nfts = result.map((item: any) => {
              let _endTime = 0;
              if (item.saleState === "Auction") {
                _endTime = item.auctionInfo.endTime;
              }

              return {
                ...item,
                endTime: _endTime,
              };
            });
          }

          set((state) => {
            // Filter out all nfts that are already in the store
            const filteredNFTs = state.listedNfts.filter(
              (stateNFTs) =>
                !_nfts.some((nfts: NFT) => stateNFTs.id === nfts.id)
            );

            return {
              listedNfts: _nfts,
              loadingListedNFTs: "loaded",
            };
          });
        } catch (error) {
          set({ loadingListedNFTs: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchListedUserNFTs: async (account, offset = 0, limit = 20, reload) => {
        try {
          set({ loadingListedUserNFTs: "loading" });

          let _nfts: NFT[] = [];

          const result = await BlockchainRead.getUserListedNfts(
            limit,
            offset,
            account
          );

          if (result?.length) {
            _nfts = result.map((item: any) => {
              let _endTime = 0;
              if (item.saleState === "Auction") {
                _endTime = item.auctionInfo.endTime;
              }

              return {
                ...item,
                endTime: _endTime,
              };
            });
          }

          set((state) => {
            return {
              listedUserNfts: _nfts,
              loadingListedUserNFTs: "loaded",
            };
          });
        } catch (error) {
          set({ loadingListedUserNFTs: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchOwnedNFTs: async (account) => {
        try {
          set({ loadingOwnedNFTs: "loading" });
          let _nfts: NFT[] = [];
          const fetcher = new MoralisFetcher();
          const result = await fetcher.getWalletNfts({
            address: account,
            chain:
              process.env.NEXT_PUBLIC_APP_ENV === "production"
                ? EvmChain.BSC
                : EvmChain.GOERLI,
          });

          if (!result || !Array.isArray(result.result)) {
            throw new Error("Cannot get wallet NFTs.");
          }

          const platformNativeCollection = AddressFactory.getContractAddress(
            SmartContractName.NATIVE_COLLECTION
          );
          const _collections = await BlockchainRead.getRegisteredCollections();
          const _lockedNFTs = await BlockchainRead.getLockedNFTsAll();

          if (result.result) {
            const colctns = _collections?.map((e: any) => e.collection);
            colctns.push(platformNativeCollection);
            _nfts = result.result
              .filter((e) => isInList(e, colctns))
              .map((item: any) => {
                const unlock = getUnlockTime(
                  _lockedNFTs,
                  item.tokenAddress._value,
                  item.tokenId
                );
                return {
                  id: item.tokenHash,
                  collection: item.tokenAddress._value,
                  tokenId: item.tokenId,
                  creator: item.minter_address?._value,
                  createTime: item.blockNumberMinted,
                  ipfs: item.tokenUri,
                  saleState: "NON",
                  price: item.amount,
                  owner: item.ownerOf._value,
                  endTime: 0,
                  unlock: unlock,
                };
              });
          }

          set((state) => {
            return {
              ownedNfts: _nfts,
              loadingOwnedNFTs: "loaded",
            };
          });
        } catch (error) {
          set({ loadingOwnedNFTs: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchCreatedNFTs: async (account, offset = 0, limit = 20, reload) => {
        try {
          set({ loadingCreatedNFTs: "loading" });
          let _nfts: NFT[] = [];
          const result = await BlockchainRead.getAccountCreatedNfts(
            account,
            limit,
            offset
          );
          if (result?.length) {
            _nfts = result.map((item: any) => {
              let _endTime = 0;
              if (item.saleState === "Auction") {
                _endTime = item.auctionInfo.endTime;
              }
              return {
                id: item.id,
                collection: item.collection,
                tokenId: item.tokenId,
                creator: item.creator,
                createTime: item.createTime,
                ipfs: item.ipfs,
                saleState: item.saleState,
                price: item.price,
                owner: item.owner,
                endTime: _endTime,
                unlock: item.unlock,
              };
            });
          }

          set((state) => {
            return {
              createdNfts: _nfts,
              loadingCreatedNFTs: "loaded",
            };
          });
        } catch (error) {
          set({ loadingCreatedNFTs: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
    }),
    { name: "ProfileNFTStore" }
  )
);

const isInList = (nft: any, collections: any[]) => {
  if (!collections) {
    return false;
  }

  const tokenAddress = nft.tokenAddress._value;
  return !!collections.find(
    (e) => e.toLowerCase() == tokenAddress.toLowerCase()
  );
};

const getUnlockTime = (lockedNFTs: any[], collection: any, tokenId: any) => {
  const _filter = lockedNFTs.filter(
    (item: any) =>
      item.collection.toLowerCase() === collection.toLowerCase() &&
      Number(item.tokenId) === Number(tokenId)
  );

  if (_filter && _filter.length > 0) {
    return _filter[0].unlock;
  } else {
    return 0;
  }
};
