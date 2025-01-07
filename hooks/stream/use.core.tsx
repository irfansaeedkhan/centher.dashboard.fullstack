import { createContext, useContext, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import { CentalkUserStatusEnum, ICentalkUser } from "@/stream/model";
import { areStringsEquals } from "@/stream/utils/string.utils";
import { getStreams } from "@/stream/graphql/subscription";
import { UserBroadcast } from "./cen-talk";
import { AMAStreamType, useAMA } from "./use.ama";
import { LiveStreamType, useLive } from "./use.live";
import { StreamHooksHelper } from "./helper";

interface StreamContextType {
  useGetSubscribes: () => Promise<any>;
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

  const useGetSubscribes = async () => {
    const [data, setData] = useState<any>(null);
    const apollo = await helper.current.getApolloClientInstance();
    const query = getStreams();
    const result = apollo.subscribe({
      query,
      variables: {
        limit: 100,
      },
    });

    result.subscribe((data) => {
      setData(data);
    });

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

  //instances initiators
  // const initSocketClient = (): Promise<void> => {
  //   // eslint-disable-next-line @typescript-eslint/no-this-alias
  //   const _ctx = this;

  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       _ctx._socketInstance = await _ctx.socketClient.build(
  //         SocketServersEnum.BROADCAST
  //       );

  //       _ctx._socketInstance.on("connection-accepted", () => {
  //         resolve();
  //       });

  //       // _ctx._socketInstance.on("error", (err) => {
  //       //   this.emitterService.emit(EmitterEnum.ON_NEED_STREAM_ACCESS, err);
  //       //   console.log("socket error: ", err);
  //       // });
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // };

  const contextValue: StreamContextType = {
    useGetSubscribes,
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
