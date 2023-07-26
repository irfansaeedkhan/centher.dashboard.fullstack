import { customLog } from "@/utils/custom.log";
import { QueryNames } from "../enums/query.names";
import { QueryFactory } from "../lib/query.factory";
import { IApolloProvider } from "../types/apollo.provider";
import { IConversation } from "../types/conversation";
import { IGetMessageFilters } from "../types/get.messages.filter";
import { IGetConversationsFilter } from "../types/gte.conversation.filters";
import { ISendMessage } from "../types/send.message";
import { ISendMessageResult } from "../types/send.message.result";
import { ConversationActionHandler } from "../types/conversation.action.handler";
import { IGetConversactionsActions } from "../types/get.conversations.actions";
import { IUserActivityCreate } from "../types/create.user.activity.param";
import { IConversationCreateParams } from "../types/create.conversation";
import { IMessageSubscriptionHander } from "../types/message.subscription.handler";
import { CentherLive } from "..";

export class ChatHandler {
  private static _messageObserver: any;
  private static _conversationObserver: any;
  private static _conversationsObserver: any;
  static async sendMessage(
    connection: IApolloProvider,
    message: ISendMessage
  ): Promise<ISendMessageResult> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.getUserConversationId);
      const result = await connection?.query({
        fetchPolicy: "no-cache",
        query,
        variables: { _eq: message.conversationId, _eq1: message.user },
      });

      const user_conversation_id = result?.data.user_conversations[0]?.id;

      if (user_conversation_id) {
        const query = QueryFactory.getQuery(QueryNames.sendMessage);
        await connection?.mutate({
          mutation: query,
          variables: {
            content: message.content,
            replied_to: message.repliedTo,
            user_conversation_id,
          },
        });

        await this.updateConversationLastUpdate(
          connection,
          message.conversationId
        );
      } else throw new Error("Cannot find user conversation id");
    } catch (error) {
      throw error;
    }
  }

  static async updateConversationLastUpdate(
    connection: IApolloProvider,
    id: string
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(
        QueryNames.updateConversationlatestUpdateTime
      );

      await connection?.mutate({
        mutation: query,
        variables: {
          _eq: id,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async getConversations(
    connection: IApolloProvider,
    filters: IGetConversationsFilter
  ): Promise<IConversation[]> {
    this.validateConnection(connection);
    const query = QueryFactory.getQuery(QueryNames.getConversations);
    const result = await connection?.query({
      query,
      variables: { _eq: filters.address },
    });
    return result?.data.conversations;
  }

  static async subToConversations(
    connection: IApolloProvider,
    filters: IGetConversactionsActions,
    handler: ConversationActionHandler,
    sdk: CentherLive
  ): Promise<void> {
    try {
      if (this._conversationsObserver) {
        return;
      }

      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.subToConversations);
      const result = await connection?.subscribe({
        query,
        variables: { _eq: filters.user },
      });

      this._conversationsObserver = result?.subscribe(async (data) => {
        const conversations = data.data.conversations;
        handler(sdk, conversations, filters.user);
      });
    } catch (error) {
      customLog(
        ["development", "staging"],
        "Error in sub conversation actions. ",
        error
      );
    }
  }

  static async seenMessage(
    connection: IApolloProvider,
    input: IUserActivityCreate
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      const promises = input.message_id.map((e) => {
        return this.createMessageSeenActivity(
          connection,
          e,
          input.user_address as string
        );
      });

      await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  }

  static async createNewPrivateConversation(
    connection: IApolloProvider,
    input: IConversationCreateParams
  ): Promise<string> {
    try {
      this.validateConnection(connection);
      const currentConversationId = await this.findPrivateChatByParticipants(
        connection,
        input.targetUser,
        input.user as string
      );

      if (currentConversationId) {
        return currentConversationId;
      }

      const query = QueryFactory.getQuery(QueryNames.createNewPrivateChat);
      const result = await connection?.mutate({
        mutation: query,

        variables: {
          user_address: input.user,
          created_at: new Date(),
        },
      });

      const conversationid =
        result?.data?.insert_conversations?.returning[0]?.id;
      if (!conversationid) {
        throw new Error("cannot create conversation");
      }

      const secondQuery = QueryFactory.getQuery(
        QueryNames.createUserConversation
      );

      const secondCall = await connection?.mutate({
        mutation: secondQuery,
        variables: {
          conversation_id: conversationid,
          user_address: input.targetUser,
        },
      });

      if (!secondCall?.data?.insert_user_conversations_one?.id) {
        //TODO: delete conversation
        throw new Error("cannot create user conversation");
      }

      return conversationid;
    } catch (error) {
      throw error;
    }
  }

  static async findPrivateChatByParticipants(
    connection: IApolloProvider,
    userOne: string,
    userTwo: string
  ): Promise<string | null> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.findConversationByUsers);
      const result = await connection?.query({
        fetchPolicy: "no-cache",
        query,
        variables: {
          _eq: userOne,
          _eq1: userTwo,
        },
      });

      const conversationId =
        result?.data?.user_conversations[0]?.conversation_id;
      return conversationId ? conversationId : null;
    } catch (error) {
      throw new Error("Error in check duplicated conversation.");
    }
  }

  static async subToMessages(
    connection: IApolloProvider,
    filters: IGetMessageFilters,
    handler: IMessageSubscriptionHander,
    sdk: CentherLive
  ): Promise<void> {
    try {
      if (this._messageObserver) {
        try {
          this._messageObserver.unsubscribe();
          this._messageObserver = null;
        } catch (err) {
          throw err;
        }
      }

      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.subscribeToMessages);
      const subClient = await connection?.subscribe({
        query,
        variables: {
          _eq: filters.conversationId,
          limit: filters.limit,
          offset: filters.offset,
        },
      });

      this._messageObserver = subClient?.subscribe(async (data) => {
        const messages = data.data.messages;
        handler(sdk, messages);
      });
    } catch (error) {
      throw error;
    }
  }

  static async subToConversationDetails(
    connection: IApolloProvider,
    conversationId: string,
    user: string,
    handler: (arg: any) => void
  ): Promise<void> {
    try {
      if (this._conversationObserver) {
        try {
          this._conversationObserver.unsubscribe();
          this._conversationObserver = null;
        } catch (err) {
          throw err;
        }
      }

      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.subToAConversation);
      const subClient = connection?.subscribe({
        query,
        variables: {
          _eq: conversationId,
        },
      });

      this._conversationObserver = subClient?.subscribe(async (data) => {
        const conversation = data.data.conversations[0];
        handler(conversation);
      });
    } catch (error) {}
  }

  static async updateIsTyping(
    connection: IApolloProvider,
    user: string,
    conversationId: string,
    isTyping: boolean
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.updateIsTyping);
      await connection?.mutate({
        mutation: query,
        variables: {
          is_typing: isTyping,
          _eq: conversationId,
          _ilike: user,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async removeMessage(
    connection: IApolloProvider,
    msgId: string
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.removeMessage);
      await connection?.mutate({
        mutation: query,
        variables: {
          _eq: msgId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async getConversationUsers(
    connection: IApolloProvider,
    conversationId: string
  ): Promise<string[]> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.getChatPaticipants);
      const result = await connection?.query({
        fetchPolicy: "no-cache",
        query,
        variables: {
          _eq: conversationId,
        },
      });

      return result?.data.conversations[0].user_conversations.map((e: any) =>
        e.user_address.toLowerCase()
      );
    } catch (error) {
      throw error;
    }
  }

  static async editMessage(
    connection: IApolloProvider,
    msgId: string,
    content: string
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.editMessage);
      await connection?.mutate({
        mutation: query,
        variables: {
          _eq: msgId,
          content,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async addEmojiToMessage(
    connection: IApolloProvider,
    msgId: string,
    code: string,
    user: string
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      // check if exist
      const currentEmoji = await this.checkUserAlreadySetEmojiForMessage(
        connection,
        msgId,
        user
      );

      if (currentEmoji) {
        if (currentEmoji.code == code) {
          await this.removeEmoji(connection, msgId, code, user);
        } else {
          await this.updateEmoji(
            connection,
            msgId,
            currentEmoji.code,
            user,
            code
          );
        }
      } else {
        const query = QueryFactory.getQuery(QueryNames.addEmojiToMessage);
        await connection?.mutate({
          mutation: query,
          variables: {
            message_id: msgId,
            user_address: user,
            code: code,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  static async removeEmoji(
    connection: IApolloProvider,
    msgId: string,
    code: string,
    user: string
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.deleteMessageEmoji);
      await connection?.mutate({
        mutation: query,
        variables: {
          _eq1: msgId,
          _ilike: user,
          _eq: code,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async checkUserAlreadySetEmojiForMessage(
    connection: IApolloProvider,
    msgId: string,
    user: string
  ): Promise<{ id: string; code: string } | null> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(
        QueryNames.checkUserAlreadySetEmojiForMessage
      );
      const result = await connection?.mutate({
        mutation: query,
        variables: {
          _eq: msgId,
          _ilike: user,
        },
      });
      return result?.data.activities[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateEmoji(
    connection: IApolloProvider,
    msgId: string,
    code: string,
    user: string,
    newCode: string
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.updateMessageEmoji);
      await connection?.mutate({
        mutation: query,
        variables: {
          _eq: msgId,
          _ilike: user,
          _eq2: code,
          code: newCode,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async handleFetchMessages(
    connection: IApolloProvider,
    userAddress: string,
    conversationId: string
  ): Promise<void> {
    try {
      let messagesToAddFetch: string[] = [];
      const lastFetchedMessage = await this.getLastFetchedMessage(
        connection,
        userAddress,
        conversationId
      );

      if (lastFetchedMessage) {
        messagesToAddFetch =
          await this.getMessagesToCreateFetchedActivitySortedByDate(
            connection,
            userAddress,
            conversationId,
            new Date(+new Date(lastFetchedMessage) + 1) // add one milisec
          );
      } else {
        messagesToAddFetch =
          await this.getAllConversationsMessagesTOAddFetchedActivity(
            connection,
            userAddress,
            conversationId
          );
      }

      if (!messagesToAddFetch?.length) {
        return;
      }

      await this.fetchMessage(connection, {
        user_address: userAddress,
        message_id: messagesToAddFetch,
      });
    } catch (error) {
      throw error;
    }
  }

  static async deleteConversation(
    connection: IApolloProvider,
    conversationId: string
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.deleteConversation);
      await connection?.mutate({
        mutation: query,
        variables: {
          _eq: conversationId,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async pinConversation(
    connection: IApolloProvider,
    conversationId: string,
    userAddress: string
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.pinConversation);
      await connection?.mutate({
        mutation: query,
        variables: {
          _eq: conversationId,
          _ilike: userAddress,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async unpinConversation(
    connection: IApolloProvider,
    conversationId: string,
    userAddress: string
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.unPinConversation);
      await connection?.mutate({
        mutation: query,
        variables: {
          _eq: conversationId,
          _ilike: userAddress,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  private static async fetchMessage(
    connection: IApolloProvider,
    input: IUserActivityCreate
  ): Promise<void> {
    try {
      this.validateConnection(connection);
      const promises = input.message_id.map((e) => {
        return this.createMessageFetchActivity(
          connection,
          e,
          input.user_address as string
        );
      });

      await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  }

  private static async getLastFetchedMessage(
    connection: IApolloProvider,
    userAddress: string,
    conversationId: string
  ): Promise<string | null> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(QueryNames.getlastFetchedMessage);
      const result = await connection?.query({
        fetchPolicy: "no-cache",
        query,
        variables: {
          _ilike: userAddress,
          _eq: conversationId,
        },
        fetchPolicy: "no-cache",
      });

      return result?.data.users[0].activities[0]?.message?.created_at;
    } catch (error) {
      throw error;
    }
  }

  private static async getAllConversationsMessagesTOAddFetchedActivity(
    connection: IApolloProvider,
    userAddress: string,
    conversationId: string
  ): Promise<string[]> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(
        QueryNames.getAllConversationMessageToFetch
      );
      const result = await connection?.query({
        fetchPolicy: "no-cache",
        query,
        variables: {
          _nilike: userAddress,
          _eq: conversationId,
        },
        fetchPolicy: "no-cache",
      });

      return result?.data.messages.map((e: any) => e.id);
    } catch (error) {
      throw error;
    }
  }

  private static async getMessagesToCreateFetchedActivitySortedByDate(
    connection: IApolloProvider,
    userAddress: string,
    conversationId: string,
    DateTime: Date
  ): Promise<string[]> {
    try {
      this.validateConnection(connection);
      const query = QueryFactory.getQuery(
        QueryNames.getMessagesToCreateFetchedActivity
      );
      const result = await connection?.query({
        fetchPolicy: "no-cache",
        query,
        variables: {
          _gt: DateTime,
          _eq: conversationId,
          _nilike: userAddress,
        },
        fetchPolicy: "no-cache",
      });

      return result?.data.messages.map((e: any) => e.id);
    } catch (error) {
      throw error;
    }
  }

  private static validateConnection(connection: IApolloProvider): void {
    if (!connection) {
      throw new Error("Invalid Apollo Connection");
    }
  }

  private static async isActivityExist(
    connection: IApolloProvider,
    msgId: string,
    user: string,
    type: string
  ): Promise<boolean> {
    try {
      const query = QueryFactory.getQuery(QueryNames.checkActivityExist);
      const result = await connection?.query({
        fetchPolicy: "no-cache",
        query,
        variables: {
          _ilike: user,
          _message_id: msgId,
          _type: type,
        },
        fetchPolicy: "no-cache",
      });

      return result?.data.activities.length > 0;
    } catch (error) {
      throw error;
    }
  }

  private static async createMessageSeenActivity(
    connection: IApolloProvider,
    msgId: string,
    user: string
  ): Promise<any> {
    const isExist = await this.isActivityExist(connection, msgId, user, "seen");
    if (!isExist) {
      const query = QueryFactory.getQuery(QueryNames.seenMessage);
      return connection?.mutate({
        mutation: query,
        variables: {
          user_address: user,
          message_id: msgId,
        },
      });
    } else return null;
  }

  private static async createMessageFetchActivity(
    connection: IApolloProvider,
    msgId: string,
    user: string
  ): Promise<any> {
    const isExist = await this.isActivityExist(
      connection,
      msgId,
      user,
      "fetched"
    );

    if (!isExist) {
      const query = QueryFactory.getQuery(QueryNames.fetchedMessage);
      return connection?.mutate({
        mutation: query,
        variables: {
          user_address: user,
          message_id: msgId,
        },
      });
    } else return null;
  }
}
