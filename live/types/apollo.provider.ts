import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export type IApolloProvider = ApolloClient<NormalizedCacheObject> | null;
