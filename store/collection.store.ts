import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { LoadingState } from "@/models/common";
import {
  CFSCollection,
  CFSNFT,
  CollectionAdditionalInfo,
  NFTSaleStateFilter,
  OrderDirection,
} from "@/models/nft";
import { NFTCardData } from "@/components/nft.card";
import { getNFTCardData } from "@/lib/get-nft-card-data/index";
import { getSingleCollection } from "@/lib/get-single-collection";
import { getNFTListOfSingleCollection } from "@/lib/get-nft-list-of-single-collection";
import { BlockchainRead } from "@/web3/blockchain";
import { customLog } from "@/utils/custom.log";

export interface CollectionStore {
  collectionAddress: string;
  collection: CFSCollection | null;
  collectionAdditionalInfo: CollectionAdditionalInfo | null;
  nfts: NFTCardData[];
  loadingCollection: LoadingState;
  loadingNfts: LoadingState;
  offset: number;
  filter: NFTSaleStateFilter;
  orderDir: OrderDirection;
  actions: {
    fetchCollection: () => Promise<void>;
    fetchCollectionAdditionalInfo: () => Promise<void>;
    fetchNFTs: () => Promise<void>;
    updateOffset: () => void;
    updateFilter: (filter: NFTSaleStateFilter) => void;
    updateOrderDir: (orderDir: OrderDirection) => void;
    resetStore: (
      collectionAddress: string,
      loadinCollection?: LoadingState,
      loadingNfts?: LoadingState,
      filter?: NFTSaleStateFilter,
      orderDir?: OrderDirection
    ) => void;
  };
}

export const useCollectionStore = create<CollectionStore>()(
  devtools(
    (set, get) => ({
      collectionAddress: "",
      collection: null,
      collectionAdditionalInfo: null,
      nfts: [],
      loadingCollection: "idle",
      loadingNfts: "idle",
      offset: 0,
      filter: "All",
      orderDir: "desc",
      actions: {
        fetchCollection: async () => {
          try {
            set({ loadingCollection: "loading" });
            const collectionAddress = get().collectionAddress;
            const _collection: CFSCollection = await getSingleCollection(
              collectionAddress
            );
            set(() => {
              return {
                collection: _collection,
                loadingCollection: "loaded",
              };
            });
          } catch (error) {
            set({ loadingCollection: "failed" });
            customLog(["development", "staging"], error);
          }
        },
        updateOffset: () =>
          set((state) => ({
            offset: state.nfts.length,
          })),
        updateFilter: (filter) => {
          set(() => ({
            filter: filter,
            offset: 0,
            nfts: [],
          }));
          get().actions.fetchNFTs();
        },
        updateOrderDir: (orderDir) => {
          set(() => ({
            orderDir: orderDir,
            offset: 0,
            nfts: [],
          }));
          get().actions.fetchNFTs();
        },
        fetchNFTs: async () => {
          try {
            set({ loadingNfts: "loading" });

            const collectionAddress = get().collectionAddress;
            const saleState = get().filter;
            const orderDir = get().orderDir;
            const offset = get().offset;

            const _nfts: CFSNFT[] = await getNFTListOfSingleCollection({
              collection_address: collectionAddress,
              orderDir: orderDir,
              saleState: saleState,
              limit: 20,
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
              loadingNfts: "loaded",
            }));
          } catch (error) {
            set({ loadingNfts: "failed" });
            customLog(["development", "staging"], error);
          }
        },
        fetchCollectionAdditionalInfo: async () => {
          const collection = get().collection;
          if (!collection) return;

          const { nfts: result, history } =
            await BlockchainRead.getCollectionAdditionalInfo(
              collection.collection,
              collection.creator
            );

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
          const listedPercent = (
            (listedItemCount / totalNftCount) *
            100
          ).toFixed(2);

          const ownerIncome = history.reduce(
            (a: number, b: any) => a + +b.price,
            0
          );

          set((state) => ({
            ...state,
            collectionAdditionalInfo: {
              minPrice: +minPrice,
              listedPercent: +listedPercent,
              ownerIncome: +ownerIncome,
            },
          }));
        },
        resetStore: (
          collectionAddress,
          loadingCollection = "idle",
          loadingNfts = "idle",
          filter = "All",
          orderDir = "desc"
        ) => {
          set({
            collectionAddress: collectionAddress.toLowerCase(),
            collection: null,
            collectionAdditionalInfo: null,
            nfts: [],
            loadingCollection,
            loadingNfts,
            filter,
            orderDir,
            offset: 0,
          });
        },
      },
    }),
    {
      name: "CollectionStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
