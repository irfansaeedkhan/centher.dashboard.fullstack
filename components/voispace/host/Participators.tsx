import React from "react";

import Button from "@/components/button";
import ClientCardView from "@/components/voispace/shared/profile";
import HostModalHeader from "@/components/voispace/host/partials/HostModalHeader";

import { speakers } from "../dummy.data/speakers.list";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => string;
}

const Participators: React.FC<DynamicProps> = ({
  onClose,
  setComponentName,
}) => {
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

        <div className="flex flex-wrap gap-8">
          {speakers.map((speaker: any, index) => {
            return (
              <div className="" key={index}>
                <ClientCardView
                  className="w-[74px]"
                  name={speaker.name}
                  imageURL={speaker.imageURL}
                  isApproved={speaker.isApproved}
                  isSpeaking={speaker.isSpeaking}
                  position={speaker.position}
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
