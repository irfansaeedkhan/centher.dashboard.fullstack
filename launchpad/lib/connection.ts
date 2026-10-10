import { ApolloClient, InMemoryCache } from "@apollo/client";
import { customLog } from "@/utils/custom.log";
import { IApolloProvider } from "@/lib/chat/types";

export function getConnection(url: string): IApolloProvider | null {
  if (url?.length) {
    try {
      return new ApolloClient({
        uri: url,
        cache: new InMemoryCache(),
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
