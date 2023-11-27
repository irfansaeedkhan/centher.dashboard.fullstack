import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { LoadingState } from "@/models/common";
import {
  CFSNFT,
  CollectionAdditionalInfo,
  CollectionInfo,
  NFTSaleStateFilter,
  OrderDirection,
} from "@/models/nft";
import { NFTCardData } from "@/components/nft.card";
import { getNFTCardData } from "@/lib/get-nft-card-data/index";
import { getNFTListOfSingleCollection } from "@/lib/get-nft-list-of-single-collection";
import { BlockchainRead } from "@/web3/blockchain";
import {
  getOldName,
  isOld,
} from "@/web3/blockchain/helpers/native.collection.helper";
import { customLog } from "@/utils/custom.log";

export interface CollectionStore {
  info: CollectionInfo | undefined;
  fetchCollectionInfo: (collection: string) => Promise<void>;
  nfts: NFTCardData[];
  fetchNFTs: (
    collection: string,
    saleState: NFTSaleStateFilter,
    orderDir: OrderDirection,
    offset?: number,
    limit?: number
  ) => Promise<void>;
  offset: number;
  updateOffset: () => void;
  filter: NFTSaleStateFilter;
  updateFilter: (filter: NFTSaleStateFilter) => void;
  limit: number;
  loadingCollectionInfo: LoadingState;
  loadingNFTs: LoadingState;
  collectionAdditionalDetails: CollectionAdditionalInfo | undefined;
  updateCollectionAdditionalInfo: (collection: string, user: string) => void;
}

export const useCollectionStore = create<CollectionStore>()(
  devtools(
    (set, get) => ({
      info: undefined,
      nfts: [],
      offset: 0,
      filter: "All",
      limit: 20,
      loadingCollectionInfo: "idle",
      loadingNFTs: "idle",
      collectionAdditionalDetails: undefined,
      updateOffset: () =>
        set((state) => ({
          offset: state.nfts.length,
        })),

      updateFilter: (filter) =>
        set(() => ({
          filter: filter,
          offset: 0,
          nfts: [],
        })),

      fetchCollectionInfo: async (collection) => {
        try {
          set({ loadingCollectionInfo: "loading" });
          let _collection: CollectionInfo = await BlockchainRead.getCollection(
            collection
          );

          let col: CollectionInfo;
          if (isOld(collection)) {
            col = {
              name: getOldName(),
              txTime: _collection.txTime,
              tradingVolumn: _collection.tradingVolumn,
              totalSupply: _collection.totalSupply,
              symbol: _collection.symbol,
              maxSupply: _collection.maxSupply,
              ipfs: _collection.ipfs,
              creator: _collection.creator,
              createHash: _collection.createHash,
              collection: _collection.collection,
            };
          } else {
            col = _collection;
          }

          set((state) => {
            return {
              info: col,
              loadingCollectionInfo: "loaded",
            };
          });
        } catch (error) {
          set({ loadingCollectionInfo: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchNFTs: async (
        collection,
        saleState,
        orderDir,
        offset = 0,
        limit = 20
      ) => {
        try {
          set({ loadingNFTs: "loading" });
          let _nfts: CFSNFT[] = await getNFTListOfSingleCollection({
            collection_address: collection,
            orderDir: orderDir,
            saleState: saleState,
            limit: limit,
            skip: offset,
          });

          const nftCardData = _nfts.map((nft) => getNFTCardData(nft));

          // Remove nfts that are already in the store
          const filteredNFTs = nftCardData.filter(
            (nft) => !get().nfts.some((stateNFT) => stateNFT.id === nft.id)
          );

          set((state) => ({
            ...state,
            nfts: [...state.nfts, ...filteredNFTs],
            loadingNFTs: "loaded",
          }));
        } catch (error) {
          set({ loadingNFTs: "failed" });
          customLog(["development", "staging"], error);
        }
      },
      updateCollectionAdditionalInfo: async (
        collection: string,
        user: string
      ) => {
        const { nfts: result, history } =
          await BlockchainRead.getCollectionAdditionalInfo(collection, user);

        const listedItems = result.filter(
          (e: any) =>
            e.saleState.toLowerCase() == "auction" ||
            e.saleState.toLowerCase() == "list"
        );
        const listedItemCount = listedItems.length;
        const minPrice =
          listedItemCount > 0
            ? Math.min(...listedItems.map((e: any) => e.price))
            : 0;
        const totalNftCount = result.length;
        const listedPercent = ((listedItemCount / totalNftCount) * 100).toFixed(
          2
        );

        const ownerIncome = history.reduce(
          (a: number, b: any) => a + +b.price,
          0
        );

        set((state) => ({
          ...state,
          collectionAdditionalDetails: {
            minPrice: +minPrice,
            listedPercent: +listedPercent,
            ownerIncome: +ownerIncome,
          },
        }));
      },
    }),
    { name: "ExploreStore" }
  )
);
