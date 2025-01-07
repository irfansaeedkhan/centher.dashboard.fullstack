import { ApolloGraphQlUriEnum } from "../enum/graphql-resource-type.enum";
import { GraphQLResourcesUrl, GraphQlUrlRepository } from "../types/Graphql";

const urlRepo: GraphQlUrlRepository = {
  mainServer: (mode: ApolloGraphQlUriEnum) => {
    return process.env.NEXT_PUBLIC_GQL_URL_MAIN || "";
  },
  subgraphServer: () => {
    return process.env.NEXT_PUBLIC_GQL_URL_SUBGRAPH || "";
  },
  blockchainServer: (mode: ApolloGraphQlUriEnum) => {
    return process.env.NEXT_PUBLIC_GQL_URL_BLOCKCHAIN || "";
  },
};

export function getApolloUrl(
  server: GraphQLResourcesUrl,
  option?: any
): string {
  return urlRepo[server](option);
}
