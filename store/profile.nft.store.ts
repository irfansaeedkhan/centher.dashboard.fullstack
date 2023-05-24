import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import { LoadingState } from "@/models/common";
import { Collection } from "@/models/nft";
import { MoralisFetcher } from "@/utils/fetch.files.tools/moralis.fetcher.util";
import { BlockchainRead } from "@/web3/blockchain";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import {
  NFTLockedDetailsProps,
  getUsersByAddressesFromDB,
} from "@/lib/get-user-by-address";
import {
  getOldName,
  isOld,
} from "@/web3/blockchain/helpers/native.collection.helper";
import { SwapCollection } from "@/web3/blockchain/config";

const swappingCollections = [SwapCollection];
const externalCollectionsToShow = [...swappingCollections];

export interface ProfileNFTStore {
  allowedCollections: string[];
  collections: Collection[] | undefined;
  ownedNfts: NFTLockedDetailsProps[];
  listedNfts: NFTLockedDetailsProps[];
  listedUserNfts: NFTLockedDetailsProps[];
  createdNfts: NFTLockedDetailsProps[];
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
      allowedCollections: [],
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

          _collections = _collections.map((collection) => {
            if (isOld(collection.collection)) {
              return {
                ...collection,
                name: getOldName(),
              };
            } else return collection;
          });

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

          let _nfts: NFTLockedDetailsProps[] = [];

          const result = await BlockchainRead.getAccountListedNfts(
            limit,
            offset,
            account
          );
          if (result?.length) {
            const users = await getUsers(
              result.map((e) => [e.creator, e.owner]).flat()
            );

            _nfts = result.map((item: any) => {
              let _endTime = 0;
              if (item.saleState === "Auction") {
                _endTime = item.auctionInfo.endTime;
              }
              const { creator, owner, ...rest } = item;
              return {
                ...rest,
                creator: users.find((e) =>
                  isAddressesMatch(e.account_address, item.creator)
                ),
                owner: users.find((e) =>
                  isAddressesMatch(e.account_address, item.owner)
                ),
                endTime: _endTime,
              };
            });
          }

          set((state) => {
            // Filter out all nfts that are already in the store
            const filteredNFTs = state.listedNfts.filter(
              (stateNFTs) =>
                !_nfts.some(
                  (nfts: NFTLockedDetailsProps) => stateNFTs.id === nfts.id
                )
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

          let _nfts: NFTLockedDetailsProps[] = [];

          const result = await BlockchainRead.getUserListedNfts(
            limit,
            offset,
            account
          );

          if (result?.length) {
            const users = await getUsers(
              result.map((e) => [e.creator, e.owner]).flat()
            );

            _nfts = result.map((item: any) => {
              let _endTime = 0;
              if (item.saleState === "Auction") {
                _endTime = item.auctionInfo.endTime;
              }
              const { creator, owner, ...rest } = item;
              return {
                ...rest,
                creator: users.find((e) =>
                  isAddressesMatch(e.account_address, item.creator)
                ),
                owner: users.find((e) =>
                  isAddressesMatch(e.account_address, item.owner)
                ),
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
          let allowedCollections: string[] = [];
          let _nfts: NFTLockedDetailsProps[] = [];
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

          externalCollectionsToShow.push(platformNativeCollection);

          const _collections = await BlockchainRead.getRegisteredCollections();
          const _lockedNFTs = await BlockchainRead.getLockedNFTsAll();

          if (result.result) {
            allowedCollections = _collections?.map((e: any) => e.collection);
            allowedCollections.push(...externalCollectionsToShow);
            const users = await getUsers(
              result.result
                .map((e: any) => [e.minter_address?._value, e.ownerOf?._value])
                .flat()
                .filter(Boolean)
            );
            for (let token of result.result) {
              const item = token as any;

              let unlock = getUnlockTime(
                _lockedNFTs,
                item.tokenAddress._value,
                item.tokenId
              );
              const creator = users.find((e) =>
                isAddressesMatch(e.account_address, item.minter_address?._value)
              );
              const owner = users.find((e) =>
                isAddressesMatch(e.account_address, item.ownerOf?._value)
              );

              const internal = isInList(item, allowedCollections);
              const isSwap = isInList(item, swappingCollections);
              const saleState = isSwap ? "SWAP" : !internal ? "VIEW" : "NON";

              unlock = isSwap
                ? await getSwapingUnlockTime(
                    item.tokenId,
                    swappingCollections[0]
                  )
                : unlock;

              _nfts.push({
                id: item.tokenHash,
                collection: item.tokenAddress?._value,
                tokenId: item.tokenId,
                creator: creator ? creator : null,
                createTime: item.blockNumberMinted,
                ipfs: item.tokenUri,
                saleState: "SWAP",
                price: item.amount,
                owner: owner ? owner : null,
                endTime: 0,
                unlock: unlock,
                mintHash: item.tokenHash,
                external: !internal,
              });
            }
          }

          set((state) => {
            return {
              allowedCollections,
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
          let _nfts: NFTLockedDetailsProps[] = [];
          const result = await BlockchainRead.getAccountCreatedNfts(
            account,
            limit,
            offset
          );
          if (result?.length) {
            const users = await getUsers(
              result.map((e) => [e.creator, e.owner]).flat()
            );

            _nfts = result.map((item: any) => {
              let _endTime = 0;
              if (item.saleState === "Auction") {
                _endTime = item.auctionInfo.endTime;
              }

              const creator = users.find((e) =>
                isAddressesMatch(e.account_address, item.creator)
              );
              const owner = users.find((e) =>
                isAddressesMatch(e.account_address, item.owner)
              );

              return {
                id: item.id,
                collection: item.collection,
                tokenId: item.tokenId,
                creator: creator ? creator : null,
                createTime: item.createTime,
                ipfs: item.ipfs,
                saleState: item.saleState,
                price: item.price,
                owner: owner ? owner : null,
                endTime: _endTime,
                unlock: item.unlock,
                mintHash: item.mintHash,
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
  if (!collections?.length) {
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

const getUsers = async (addresses: string[]) => {
  const result = await getUsersByAddressesFromDB(addresses);
  return result;
};

const isAddressesMatch = (
  address_one: string,
  address_two: string
): boolean => {
  return (
    !!address_one &&
    !!address_two &&
    address_one.toLowerCase() === address_two.toLowerCase()
  );
};

const getSwapingUnlockTime = async (
  tokenId: number,
  collection: string
): Promise<number> => {
  return BlockchainRead.getTokenUnlockTimeFromContract(collection, tokenId);
};
