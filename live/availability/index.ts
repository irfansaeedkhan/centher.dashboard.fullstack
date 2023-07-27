import { customLog } from "@/utils/custom.log";
import { QueryNames } from "../enums/query.names";
import { QueryFactory } from "../lib/query.factory";
import { IApolloProvider } from "../types/apollo.provider";

export class AvailabilityHandler {
  static runAvailabilityWatchDog(
    connection: IApolloProvider,
    address: string,
    interval: number
  ): void {
    const _self = this;
    setInterval(() => {
      _self.setLatestSeen(connection, address).then();
    }, interval);
  }
  static async handleUserEntity(
    connection: IApolloProvider,
    userAddress: string
  ): Promise<void> {
    try {
      const query = QueryFactory.getQuery(QueryNames.userExists);
      const result = await connection?.query({
        query,
        variables: {
          _ilike: userAddress,
        },
      });

      if (result && result.data.users.length > 0) {
        return;
      }

      const mutation = QueryFactory.getQuery(QueryNames.createUser);
      await connection?.mutate({
        mutation,
        variables: {
          address: userAddress.toLowerCase(),
        },
      });
    } catch (error) {
      throw error;
    }
  }
  private static async setLatestSeen(
    connection: IApolloProvider,
    address: string
  ): Promise<void> {
    try {
      const query = QueryFactory.getQuery(QueryNames.updateLatestSeen);
      await connection?.mutate({
        mutation: query,
        variables: {
          _eq: address,
          latest_update: new Date(),
        },
      });
    } catch (error) {
      customLog(
        ["development", "staging"],
        "Error in update latest seen. ",
        error
      );
    }
  }
}
