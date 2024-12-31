export enum GraphQLResourcesUrl {
  mainServer = "mainServer",
  subgraphServer = "subgraphServer",
  blockchainServer = "blockchainServer",
}

export type GraphQlUrlRepository = Record<
  keyof typeof GraphQLResourcesUrl,
  (arg: any) => string
>;
