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
import useGetChatUsers from "../use.get.chat.users";

interface StreamContextType {
  useGetSubscribes: () => Promise<any>;
  insertMessage: (broadcastId: string, content: string) => Promise<void>;
  useSubscribeToAllBroadcasts: () => any;
  useSubscribeToSpeakers: (broadcastId: string) => any;
  useSubscribeToMessages: (broadcastId: string) => any;
  useSubscribeToCurrentStream: (
    broadcastId: string,
    type: BroadcastTypeEnum
  ) => { stream: ICentalkBroadcast | null; loader: boolean };
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

  const amaAgent = useAMA({
    deviceInstance,
  });
  const liveAgent = useLive({
    deviceInstance,
  });

  const { getUsers } = useGetChatUsers();

  const useSubscribeToAllBroadcasts = () => {
    const [data, setData] = useState<any>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;
      setLoader(true);
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
              setLoader(false);
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

    return { data, loader };
  };

  const useSubscribeToSpeakers = (broadcastId: string) => {
    const [data, setData] = useState<any>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;
      setLoader(true);
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

          subscriptionRef.current = result.subscribe(async (newData) => {
            if (isSubscribed) {
              const detailedSpeakers = await aggregateSpeakers(
                newData.data.speakers
              );
              setData(detailedSpeakers);
              setLoader(false);
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

    return { data, loader };
  };

  const useSubscribeToMessages = (broadcastId: string) => {
    const [messages, setMessages] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;

      const setupSubscription = async () => {
        try {
          setLoading(true);
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

          subscriptionRef.current = result.subscribe(async (data) => {
            if (isSubscribed) {
              const mappedUsers = await aggregateMessagesWithUsers(
                data.data.messages
              );
              setMessages(mappedUsers);
              setLoading(false);
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

    return { messages, loading };
  };

  const useSubscribeToCurrentStream = (
    broadcastId: string,
    type: BroadcastTypeEnum
  ): { stream: ICentalkBroadcast | null; loader: boolean } => {
    const [currentStream, setCurrentStream] =
      useState<ICentalkBroadcast | null>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;

      const setupSubscription = async () => {
        try {
          setLoader(true);
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

          subscriptionRef.current = result.subscribe(async (data) => {
            if (isSubscribed) {
              const stream = await aggregateCurrentStreamUsers(
                data.data.broadcast[0]
              );
              setCurrentStream(stream);
              setLoader(false);
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

    return { stream: currentStream, loader };
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
    const [loader, setLoader] = useState<boolean>(false);
    const subscriptionRef = useRef<any>();
    const helperRef = useRef<StreamHooksHelper>(helper.current);

    useEffect(() => {
      let isSubscribed = true;

      const setupSubscription = async () => {
        try {
          setLoader(true);
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

          subscriptionRef.current = result.subscribe(async (data) => {
            if (isSubscribed) {
              const users = await aggregateUsersHaveTalkRequest(
                data.data.users
              );
              setTalkRequestUsers(users);
              setLoader(false);
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

    return { talkRequestUsers, loader };
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

  //Utility
  const aggregateMessagesWithUsers = async (messages: any[]) => {
    const ids = messages.map((e) => e.sender);
    const users = await getUsers(ids);
    return messages.map((e) => {
      return {
        ...e,
        sender:
          users?.find((u) => areStringsEquals(u._id, e.sender)) || e.sender,
      };
    });
  };
  const aggregateCurrentStreamUsers = async (stream: any) => {
    const ids = stream.latestParticipants.map((e: any) => e.user.id);
    ids.push(stream.hosts[0].user.id);
    const users = await getUsers(ids);
    stream.latestParticipants = stream.latestParticipants.map((e: any) => {
      return {
        ...e,
        user:
          users?.find((u) => areStringsEquals(u._id, e.user.id)) || e.user.id,
      };
    });
    stream.hosts = stream.hosts.map((e: any) => {
      return {
        ...e,
        user:
          users?.find((u) => areStringsEquals(u._id, e.user.id)) || e.user.id,
      };
    });

    return stream;
  };
  const aggregateSpeakers = async (speakers: any[]) => {
    const ids = speakers.map((p) => {
      return p.user!.id;
    });

    const users = await getUsers(ids);

    return speakers.map(
      (d) =>
        users?.find((u) => areStringsEquals(u._id, d.user!.id)) || d.user?.id
    );
  };
  const aggregateUsersHaveTalkRequest = async (users: any[]) => {
    const ids = users.map((e) => e!.user?.id);
    const mappedUsers = await getUsers(ids);
    return users.map((u) =>
      mappedUsers?.find((m) => areStringsEquals(u.user.id, m._id))
    );
  };

  const contextValue: StreamContextType = {
    useGetSubscribes,
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
