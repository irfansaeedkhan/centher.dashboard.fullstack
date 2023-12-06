import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { LoadingState } from "@/models/common";
import { CFSCollection } from "@/models/nft";
import { NFTImageCardData } from "@/components/nft.image.card/types";
import { getNFTListOfSingleCreatorFromAnyCollection } from "@/lib/get-nft-list-of-single-creator-from-any-collection";
import { getCollectionListOfSingleCreator } from "@/lib/get-collection-list-of-single-creator";
import { getNFTListOfSingleOwnerFromAnyCollection } from "@/lib/get-nft-list-of-single-owner-from-any-collection";

export interface ProfileNFTStore {
  collections: CFSCollection[];
  ownedNfts: NFTImageCardData[];
  listedNfts: NFTImageCardData[];
  createdNfts: NFTImageCardData[];
  fetchCollections: (creatorId: string) => Promise<void>;
  fetchOwnedNFTs: (
    ownerId: string,
    offset?: number,
    limit?: number
  ) => Promise<void>;
  fetchCreatedNFTs: (
    creatorId: string,
    offset?: number,
    limit?: number
  ) => Promise<void>;
  fetchListedNFTs: (
    ownerId: string,
    offset?: number,
    limit?: number
  ) => Promise<void>;
  ownedOffset: number;
  listedOffset: number;
  createdOffset: number;
  updateOwnedOffset: () => void;
  updateListedOffset: () => void;
  updateCreatedOffset: () => void;
  limit: number;
  loadingCollections: LoadingState;
  loadingOwnedNFTs: LoadingState;
  loadingListedNFTs: LoadingState;
  loadingCreatedNFTs: LoadingState;
}

export const useProfileNFTStore = create<ProfileNFTStore>()(
  devtools(
    (set) => ({
      collections: [],
      ownedNfts: [],
      listedNfts: [],
      createdNfts: [],
      listedOffset: 0,
      ownedOffset: 0,
      createdOffset: 0,
      limit: 20,
      loadingCollections: "idle",
      loadingListedNFTs: "idle",
      loadingOwnedNFTs: "idle",
      loadingCreatedNFTs: "idle",

      updateListedOffset: () =>
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
            limit: 50,
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

      fetchListedNFTs: async (ownerId, offset = 0, limit = 50) => {
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

      fetchOwnedNFTs: async (ownerId, offset = 0, limit = 50) => {
        try {
          set({ loadingOwnedNFTs: "loading" });

          const nfts = await getNFTListOfSingleOwnerFromAnyCollection({
            owner_address: ownerId,
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
                !state.ownedNfts.find((ownedNFT) => ownedNFT.id === nft.id)
            );

            return {
              ownedNfts: [...state.ownedNfts, ...filteredNFTs],
              loadingOwnedNFTs: "loaded",
            };
          });
        } catch (error) {
          set({ loadingOwnedNFTs: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchCreatedNFTs: async (creatorId, offset = 0, limit = 50) => {
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
