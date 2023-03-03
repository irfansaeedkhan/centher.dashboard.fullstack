import { SUBGRAPH_URL } from "@/web3/constants/common";
import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { QueryNames } from "../enum/query.names.enum";
import { QueryFactory } from "./queries";

export class ApolloProvider {
  private static _instance = new ApolloClient({
    uri: SUBGRAPH_URL,
    cache: new InMemoryCache(),
  });

  static async query(
    queryName: QueryNames,
    variables?: any
  ): Promise<ApolloQueryResult<any>> {
    const query = QueryFactory.getQuery(queryName);
    if (!query) {
      throw new Error(`Query not found for ${queryName}`);
    }
    const result = await this._instance.query({
      query: gql(query),
      variables,
      fetchPolicy: "cache-first",
    });

    return result;
  }
}
