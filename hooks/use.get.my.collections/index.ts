import { myCollections, nftQuery, saleQuery } from "@/subgraph/querys";
import { formatIPFSUrl } from "@/utils/format.address";
import useRefresh from "@/web3/hooks/use.refresh";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import axios from "axios";
import { useEffect, useState } from "react";

const NetherNativeCollection = {
  id: "1",
  name: "CENTHER Native NFT",
  collection: "0x453Ac6fCA7184cd09e3bbFE11D9679E2F17Ce0Fc",
};

export interface IMyCollection {
  id: string;
  name: string;
  collection: string;
}

export const useGetMyCollections = (account: string | null | undefined) => {
  const [collections, setCollections] = useState<IMyCollection[]>([
    NetherNativeCollection,
  ]);

  useEffect(() => {
    const fetchMyCollections = async (account: string) => {
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data: result } = await client.query({
        query: gql(myCollections),
        variables: {
          creator: account,
        },
        fetchPolicy: "cache-first",
      });

      if (result.collections && result.collections.length > 0) {
        const _collections = result.collections.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            collection: item.collection,
          };
        });
        setCollections([NetherNativeCollection, ..._collections]);
      }
    };

    if (account) {
      fetchMyCollections(account);
    }
  }, [account]);
  return collections;
};
