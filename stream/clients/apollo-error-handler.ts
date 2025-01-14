import { ErrorResponse } from "@apollo/client/link/error";

export class ApolloGraphQLErrorHandler {
  gqlErrorHandler = async (
    graphQLErrors: ErrorResponse["graphQLErrors"],
    operation: ErrorResponse["operation"]
  ) => {
    const messages: string[] = [];
    graphQLErrors?.forEach(async (error) => {
      switch (error.extensions.code) {
        case 404:
        case "not-found":
          //TODO: handle situation
          break;
        case 401:
        case 403:
        case "access-denied":
          //TODO: handle situation
          break;
        case 500:
        case 502:
        case 503:
          //TODO: handle situation
          break;
        case 429:
          //TODO: handle situation
          break;
        case "constraint-violation":
        case "permission-error":
          break;
        default:
          if (error.extensions.message) {
            messages.push(error.message);
          }

          break;
      }
    });

    messages.forEach((message) => {
      //TODO: handle situation(toast)
    });
  };

  networkErrorHandler = async (
    networkError: ErrorResponse["networkError"],
    operation: ErrorResponse["operation"]
  ) => {
    if (
      networkError?.name === "TypeError" &&
      networkError?.message === "Failed to fetch" &&
      networkError?.cause == null
    ) {
      //TODO: handle situation
    } else {
      if (networkError?.name === "Error") {
        // Internet connection must be handle
      } else {
        if (networkError?.message?.includes("404")) {
          //TODO: handle situation
        } else {
          //TODO: handle situation
        }
      }
    }
  };
}
