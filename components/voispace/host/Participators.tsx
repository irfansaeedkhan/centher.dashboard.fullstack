import React from "react";

import Button from "@/components/button";
import ClientCardView from "@/components/voispace/shared/profile";
import HostModalHeader from "@/components/voispace/host/partials/HostModalHeader";
import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";

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
  const participators = roomData.latestParticipants;
  return (
    <div className="px-[24px] py-[24px] text-white">
      <div className="flex flex-col gap-[27px]">
        <HostModalHeader
          subTitle="The Room of Traders"
          title="Participators"
          onClose={onClose}
          onBack={() => setComponentName("TheRoomOfTraders")}
        >
          <Button
            title="Invite"
            variant="primary"
            onClick={() => setComponentName("InvitetoRoom")}
            className={` text-xs font-medium`}
            borderRounded="10px"
          />
        </HostModalHeader>

        <div className="flex flex-wrap gap-[28px]">
          {participators.map((speaker: any, index) => {
            return (
              <div className="" key={index}>
                <ClientCardView
                  className="w-[72px]"
                  name={speaker.display_name}
                  imageURL={speaker.profile_image}
                  isApproved={true}
                  isSpeaking={true}
                  position={speaker.type}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Participators;
