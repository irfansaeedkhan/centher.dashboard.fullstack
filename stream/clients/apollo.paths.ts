import { ApolloGraphQlUriEnum } from "../enum/graphql-resource-type.enum";
import { GraphQLResourcesUrl, GraphQlUrlRepository } from "../types/Graphql";

const urlRepo: GraphQlUrlRepository = {
  mainServer: (mode: ApolloGraphQlUriEnum) => {
    //TODO: return address from env
    return "https://stag-kub-sig-live-v1.centher.io/v1/graphql";
  },
  subgraphServer: () => {
    //TODO: return address from env
    return "https://stag-kub-sig-live-v1.centher.io/v1/graphql";
  },
  blockchainServer: (mode: ApolloGraphQlUriEnum) => {
    //TODO: return address from env
    return "https://stag-kub-sig-live-v1.centher.io/v1/graphql";
  },
};

export function getApolloUrl(
  server: GraphQLResourcesUrl,
  option?: any
): string {
  return urlRepo[server](option);
}
