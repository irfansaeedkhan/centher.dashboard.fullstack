import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { Collection } from "@/models/nft";
import { AppError } from "@/utils/app-error";
import { SUBGRAPH_URL } from "@/web3/constants/common";

const client = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

export const getCollections = async ({
  query,
  limit = 15,
  skip = 0,
}: {
  query: string;
  limit?: number;
  skip?: number;
}): Promise<Collection[]> => {
  try {
    const { data: result, error } = await client.query<{
      collections: Collection[];
    }>({
      query: gql(query),
      variables: {
        first: limit,
        skip: skip,
      },
      fetchPolicy: "cache-first",
    });

    if (result && !error) {
      return result.collections;
    } else {
      throw error;
    }
  } catch (error: any) {
    throw new AppError(error, "Can not load Collections", "getCollections");
  }
};
