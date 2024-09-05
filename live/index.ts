import { customLog } from "@/utils/custom.log";
import { getConnection } from "./lib/connection";
import { IApolloProvider } from "./types/apollo.provider";
import { IProductLiveOptions } from "./types/product.live.options";
import { IConversation } from "./types/conversation";
import { IGetMessageFilters } from "./types/get.messages.filter";
import { IGetConversationsFilter } from "./types/gte.conversation.filters";
import { ISendMessage } from "./types/send.message";
import { ISendMessageResult } from "./types/send.message.result";
import { Notify } from "./types/notification";
import { ConversationActionHandler } from "./types/conversation.action.handler";
import { IGetConversactionsActions } from "./types/get.conversations.actions";
import { IUserActivityCreate } from "./types/create.user.activity.param";
import { IConversationCreateParams } from "./types/create.conversation";
import { IMessageSubscriptionHander } from "./types/message.subscription.handler";
import { NotificationHandler } from "./notification";
import { AvailabilityHandler } from "./availability";
import { ChatHandler } from "./chat";

export class ProductLive {
  private _connection: IApolloProvider = null;
  private _address: string = "";
  constructor(options: IProductLiveOptions) {
    try {
      this._address = options.userAddress.toLowerCase();
      this.initConnection(options.url, options.userToken);
      this.registerListeners(options);
      if (!this._connection) {
        return;
      }

      this.setupUser(this._address).catch();
      AvailabilityHandler.runAvailabilityWatchDog(
        this._connection,
        this._address,
        options.ackInterval
      );
    } catch (error) {
      customLog(["development", "staging"], error);
    }
  }

  async registerListeners(options: IProductLiveOptions): Promise<void> {
    NotificationHandler.listenForNewNotification(
      this._connection,
      this._address,
      options.eventHandlers.OnNotificationReceived
    );
  }

  async sendMessage(message: ISendMessage): Promise<ISendMessageResult> {
    return ChatHandler.sendMessage(this._connection, message);
  }

  async getConversations(
    filters: IGetConversationsFilter
  ): Promise<IConversation[]> {
    if (!filters.address) {
      filters.address = this._address;
    }

    return ChatHandler.getConversations(this._connection, filters);
  }

  async subToConversations(
    sdk: ProductLive,
    handler: ConversationActionHandler,
    filters?: IGetConversactionsActions
  ): Promise<void> {
    if (!filters) {
      filters = { user: this._address };
    }
    return ChatHandler.subToConversations(
      this._connection,
      filters,
      handler,
      sdk
    );
  }

  async subToMessages(
    filters: IGetMessageFilters,
    handler: IMessageSubscriptionHander,
    sdk: ProductLive
  ): Promise<void> {
    return ChatHandler.subToMessages(this._connection, filters, handler, sdk);
  }

  async notificationSeen(notifyId: string): Promise<void> {
    return NotificationHandler.updateSeen(this._connection, notifyId);
  }

  async getNotificationList(
    address: string,
    limit = 10,
    offset = 0
  ): Promise<Notify[]> {
    return NotificationHandler.getNotificationsHistory(
      this._connection,
      address,
      limit,
      offset
    );
  }

  async seenMessage(input: IUserActivityCreate): Promise<void> {
    if (!input.user_address) {
      input.user_address = this._address;
    }
    return ChatHandler.seenMessage(this._connection, input);
  }

  async handleFetchMessages(conversationId: string): Promise<void> {
    return ChatHandler.handleFetchMessages(
      this._connection,
      this._address,
      conversationId
    );
  }

  async createNewPrivateConversation(
    input: IConversationCreateParams
  ): Promise<string> {
    if (!input.user) {
      input.user = this._address;
    }

    await this.setupUser(input.targetUser);
    return ChatHandler.createNewPrivateConversation(this._connection, input);
  }

  async subToConversationDetails(
    conversationId: string,
    handler: (args: any) => void
  ): Promise<void> {
    ChatHandler.subToConversationDetails(
      this._connection,
      conversationId,
      this._address,
      handler
    );
  }

  async updateIsTyping(
    conversationId: string,
    isTyping: boolean
  ): Promise<void> {
    return ChatHandler.updateIsTyping(
      this._connection,
      this._address,
      conversationId,
      isTyping
    );
  }

  async removeMessage(msgId: string): Promise<void> {
    await ChatHandler.removeMessage(this._connection, msgId);
  }

  async editMessage(msgId: string, content: string): Promise<void> {
    return ChatHandler.editMessage(this._connection, msgId, content);
  }

  async getConversationUsers(conversationId: string): Promise<string[]> {
    return ChatHandler.getConversationUsers(this._connection, conversationId);
  }

  async addEmojiToMessage(msgId: string, code: string): Promise<void> {
    return ChatHandler.addEmojiToMessage(
      this._connection,
      msgId,
      code,
      this._address
    );
  }

  async deleteConversation(conversationId: string): Promise<void> {
    return ChatHandler.deleteConversation(this._connection, conversationId);
  }

  async pinConversation(conversationId: string): Promise<void> {
    return ChatHandler.pinConversation(
      this._connection,
      conversationId,
      this._address
    );
  }

  async unpinConversation(conversationId: string): Promise<void> {
    return ChatHandler.unpinConversation(
      this._connection,
      conversationId,
      this._address
    );
  }

  async subscribeToUnreadNotifications(
    handler: (args: any) => void
  ): Promise<void> {
    await NotificationHandler.subscribeToUnreadMessages(
      this._connection,
      handler,
      this._address
    );
  }

  private initConnection(url: string, token: string): void {
    this._connection = getConnection(url, token);
  }

  private async setupUser(address: string): Promise<void> {
    await AvailabilityHandler.handleUserEntity(this._connection, address);
  }
}
