import {
  ApolloClientOptions,
  DefaultOptions,
  InMemoryCache,
  split,
  createHttpLink,
  ApolloClient,
} from "@apollo/client/core";
import { RetryLink } from "@apollo/client/link/retry";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { onError } from "@apollo/client/link/error";
import { ApolloGraphQLErrorHandler } from "./apollo-error-handler";
import { getApolloUrl } from "./apollo.paths";
import { GraphQLResourcesUrl } from "../types/Graphql";
import { ApolloGraphQlUriEnum } from "../enum/graphql-resource-type.enum";
import { getAuthTokens } from "@/lib/auth/auth-tokens-storage";

export class ApolloService {
  protected defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  };

  protected errorHandler!: ApolloGraphQLErrorHandler;
  async getApolloClient(resource: GraphQLResourcesUrl) {
    const options = await this.getApolloClientOptions(resource);
    const client = new ApolloClient(options);

    return { client };
  }

  private getQuasarModeOptions() {
    let result = {};
    switch (process.env.MODE) {
      case "spa":
        result = {};
        break;
      case "ssr":
        result = {};
        break;
      case "pwa":
        result = {};
        break;
      case "bex":
        result = {};
        break;
      case "cordova":
        result = {};
        break;
      case "capacitor":
        result = {};
        break;
      case "electron":
        result = {};
        break;
    }

    return result;
  }
  private getGqlUri(
    type: ApolloGraphQlUriEnum,
    resource: GraphQLResourcesUrl
  ): string {
    return getApolloUrl(resource, type);
  }
  private getRetryLink() {
    const options: RetryLink.Options = {
      delay: {
        initial: 500,
        max: Infinity,
        jitter: true,
      },
      attempts: {
        max: 5,
        retryIf: (error, operation) =>
          !!error && operation.operationName === "",
      },
    };
    const retryLink = new RetryLink(options);

    return retryLink;
  }
  private async getSplitLink(resource: GraphQLResourcesUrl) {
    return split(
      ({ query }) => {
        const definition = getMainDefinition(query);

        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      await this.getWSLink(resource),
      await this.getHttpLink(resource)
    );
  }
  private async getHttpLink(resource: GraphQLResourcesUrl) {
    const token = await this.getToken();
    const uri = this.getGqlUri(ApolloGraphQlUriEnum.HTTP, resource);

    if (token?.length > 0) {
      return createHttpLink({
        uri: uri,
        headers:
          token != null
            ? {
                Authorization: `Bearer ${token}`,
              }
            : { "X-Hasura-Role": "user" },
      });
    } else {
      return createHttpLink({
        uri: uri,
      });
    }
  }
  private async getWSLink(resource: GraphQLResourcesUrl) {
    let activeSocket: any = null;
    let timedOut: any = null;
    const token = await this.getToken();

    // FIXME: manage token
    return new GraphQLWsLink(
      createClient({
        url: this.getGqlUri(ApolloGraphQlUriEnum.WS, resource),
        keepAlive: 10000,
        connectionParams: {
          headers:
            token != null
              ? {
                  Authorization:
                    token.length > 0 ? `Bearer ${token}` : undefined,
                }
              : { "X-Hasura-Role": "user" },
        },

        // TODO: Remove
        // connectionParams: {
        //   headers: {
        //     // "X-Hasura-Role": "user",
        //     "x-hasura-admin-secret":
        //       "wenfhrebgyuberjkvqpsxmqnxuyerbytfcvvzvgwvdewf",
        //   },
        // },
        on: {
          connected: (socket) => (activeSocket = socket),
          ping: (received) => {
            if (!received) {
              timedOut = setTimeout(() => {
                if (activeSocket?.readyState === WebSocket.OPEN) {
                  activeSocket?.close(4408, "Request Timeout");
                }
              }, 5000);
            }
          },
          pong: (received) => {
            if (received) clearTimeout(timedOut);
          },
        },
      })
    );
  }
  private getErrorLink() {
    return onError(({ graphQLErrors, networkError, operation }) => {
      this.errorHandler = new ApolloGraphQLErrorHandler();
      if (graphQLErrors) {
        this.errorHandler.gqlErrorHandler(graphQLErrors, operation);
      }

      if (networkError) {
        this.errorHandler.networkErrorHandler(networkError, operation);
      }
    });
  }
  private async getApolloClientOptions(resource: GraphQLResourcesUrl) {
    if (resource !== GraphQLResourcesUrl.subgraphServer) {
      const link = await this.getSplitLink(resource);

      return Object.assign(
        {
          link: this.getRetryLink().concat(this.getErrorLink().concat(link)),
          cache: new InMemoryCache({
            typePolicies: {
              Subscription: {
                fields: {
                  broadcast: {
                    merge(existing, incoming) {
                      return incoming;
                    },
                  },
                  messages: {
                    merge(existing, incoming) {
                      return incoming;
                    },
                  },
                  user_broadcast: {
                    merge(existing, incoming) {
                      return incoming;
                    },
                  },
                },
              },
            },
            addTypename: false,
          }),
          name: "apolloClient",
          defaultOptions: this.defaultOptions,
        },
        this.getQuasarModeOptions()
      ) as ApolloClientOptions<unknown>;
    } else {
      return { uri: getApolloUrl(resource), cache: new InMemoryCache() };
    }
  }
  private async getToken(): Promise<string> {
    return new Promise((res, rej) => {
      try {
        const tokens = getAuthTokens();
        if (tokens?.access_token) {
          res(tokens.access_token);
        } else {
          rej(new Error("Access token is undefined"));
        }
      } catch (error) {
        rej(error);
      }
    });
  }
}
