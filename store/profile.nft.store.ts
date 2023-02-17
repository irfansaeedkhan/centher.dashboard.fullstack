// React, Next, NPM Packages
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EvmChain } from "@moralisweb3/common-evm-utils";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  registeredCollections,
  collectionsByAccount,
  listedNFTsByAccount,
  createdNFTsByAccount,
} from "@/subgraph/querys";
import { LoadingState } from "@/models/common";
import { Collection, NFT } from "@/models/nft";
import { SUBGRAPH_URL } from "@/web3/constants/common";
import { MoralisFetcher } from "@/utils/fetch.files.tools/moralis.fetcher.util";

export interface ProfileNFTStore {
  collections: Collection[] | undefined;
  ownedNfts: NFT[];
  listedNfts: NFT[];
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

      fetchCollections: async (account) => {
        try {
          set({ loadingCollections: "loading" });
          const client = new ApolloClient({
            uri: SUBGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _collections: Collection[];
          const {
            data: result,
            error,
            loading,
          } = await client.query({
            query: gql(collectionsByAccount),
            variables: {
              creator: account,
            },
            fetchPolicy: "cache-first",
          });

          if (result) {
            _collections = result.collections;
          }

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

      fetchListedNFTs: async (account, offset, limit, reload) => {
        try {
          set({ loadingListedNFTs: "loading" });
          const client = new ApolloClient({
            uri: SUBGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _nfts: NFT[] = [];
          const {
            data: result,
            error,
            loading,
          } = await client.query({
            query: gql(listedNFTsByAccount),
            variables: {
              first: limit,
              skip: offset,
              owner: account,
            },
            fetchPolicy: "cache-first",
          });

          if (result) {
            _nfts = result.nfts.map((item: any) => {
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

          if (result.result) {
            _nfts = result.result.map((item: any) => {
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
      fetchCreatedNFTs: async (account, offset, limit, reload) => {
        try {
          set({ loadingCreatedNFTs: "loading" });
          const client = new ApolloClient({
            uri: SUBGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _nfts: NFT[];
          const {
            data: result,
            error,
            loading,
          } = await client.query({
            query: gql(createdNFTsByAccount),
            variables: {
              first: limit,
              skip: offset,
              creator: account,
            },
            fetchPolicy: "cache-first",
          });

          if (result) {
            _nfts = result.nfts.map((item: any) => {
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

const dummyOwnedNFTs: NFT[] = [
  {
    id: "4353fgdgdg",
    collection: "0x134ertd4",
    tokenId: 8790,
    creator: "halik",
    createTime: 1629200000000,
    // ipfs: "https://ipfs.moralis.io:2053/ipfs/QmSxqutiHw4vTkL9aLAve3vFRCxVyydxZL5tWaaXnQFZtf/nether/YEUE2751.JPG",
    // ipfs/QmasLg9shC2DmF4smP2uTxvGJNVg5v1hQw8zuVAVVYPjZt/nether/newcollection.json
    ipfs: "ipfs://QmasLg9shC2DmF4smP2uTxvGJNVg5v1hQw8zuVAVVYPjZt/nether/newcollection.json",
    saleState: "NON",
    price: 0.1,
    owner: "halik",
    endTime: 1669200000000,
  },
];
