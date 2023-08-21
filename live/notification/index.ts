import { customLog } from "@/utils/custom.log";
import { QueryNames } from "../enums/query.names";
import { QueryFactory } from "../lib/query.factory";
import { IApolloProvider } from "../types/apollo.provider";
import { Notify } from "../types/notification";
import { NotificationDelegate } from "../types/notification.handler";

export class NotificationHandler {
  private static _unreadNotificationsObserver: any;
  static async listenForNewNotification(
    connection: IApolloProvider,
    address: string,
    handler: NotificationDelegate
  ): Promise<void> {
    const _self = this;
    try {
      const query = QueryFactory.getQuery(QueryNames.getNewNotifications);
      const result = await connection?.subscribe({
        query,
        variables: { _eq: address },
      });

      result?.subscribe(async (data) => {
        const notifications = data.data.notifications;
        const promises = notifications
          .filter((e: Notify) => !e.is_fetched)
          .map((e: Notify) => _self.updateFetch(connection, e.id));
        if (promises?.length) {
          await Promise.all(promises);
        }

        handler(notifications);
      });
    } catch (error) {
      customLog(
        ["development", "staging"],
        "Error in sub notification. ",
        error
      );
    }
  }
  static async updateFetch(
    connection: IApolloProvider,
    notificationId: string
  ): Promise<void> {
    try {
      const query = QueryFactory.getQuery(QueryNames.updateNotificationFetch);
      await connection?.mutate({
        mutation: query,
        variables: { _eq: notificationId },
      });
    } catch (error) {
      customLog(["development", "staging"], "Error in update fetch. ", error);
    }
  }
  static async updateSeen(
    connection: IApolloProvider,
    notificationId: string
  ): Promise<void> {
    try {
      const query = QueryFactory.getQuery(QueryNames.updateLatestSeen);
      await connection?.mutate({
        mutation: query,
        variables: { _eq: notificationId },
      });
    } catch (error) {
      customLog(["development", "staging"], "Error in update seen. ", error);
    }
  }
  static async getNotificationsHistory(
    connection: IApolloProvider,
    address: string,
    limit: number,
    offset: number
  ): Promise<Notify[]> {
    try {
      const query = QueryFactory.getQuery(QueryNames.getNotificationsHistory);
      const result = await connection?.query({
        query,
        variables: { _eq: address, limit, offset },
      });
      return result?.data.notifications;
    } catch (error) {
      customLog(
        ["development", "staging"],
        "Error in get notification history. ",
        error
      );
      throw error;
    }
  }
  static async subscribeToUnreadMessages(
    connection: IApolloProvider,
    handler: (arg: any) => void,
    userAddress: string
  ): Promise<any> {
    try {
      if (this._unreadNotificationsObserver) {
        return;
      }

      const query = QueryFactory.getQuery(
        QueryNames.getUnreadNotificationsCount
      );

      const subClient = await connection?.subscribe({
        query,
        variables: {
          _ilike: userAddress,
        },
      });

      this._unreadNotificationsObserver = subClient?.subscribe(async (data) => {
        const notifications = data.data.notifications;
        handler(notifications);
      });
    } catch (error) {
      console.log("error in get unread notifications count. ", error);
    }
  }
}
