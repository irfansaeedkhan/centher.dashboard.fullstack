import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import { CentalkUserStatusEnum, ICentalkUser } from "@/stream/model";
import { areStringsEquals } from "@/stream/utils/string.utils";
import { getStreams } from "@/stream/graphql/subscription";
import { UserBroadcast } from "./cen-talk";
import { AMAStreamType, useAMA } from "./use.ama";
import { LiveStreamType, useLive } from "./use.live";
import { StreamHooksHelper } from "./helper";
import { insertMessageToStream } from "@/stream/graphql/mutation";

interface StreamContextType {
  useGetSubscribes: () => Promise<any>;
  getSpeakers: (limit: number, offset: number) => Promise<ICentalkUser[]>;
  insertMessage: (broadcastId: string, content: string) => Promise<void>;
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
