import { Socket } from "socket.io-client";
import { SocketClientService } from "./clients/socket-client";
import { IEventBus } from "./types/event-bus";
import { EventNameEnum } from "./enum/event-name.enum";
import { ApolloService } from "./clients/apollo-client";
import { GraphQLResourcesUrl } from "./types/Graphql";
import { ApolloClient, ObservableSubscription } from "@apollo/client";
import { CreateBroadcastDto, StreamAgentType } from "./types/Broadcast";
import { AmaAgent } from "./stream-workers/ama";
import { LiveAgent } from "./stream-workers/live";
import { BroadcastTypeEnum } from "./enum/stream-type.enum";
import { StreamSubscriptionEnum } from "./enum/graphql-subscription-keys.enum";

export class StreamService<T extends IEventBus> {
  protected _socketInstance!: Socket | null;
  protected _apolloInstance!: ApolloClient<unknown>;
  protected _eventEmitter!: T;
  protected _peerInstance!: StreamAgentType;

  protected _subscriptionAgents: {
    [key: string]: ObservableSubscription | null;
  } = {
    SUBSCRIBE_ALL: null,
    SUBSCRIBE_SPEAKERS: null,
    SUBSCRIBE_MESSAGE: null,
    SUBSCRIBE_CURRENT_USER: null,
    SUBSCRIBE_HAS_TALK_REQUEST_USERS: null,
  };

  constructor(eventBus: T) {
    this._eventEmitter = eventBus;
  }

  async createStream(
    input: CreateBroadcastDto,
    userId: string
  ): Promise<StreamAgentType> {
    try {
      if (this._socketInstance) {
        throw new Error("another stream is open");
      }

      await this.initSocketClient();

      if (!this._socketInstance) {
        throw new Error("socket instance not found");
      }

      if (input.type === BroadcastTypeEnum.AMA) {
        this._peerInstance = new AmaAgent(
          this._socketInstance,
          this._eventEmitter
        );
      } else {
        this._peerInstance = new LiveAgent(
          this._socketInstance,
          this._eventEmitter
        );
      }

      await this._peerInstance.createRoom(input, userId);

      return this._peerInstance;
    } catch (error) {
      throw error;
    }
  }

  async joinStream(
    broadcastId: string,
    type: BroadcastTypeEnum,
    userId: string
  ): Promise<StreamAgentType> {
    try {
      if (this._socketInstance) {
        throw new Error(
          `Cannot join to broadcast with id ${broadcastId}, another broadcast is open`
        );
      }

      await this.initSocketClient();

      if (!this._socketInstance) {
        throw new Error("socket instance not found");
      }

      if (type === BroadcastTypeEnum.AMA) {
        this._peerInstance = new AmaAgent(
          this._socketInstance,
          this._eventEmitter
        );
      } else {
        this._peerInstance = new LiveAgent(
          this._socketInstance,
          this._eventEmitter
        );
      }

      await this._peerInstance.joinRoom(broadcastId, userId);
      // await this.subscribeToCurrentUser(broadcastId);

      return this._peerInstance;
    } catch (error: any) {
      if (error?.data) {
        this._eventEmitter.emit(EventNameEnum.ON_NEED_STREAM_ACCESS, {
          data: error.data,
          showMemberShipAds: false,
        });
      }

      this._socketInstance?.close();
      this._socketInstance = null;
      this.closeSubscription(StreamSubscriptionEnum.SUBSCRIBE_MESSAGE);
      this.closeSubscription(StreamSubscriptionEnum.SUBSCRIBE_SPEAKERS);
      this.closeSubscription(StreamSubscriptionEnum.SUBSCRIBE_CURRENT_USER);
      this.closeSubscription(
        StreamSubscriptionEnum.SUBSCRIBE_HAS_TALK_REQUEST_USERS
      );
      this.closeSubscription(StreamSubscriptionEnum.SUBSCRIBE_CURRENT_STREAM);
      throw error;
    }
  }
  closeSubscription(key: StreamSubscriptionEnum) {
    if (this._subscriptionAgents[key]) {
      this._subscriptionAgents[key].unsubscribe();
      this._subscriptionAgents[key] = null;
    }
  }
  private async initSocketClient(): Promise<void> {
    const _ctx = this;

    return new Promise(async (resolve, reject) => {
      try {
        _ctx._socketInstance = await SocketClientService.build();
        _ctx._socketInstance.on("connection-accepted", () => {
          resolve();
        });

        _ctx._socketInstance.on("error", (err) => {
          this._eventEmitter.emit(EventNameEnum.ON_NEED_STREAM_ACCESS, err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  private async initApolloClient(): Promise<void> {
    const apolloFactory = new ApolloService();
    const { client } = await apolloFactory.getApolloClient(
      GraphQLResourcesUrl.mainServer
    );
    this._apolloInstance = client;
  }
}
