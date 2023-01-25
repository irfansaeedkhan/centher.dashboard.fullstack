import { myCollections } from "@/subgraph/querys";
import { SUBGRAPH_URL } from "@/web3/constants/common";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { useEffect, useState } from "react";

const CentherNativeCollection = {
  id: "1",
  name: "CENTHER Native NFT",
  collection: "0x29791EAdDc3a0E1CFE54f6eC7f24FAbe1Cdc471e",
};

export interface IMyCollection {
  id: string;
  name: string;
  collection: string;
}

export const useGetMyCollections = (account: string | null | undefined) => {
  const [collections, setCollections] = useState<IMyCollection[]>([
    CentherNativeCollection,
  ]);

  useEffect(() => {
    const fetchMyCollections = async (account: string) => {
      const client = new ApolloClient({
        uri: SUBGRAPH_URL,
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
        setCollections([CentherNativeCollection, ..._collections]);
      }
    };

    if (account) {
      fetchMyCollections(account);
    }
  }, [account]);
  return collections;
};
