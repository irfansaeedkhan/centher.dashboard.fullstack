import React from "react";

import Button from "@/components/button";
import ClientCardView from "@/components/voispace/shared/profile";
import HostModalHeader from "@/components/voispace/host/partials/HostModalHeader";
import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";
import { useStream } from "@/hooks/stream/use.core";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => string;
  roomData: Room;
}

const Participators: React.FC<DynamicProps> = ({
  onClose,
  setComponentName,
  roomData,
}) => {
  const { useQueryToGetParticipatorsByBroadcastId, amaAgent, liveAgent } =
    useStream();

  const isOwner = amaAgent.globalIsOwner || liveAgent.globalIsOwner;

  const isPrivate =
    roomData.accessMode == StreamAccessModeEnum.ACCESS_BY_INVITATION;

  //TODO: handle pagination
  const { data: participators, loader } =
    useQueryToGetParticipatorsByBroadcastId(roomData.id as string, 0);

  return (
    <div className="px-[24px] py-[24px] text-white">
      <div className="flex flex-col gap-[27px]">
        <HostModalHeader
          subTitle="The Room of Traders"
          title="Participators"
          onClose={onClose}
          onBack={() => setComponentName("TheRoomOfTraders")}
        >
          {isOwner && isPrivate && (
            <Button
              title="Invite"
              variant="primary"
              onClick={() => setComponentName("InvitetoRoom")}
              className={` text-xs font-medium`}
              borderRounded="10px"
            />
          )}
        </HostModalHeader>

        <div className="flex flex-wrap gap-8">
          {loader
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-700"></div>
                  <div className="relative h-3 w-16 animate-pulse rounded-md bg-gray-700" />
                </div>
              ))
            : participators?.participators?.map(
                (participator: any, index: number) => {
                  return (
                    <div className="" key={index}>
                      <ClientCardView
                        className="w-18"
                        name={participator.mappedUser.display_name}
                        imageURL={participator.mappedUser.profile_image}
                        isApproved={
                          participator.mappedUser.membership.status == "citizen"
                        }
                        isSpeaking={
                          participator.type?.toLowerCase() == "speaker"
                        }
                        position={participator.type}
                      />
                    </div>
                  );
                }
              )}
        </div>
      </div>
    </div>
  );
};

export default Participators;
