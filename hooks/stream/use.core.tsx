import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import { CentalkUserStatusEnum, ICentalkUser } from "@/stream/model";
import { areStringsEquals } from "@/stream/utils/string.utils";
import {
  getCurrentStream,
  getCurrentStreamUser,
  getHasTalkRequestStreamUsers,
  getStreamMessages,
  getStreams,
  getStreamSpeakers,
} from "@/stream/graphql/subscription";
import { ICentalkBroadcast, UserBroadcast } from "./cen-talk";
import { AMAStreamType, useAMA } from "./use.ama";
import { LiveStreamType, useLive } from "./use.live";
import { StreamHooksHelper } from "./helper";
import { insertMessageToStream } from "@/stream/graphql/mutation";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";

interface StreamContextType {
  useGetSubscribes: () => Promise<any>;
  getSpeakers: (limit: number, offset: number) => Promise<ICentalkUser[]>;
  insertMessage: (broadcastId: string, content: string) => Promise<void>;
  useSubscribeToAllBroadcasts: () => any;
  useSubscribeToSpeakers: (broadcastId: string) => any;
  useSubscribeToMessages: (broadcastId: string) => any;
  useSubscribeToCurrentStream: (
    broadcastId: string,
    type: BroadcastTypeEnum
  ) => ICentalkBroadcast | null;
  useSubscribeToCurrentUser: (broadcastId: string, userId: string) => any;
  useSubscribeToHasTalkRequestUsers: (broadcastId: string) => any;
  amaAgent: AMAStreamType;
  liveAgent: LiveStreamType;
}

const StreamContext = createContext<StreamContextType | null>(null);

interface StreamProviderProps {
  children: React.ReactNode;
  deviceInstance: mediasoupClient.Device;
}

export const StreamProvider: React.FC<StreamProviderProps> = ({
  children,
  deviceInstance,
}) => {
  const helper = useRef<StreamHooksHelper>(new StreamHooksHelper());
  const speakersRawData = useRef<Partial<ICentalkUser>[]>([]);

  const amaAgent = useAMA({
    deviceInstance,
  });
  const liveAgent = useLive({
    deviceInstance,
  });

  const useSubscribeToAllBroadcasts = () => {
    const [data, setData] = useState<any>(null);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;

      // Subscription handling
      const subscribeToAllBroadcasts = async (limit: number = 100) => {
        const apollo = await helperRef.current.getApolloClientInstance();
        const query = getStreams();

        if (!query) {
          throw new Error("invalid query");
        }

        const result = apollo.subscribe({
          query,
          variables: {
            limit,
          },
        });

        return result;
      };

      const setupSubscription = async () => {
        try {
          const subscription = await subscribeToAllBroadcasts();
          subscriptionRef.current = subscription.subscribe((newData) => {
            if (isSubscribed) {
              setData(newData);
            }
          });
        } catch (error) {
          console.error("Subscription setup failed:", error);
        }
      };

      setupSubscription();

      return () => {
        isSubscribed = false;
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      };
    }, []);

    return data;
  };

  const useSubscribeToSpeakers = (broadcastId: string) => {
    const [data, setData] = useState<any>(null);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;

      const setupSubscription = async () => {
        try {
          const apollo = await helperRef.current.getApolloClientInstance();
          const query = getStreamSpeakers();

          if (!query) {
            throw new Error("invalid query");
          }

          const result = apollo.subscribe({
            query,
            variables: {
              broadcastId,
            },
          });

          subscriptionRef.current = result.subscribe((newData) => {
            if (isSubscribed) {
              setData(newData.data.speakers);
              // You might want to handle the emitter event differently in hooks
              // Consider using a callback prop or context for this
            }
          });
        } catch (error) {
          console.error("Subscription setup failed:", error);
        }
      };

      setupSubscription();

      return () => {
        isSubscribed = false;
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      };
    }, [broadcastId]);

    return data;
  };

  const useSubscribeToMessages = (broadcastId: string) => {
    const [messages, setMessages] = useState<any>(null);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;

      const setupSubscription = async () => {
        try {
          const apollo = await helperRef.current.getApolloClientInstance();
          const query = getStreamMessages();

          if (!query) {
            throw new Error("invalid query");
          }

          const result = apollo.subscribe({
            query,
            variables: {
              broadcastId,
            },
          });

          subscriptionRef.current = result.subscribe((data) => {
            if (isSubscribed) {
              setMessages(data.data.messages);
            }
          });
        } catch (error) {
          console.error("Messages subscription failed:", error);
        }
      };

      setupSubscription();

      return () => {
        isSubscribed = false;
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      };
    }, [broadcastId]);

    return messages;
  };

  const useSubscribeToCurrentStream = (
    broadcastId: string,
    type: BroadcastTypeEnum
  ): ICentalkBroadcast | null => {
    const [currentStream, setCurrentStream] =
      useState<ICentalkBroadcast | null>(null);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;

      const setupSubscription = async () => {
        try {
          const apollo = await helperRef.current.getApolloClientInstance();
          const query = getCurrentStream();

          if (!query) {
            throw new Error("invalid query");
          }

          const result = apollo.subscribe({
            query,
            variables: {
              broadcastId,
            },
          });

          subscriptionRef.current = result.subscribe((data) => {
            if (isSubscribed) {
              setCurrentStream(data.data.broadcast[0]);
            }
          });
        } catch (error) {
          console.error("Current stream subscription failed:", error);
        }
      };

      setupSubscription();

      return () => {
        isSubscribed = false;
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      };
    }, [broadcastId, type]);

    return currentStream;
  };

  const useSubscribeToCurrentUser = (broadcastId: string, userId: string) => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;

      const setupSubscription = async () => {
        try {
          const apollo = await helperRef.current.getApolloClientInstance();
          const query = getCurrentStreamUser();

          if (!query) {
            throw new Error("invalid query");
          }

          const result = apollo.subscribe({
            query,
            variables: {
              broadcastId,
              userId,
            },
          });

          subscriptionRef.current = result.subscribe((data) => {
            if (isSubscribed) {
              setCurrentUser(data.data.users[0]);
            }
          });
        } catch (error) {
          console.error("Current user subscription failed:", error);
        }
      };

      setupSubscription();

      return () => {
        isSubscribed = false;
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      };
    }, [broadcastId, userId]);

    return currentUser;
  };

  const useSubscribeToHasTalkRequestUsers = (broadcastId: string) => {
    const [talkRequestUsers, setTalkRequestUsers] = useState<any>(null);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;

      const setupSubscription = async () => {
        try {
          const apollo = await helperRef.current.getApolloClientInstance();
          const query = getHasTalkRequestStreamUsers();

          if (!query) {
            throw new Error("invalid query");
          }

          const result = apollo.subscribe({
            query,
            variables: {
              broadcastId,
            },
          });

          subscriptionRef.current = result.subscribe((data) => {
            if (isSubscribed) {
              setTalkRequestUsers(data.data.users);
            }
          });
        } catch (error) {
          console.error("Talk request users subscription failed:", error);
        }
      };

      setupSubscription();

      return () => {
        isSubscribed = false;
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      };
    }, [broadcastId]);

    return talkRequestUsers;
  };

  const useGetSubscribes = () => {
    const [data, setData] = useState<any>(null);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;

      const setupSubscription = async () => {
        try {
          const apollo = await helperRef.current.getApolloClientInstance();
          const query = getStreams();
          const result = apollo.subscribe({
            query,
            variables: {
              limit: 100,
            },
          });

          subscriptionRef.current = result.subscribe((newData) => {
            if (isSubscribed) {
              setData(newData);
            }
          });
        } catch (error) {
          console.error("Subscription setup failed:", error);
        }
      };

      setupSubscription();

      return () => {
        isSubscribed = false;
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      };
    }, []);

    return data;
  };

  const getSpeakers = (
    limit: number,
    offset: number
  ): Promise<ICentalkUser[]> => {
    const slot = speakersRawData?.current.slice(offset, offset + limit) || [];

    return getManipulatedParticipators(slot);
  };

  const getManipulatedParticipators = async (
    participators: Partial<UserBroadcast>[]
  ): Promise<ICentalkUser[]> => {
    const userAddresses = participators.map((p) => {
      return p.user!.id;
    });

    // const users = await this.userService.getUsers(userAddresses);
    const users: any[] = [];

    return participators.map((d) => {
      const user = users.find((u) => areStringsEquals(u._id, d.user!.id));

      return {
        id: d.user!.id,
        name: user.display_name,
        image: user.profile_image,
        isVerified: user.membership.status === "verified",
        isMuted: d.isMuted,
        isChatPermission: d.hasPermissionToMessage,
        status: CentalkUserStatusEnum.ONLINE,
        role: d.type,
        hasTalkRequest: d.hasTalkRequest || false,
      };
    });
  };

  // Mutations
  const insertMessage = async (broadcastId: string, content: string) => {
    const apollo = await helper.current.getApolloClientInstance();

    await apollo.mutate({
      mutation: insertMessageToStream(),
      variables: {
        content: content,
        broadcastId: broadcastId,
      },
    });
  };

  const contextValue: StreamContextType = {
    useGetSubscribes,
    getSpeakers,
    insertMessage,
    useSubscribeToAllBroadcasts,
    useSubscribeToSpeakers,
    useSubscribeToMessages,
    useSubscribeToCurrentStream,
    useSubscribeToCurrentUser,
    useSubscribeToHasTalkRequestUsers,
    amaAgent,
    liveAgent,
  };

  return (
    <StreamContext.Provider value={contextValue}>
      {children}
    </StreamContext.Provider>
  );
};

// Custom hook to use the AMA context
export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useAMA must be used within an AMAProvider");
  }
  return context;
};
