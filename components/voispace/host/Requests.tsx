import React from "react";

import RequestRow from "@/components/voispace/host/partials/RequestRow";

import HostModalHeader from "./partials/HostModalHeader";
import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";
import { useStream } from "@/hooks/stream/use.core";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => string;
  roomData: Room;
}

const Requests: React.FC<DynamicProps> = ({
  onClose,
  setComponentName,
  roomData,
}) => {
  const { useSubscribeToHasTalkRequestUsers } = useStream();
  const { talkRequestUsers, loader } = useSubscribeToHasTalkRequestUsers(
    roomData.id as string
  );
  const talkRequestHandler = (user: any, action: string) => {};

  return (
    <div className="px-[24px] py-[24px] text-white">
      <div className="flex flex-col gap-[16px]">
        <HostModalHeader
          subTitle="The Room of Traders"
          title="Requests"
          onClose={onClose}
          onBack={() => setComponentName("TheRoomOfTraders")}
        />

        <div className="">
          {loader
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex w-full items-center  justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-700"></div>
                    <div className="relative h-5 w-24 animate-pulse rounded-md bg-gray-700" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative h-8 w-20 animate-pulse rounded-md bg-gray-700" />
                    <div className="relative h-8 w-20 animate-pulse rounded-md bg-gray-700" />
                  </div>
                </div>
              ))
            : talkRequestUsers?.map((request: any, index: number) => {
                return (
                  <RequestRow
                    request={request}
                    key={index}
                    talkRequestHandler={talkRequestHandler}
                  />
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default Requests;
