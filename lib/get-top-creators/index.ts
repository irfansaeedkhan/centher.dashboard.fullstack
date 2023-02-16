import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { topCreatorsQuery } from "@/subgraph/querys";
import { SUBGRAPH_URL } from "@/web3/constants/common";
import { TopCreator } from "@/models/top-creator";
import { AppError } from "@/utils/app-error";

const MAX_TOP_CREATORS = 10;

export const getTopCreators = async (): Promise<TopCreator[]> => {
  try {
    const client = new ApolloClient({
      uri: SUBGRAPH_URL,
      cache: new InMemoryCache(),
    });

    const { data: result, error } = await client.query<{ users: TopCreator[] }>(
      {
        query: gql(topCreatorsQuery),
        variables: {
          first: MAX_TOP_CREATORS,
          skip: 0,
        },
        fetchPolicy: "cache-first",
      }
    );

    if (result && !error) {
      return result.users;
    } else {
      throw error;
    }
  } catch (error: any) {
    throw new AppError(error, "Can not load Top Creators", "getTopCreators");
  }
};
