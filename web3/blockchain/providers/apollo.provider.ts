import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { BlockchainConfig } from "../config";
import { QueryNames } from "../enum/query.names.enum";
import { QueryFactory } from "./queries";

export class ApolloProvider {
  private static _instance: ApolloClient<NormalizedCacheObject>;
  static init() {
    if (!this._instance) {
      this._instance = new ApolloClient({
        uri: BlockchainConfig.subgraphUrl,
        cache: new InMemoryCache(),
      });
    }
  }
  static async query(
    queryName: QueryNames,
    variables?: any,
    cacheFirst = true
  ): Promise<ApolloQueryResult<any>> {
    const query = QueryFactory.getQuery(queryName);
    if (!query) {
      throw new Error(`Query not found for ${queryName}`);
    }

    this.init();

    const result = await this._instance.query({
      query: gql(query),
      variables,
      fetchPolicy: cacheFirst ? "cache-first" : "no-cache",
    });

    return result;
  }
}
