// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  registeredCollections,
  collectionsByAccount,
  listedNFTsByAccount,
} from "@/subgraph/querys";
import { LoadingState } from "@/models/common";
import { Collection, NFT } from "./explore.store";

export interface ProfileNFTStore {
  collections: Collection[] | undefined;
  ownedNfts: NFT[];
  listedNfts: NFT[];
  fetchCollections: (account: string) => Promise<void>;
  fetchOwnedNFTs: (
    account: string
  ) => Promise<void>;
  fetchListedNFTs: (
    account: string,
    offset?: number,
    limit?: number,
    reload?: boolean
  ) => Promise<void>;
  ownedOffset: number;
  listedOffset: number;
  updateOwnedOffset: () => void;
  updateListedOffset: () => void;
  limit: number;
  loadingCollections: LoadingState;
  loadingOwnedNFTs: LoadingState;
  loadingListedNFTs: LoadingState;
}

export const useProfileNFTStore = create<ProfileNFTStore>()(
  devtools(
    (set) => ({
      collections: [],
      ownedNfts: [],
      listedNfts: [],
      listedOffset: 0,
      ownedOffset: 0,
      limit: 20,
      loadingCollections: "idle",
      loadingListedNFTs: "idle",
      loadingOwnedNFTs: "idle",
      updateListedOffset: () =>
        set((state) => ({
          listedOffset: state.listedNfts.length,
        })),

      updateOwnedOffset: () =>
      set((state) => ({
        ownedOffset: state.ownedNfts.length,
      })),

      fetchCollections: async (account) => {
        try {
          set({ loadingCollections: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
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
          
          if (result && !error) {
            _collections = result.collections.map((item: any) => {
              return {
                id: item.id,
                collection: item.collection,
                name: item.name,
                symbol: item.symbol,
                maxSupply: item.maxSupply,
                totalSupply: item.totalSupply,
                creator: item.creator,
                ipfs: item.ipfs,
                txTime: item.txTime
              }
            });
          }
            

          set((state) => {
            return {
              collections: _collections,
              loadingCollections: "loaded",
            };
          });
        } catch (error) {
          set({ loadingCollections: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },

      fetchListedNFTs: async (
        account,
        offset,
        limit,
        reload
      ) => {
        try {
          set({ loadingListedNFTs: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
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
            // Filter out all nfts that are already in the store
            const filteredNFTs = state.listedNfts.filter(
              (stateNFTs) =>
                !_nfts.some((nfts: NFT) => stateNFTs.id === nfts.id)
            );
            if (reload) {
              return {
                listedNfts: _nfts,
                loadingListedNFTs: "loaded",
              };
            } else {
              return {
                listedNfts: [..._nfts, ...filteredNFTs],
                loadingListedNFTs: "loaded",
              };
            }
          });
        } catch (error) {
          set({ loadingListedNFTs: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },
      
      fetchOwnedNFTs: async (
        account
      ) => {
        try {
          set({ loadingOwnedNFTs: "loading" });
          let _nfts: NFT[] = [];
          const result: any = await Moralis.EvmApi.nft.getWalletNFTs({
            address: account,
            chain: EvmChain.GOERLI,
          });

          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _collections: any[] = [];
          const {
            data: result1,
            error,
            loading,
          } = await client.query({
            query: gql(registeredCollections),
            variables: {},
            fetchPolicy: "cache-first",
          });
          
          if(result1) {
            _collections = result1.collections.map((item: any) => {
              return item.collection
            })
          }
          console.log("sniper: _collections: ", _collections)

          if (result) {
            const result2 = result.data.result.filter((item: any) => {
              return _collections.includes(item.token_address)
            })
            _nfts = result2.map((item: any) => {
              let ipfs = item.token_uri
              if(item.token_uri.split("ipfs").length > 2)
                ipfs = "ipfs:/" + item.token_uri.split("ipfs")[2]
              return {
                id: item.token_hash,
                collection: item.token_address,
                tokenId: item.token_id,
                creator: item.minter_address,
                createTime: item.block_number_minted,
                ipfs: item.token_uri,
                saleState: "NON",
                price: 0,
                owner: item.owner_of,
                endTime: 0,
              };
            });
          }
          console.log("sniper: owned NFTs: ", _nfts)

          set((state) => {
            // Filter out all nfts that are already in the store
            const filteredNFTs = state.ownedNfts.filter(
              (stateNFTs) =>
                !_nfts.some((nfts: NFT) => stateNFTs.id === nfts.id)
            );
            
            return {
              ownedNfts: _nfts,
              loadingOwnedNFTs: "loaded",
            };
            
          });
        } catch (error) {
          set({ loadingOwnedNFTs: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },

    }),
    { name: "ProfileNFTStore" }
  )
);
