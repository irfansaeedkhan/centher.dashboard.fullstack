import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { Collection } from "@/models/nft";
import { AppError } from "@/utils/app-error";
import { collectionsQuery } from "@/subgraph/querys";
import { SUBGRAPH_URL } from "@/web3/constants/common";

const MAX_COLLECTIONS = 10;

export const getHotCollections = async (): Promise<Collection[]> => {
  try {
    const client = new ApolloClient({
      uri: SUBGRAPH_URL,
      cache: new InMemoryCache(),
    });

    const { data: result, error } = await client.query<{
      collections: Collection[];
    }>({
      query: gql(collectionsQuery),
      variables: {
        first: MAX_COLLECTIONS,
        skip: 0,
      },
      fetchPolicy: "cache-first",
    });

    if (result && !error) {
      return result.collections;
    } else {
      throw error;
    }
  } catch (error: any) {
    throw new AppError(
      error,
      "Can not load Hot Collections",
      "getHotCollections"
    );
  }
};
