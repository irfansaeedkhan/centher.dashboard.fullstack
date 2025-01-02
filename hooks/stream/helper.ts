import { ApolloService } from "@/stream/clients/apollo-client";
import { GraphQLResourcesUrl } from "@/stream/types/Graphql";
import { ApolloClient } from "@apollo/client";
import { ICentalkBroadcast } from "./cen-talk";
import { BroadcastPreviewDto } from "./dto/broadcast-preview.dto";
import { areStringsEquals } from "@/stream/utils/string.utils";

export class StreamHooksHelper {
  apolloClient: ApolloClient<unknown> | undefined;
  apolloService: ApolloService | undefined;

  get apolloServiceInstance(): ApolloService {
    if (!this.apolloService) {
      this.apolloService = new ApolloService();
    }
    return this.apolloService;
  }

  async getApolloClientInstance(): Promise<ApolloClient<unknown>> {
    if (!this.apolloClient) {
      const client = await this.apolloServiceInstance.getApolloClient(
        GraphQLResourcesUrl.mainServer
      );

      this.apolloClient = client.client;
    }

    return this.apolloClient;
  }

  // getApolloClient = async (): Promise<ApolloClient<unknown>> => {
  //   if (this.apolloInstance) {
  //     return this.apolloInstance;
  //   }
  //   const client = await this.initApolloClient();
  //   this.apolloInstance = client;
  //   return client;
  // };

  // private async initApolloClient(): Promise<ApolloClient<unknown>> {
  //   const { client } = await this.apolloClient.getApolloClient(
  //     GraphQLResourcesUrl.mainServer
  //   );
  //   return client;
  // }
}
