import ws from "ws";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { customLog } from "@/utils/custom.log";
import { IApolloProvider } from "../types/apollo.provider";

export function getConnection(
  uri: string,
  token: string
): IApolloProvider | null {
  if (uri?.length) {
    try {
      return new ApolloClient({
        cache: new InMemoryCache(),
        link: new GraphQLWsLink(
          createClient({
            url: uri,
            connectionParams: {
              headers: {
                Authorization: "bearer " + token,
              },
            },
            webSocketImpl: typeof window == "undefined" ? ws : null,
          })
        ),
      });
    } catch (err) {
      customLog(
        ["development", "staging"],
        "cannot create graphQl connection, please check configuration. ",
        err instanceof Error ? err.message : err
      );
      return null;
    }
  } else throw new Error("Invalid GraphQL Url");
}
