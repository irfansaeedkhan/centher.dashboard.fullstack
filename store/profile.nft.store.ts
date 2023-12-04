import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { LoadingState } from "@/models/common";
import { CFSCollection } from "@/models/nft";
import { MoralisFetcher } from "@/utils/fetch.files.tools/moralis.fetcher.util";
import { BlockchainRead } from "@/web3/blockchain";
import { AddressFactory } from "@/web3/blockchain/providers/address.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { SwapCollection } from "@/web3/blockchain/config";
import { getUsersByIdsFromDB } from "@/lib/get-user-by-id";
import { getNFTListOfSingleCreatorFromAnyCollection } from "@/lib/get-nft-list-of-single-creator-from-any-collection";
import { NFTImageCardData } from "@/components/nft.image.card/types";
import { getCollectionListOfSingleCreator } from "@/lib/get-collection-list-of-single-creator";
import { getNFTListOfSingleOwnerFromAnyCollection } from "@/lib/get-nft-list-of-single-owner-from-any-collection";

const dexaCollection = "0x08b660beec8d1f9a0162e3c04416c84eac8d334b";
const dexaProfile = "0xa638d0182d075278a9ea6480c1430c6e7fb490c9";

const swappingCollections = [SwapCollection];
const externalCollectionsToShow = [...swappingCollections];

export interface ProfileNFTStore {
  allowedCollections: string[];
  collections: CFSCollection[];
  ownedNfts: NFTImageCardData[];
  listedNfts: NFTImageCardData[];
  createdNfts: NFTImageCardData[];
  fetchCollections: (creatorId: string) => Promise<void>;
  fetchOwnedNFTs: (account: string) => Promise<void>;
  fetchCreatedNFTs: (
    creatorId: string,
    offset?: number,
    limit?: number
  ) => Promise<void>;
  fetchListedNFTs: (
    ownerId: string,
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

      fetchCollections: async (creatorId) => {
        try {
          set({ loadingCollections: "loading" });
          const collections = await getCollectionListOfSingleCreator({
            creator_address: creatorId,
            limit: 100,
            skip: 0,
          });

          set(() => {
            return {
              collections,
              loadingCollections: "loaded",
            };
          });
        } catch (error) {
          set({ loadingCollections: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchListedNFTs: async (ownerId, offset = 0, limit = 20) => {
        try {
          set({ loadingListedNFTs: "loading" });

          const nfts = await getNFTListOfSingleOwnerFromAnyCollection({
            owner_address: ownerId,
            saleState: "List",
            limit,
            skip: offset,
          });

          const nftImageCardDataList: NFTImageCardData[] = nfts.map((item) => {
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
              endTime:
                item.saleState === "Auction" ? item.auctionInfo.endTime : "0",
              unlock: item.unlock,
              mintHash: item.mintHash,
              owner_data: item.owner_data,
              creator_data: item.creator_data,
              ipfs_metadata: item.ipfs_metadata,
              external: false,
            };
          });

          set((state) => {
            // Filter out all nfts that are already in the store
            const filteredNFTs = nftImageCardDataList.filter(
              (nft) =>
                !state.listedNfts.find((listedNFT) => listedNFT.id === nft.id)
            );

            return {
              listedNfts: [...state.listedNfts, ...filteredNFTs],
              loadingListedNFTs: "loaded",
            };
          });
        } catch (error) {
          set({ loadingListedNFTs: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchOwnedNFTs: async (account) => {
        try {
          set({ loadingOwnedNFTs: "loading" });
          let allowedCollections: string[] = [];
          let _nfts: NFTImageCardData[] = [];
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
            const userAddressesToFetch = result.result
              .map((e: any) => [e.minter_address?._value, e.ownerOf?._value])
              .flat()
              .filter(Boolean);

            if (
              !userAddressesToFetch.find((e) =>
                isAddressesMatch(e, dexaProfile)
              )
            ) {
              userAddressesToFetch.push(dexaProfile);
            }

            const users = await getUsers(userAddressesToFetch);

            for (let token of result.result) {
              const item = token as any;

              let unlock = getUnlockTime(
                _lockedNFTs,
                item.tokenAddress._value,
                item.tokenId
              );

              let creator = users.find((e) =>
                isAddressesMatch(e._id, item.minter_address?._value)
              );

              if (isAddressesMatch(item.tokenAddress?._value, dexaCollection)) {
                creator = users.find((e) =>
                  isAddressesMatch(e._id, dexaProfile)
                );
              }

              const owner = users.find((e) =>
                isAddressesMatch(e._id, item.ownerOf?._value)
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
                saleState,
                price: item.amount,
                owner: owner ? owner : null,
                endTime: "0",
                unlock: unlock,
                mintHash: item.tokenHash,
                external: !internal,
              });
            }
          }

          set(() => {
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

      fetchCreatedNFTs: async (creatorId, offset = 0, limit = 20) => {
        try {
          set({ loadingCreatedNFTs: "loading" });

          const nfts = await getNFTListOfSingleCreatorFromAnyCollection({
            creator_address: creatorId,
            limit,
            skip: offset,
          });

          const nftImageCardDataList: NFTImageCardData[] = nfts.map((item) => {
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
              endTime:
                item.saleState === "Auction" ? item.auctionInfo.endTime : "0",
              unlock: item.unlock,
              mintHash: item.mintHash,
              owner_data: item.owner_data,
              creator_data: item.creator_data,
              ipfs_metadata: item.ipfs_metadata,
              external: false,
            };
          });

          set(() => {
            return {
              createdNfts: nftImageCardDataList,
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
  const result = await getUsersByIdsFromDB(addresses);
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
