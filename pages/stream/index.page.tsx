import { BroadcastPreviewDto } from "@/hooks/stream/dto/broadcast-preview.dto";
import { useStream } from "@/hooks/stream/use.core";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";

const StreamPage: NextPage = () => {
  const {
    useGetSubscribes,
    useQueryToGetInvitedUsersByBrooadcastId,
    useQueryToGetParticipatorsByBroadcastId,
    amaAgent,
    liveAgent,
  } = useStream();
  const { createRoom: createAMARoom } = amaAgent;
  const { createRoom: createLiveRoom } = liveAgent;
  const streamPromise = useGetSubscribes();
  const [streamData, setStreamData] = useState<BroadcastPreviewDto[]>([]);
  const { data: invitedUsers, loader } =
    useQueryToGetInvitedUsersByBrooadcastId(
      "9de4cb22-25f9-4191-9408-510b53cf0887"
    );

  const { data: participators } = useQueryToGetParticipatorsByBroadcastId(
    "9de4cb22-25f9-4191-9408-510b53cf0887",
    0
  );

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const data = await streamPromise;
        setStreamData(data.data.broadcast);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStream();
  }, [streamPromise]);

  useEffect(() => {
    console.log({ invitedUsers });
  }, [invitedUsers]);

  useEffect(() => {
    console.log({ participators });
  }, [participators]);

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      Test Stream
      <div className="felx w-full flex-row ">
        <p>broudcasts</p>
        {streamData?.map((stream) => {
          return (
            <div key={stream.id}>
              <Image
                src={stream.image}
                alt="Picture of the author"
                width={50}
                height={50}
              />
              <p>{stream.id}</p>
            </div>
          );
        })}
      </div>
      <div className="m-5 w-full bg-red-400">
        <p>Create AMA</p>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={async () => {
            await createAMARoom(
              {
                name: "test",
                description: "test",
                image:
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Ethereum_logo_translucent.svg/200px-Ethereum_logo_translucent.svg.png",
                accessMode: StreamAccessModeEnum.PUBLIC,
                type: BroadcastTypeEnum.AMA,
                tokenAddress: [],
                invitedUsers: [],
              },
              "0xb3cccedd79b33bf5d1b2eb9d49cd2c41edf67506"
            );
          }}
        >
          Create AMA Room
        </button>
      </div>
      <div className="m-5 w-full bg-green-400">
        <p>Create LIVE</p>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={async () => {
            await createLiveRoom(
              {
                name: "test",
                description: "test",
                image:
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Ethereum_logo_translucent.svg/200px-Ethereum_logo_translucent.svg.png",
                accessMode: StreamAccessModeEnum.PUBLIC,
                type: BroadcastTypeEnum.LIVE,
                tokenAddress: [],
                invitedUsers: [],
              },
              "0xb3cccedd79b33bf5d1b2eb9d49cd2c41edf67506"
            );
          }}
        >
          Create Live Room
        </button>
      </div>
      <div className="felx w-full flex-row ">
        <p>Invited Users</p>
        {}
        {/* {invitedUsers?.map((stream) => {
          return (
            <div key={stream.id}>
              <Image
                src={stream.image}
                alt="Picture of the author"
                width={50}
                height={50}
              />
              <p>{stream.id}</p>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default StreamPage;
