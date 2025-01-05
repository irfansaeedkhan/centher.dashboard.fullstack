import { useRef, useState } from "react";
import { StreamHooksHelper } from "./helper";
import { getStreams } from "@/stream/graphql/subscription";
import { CentalkUserStatusEnum, ICentalkUser } from "@/stream/model";
import { UserBroadcast } from "./cen-talk";
import { areStringsEquals } from "@/stream/utils/string.utils";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { CreateBroadcastDto, StreamAgentType } from "@/stream/types/Broadcast";

export const useCoreStream = () => {
  const helper = useRef<StreamHooksHelper>(new StreamHooksHelper());
  const speakersRawData = useRef<Partial<ICentalkUser>[]>([]);

  //socket handlers
  // const createStream = async(
  //   input: CreateBroadcastDto,
  //   userId: string
  // ): Promise<StreamAgentType> => {
  //   try {
  //     // if (this._socketInstance) {
  //     //   throw new Error("another stream is open");
  //     // }

  //     if (input.type === BroadcastTypeEnum.AMA) {
  //       // this._peerInstance = new AmaAgent(
  //       //   this._socketInstance,
  //       //   this.emitterService
  //       // );
  //     } else {
  //       // this._peerInstance = new LiveAgent(
  //       //   this._socketInstance,
  //       //   this.emitterService
  //       // );
  //     }

  //     await new Promise((res, rej) => {
  //       setTimeout(() => {
  //         res();
  //       }, 1 * 100);
  //     });
  //     // await this._peerInstance.createRoom(input, userId);

  //     // return this._peerInstance;
  //     return {};
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  const useGetSubscribes = async () => {
    console.log("useGetSubscribes");
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
      console.log("Data1", data);
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

  return { useGetSubscribes };
};
