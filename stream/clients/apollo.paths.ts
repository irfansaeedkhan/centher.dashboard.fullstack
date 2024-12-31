import { ApolloGraphQlUriEnum } from "../enum/graphql-resource-type.enum";
import { GraphQLResourcesUrl, GraphQlUrlRepository } from "../types/Graphql";

const urlRepo: GraphQlUrlRepository = {
  mainServer: (mode: ApolloGraphQlUriEnum) => {
    //TODO: return address from env
    return "";
  },
  subgraphServer: () => {
    //TODO: return address from env
    return "";
  },
  blockchainServer: (mode: ApolloGraphQlUriEnum) => {
    //TODO: return address from env
    return "";
  },
};

export function getApolloUrl(
  server: GraphQLResourcesUrl,
  option?: any
): string {
  return urlRepo[server](option);
}
