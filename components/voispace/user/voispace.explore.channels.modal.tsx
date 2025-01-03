import React, { useState } from "react";

import ModalContainer from "@/components/modal/modal-container";
import Button from "@/components/button";

import { AmaStreamCard } from "./ama.stream.card";
import { LiveStreamCard } from "./live.stream.card";
import { rooms } from "../dummy.data/rooms.list";

interface Props {
  onClose: () => void;
  onChannelClick: (room: any) => void;
}

export const VoispaceExploreChannelsModal: React.FC<Props> = ({
  onClose,
  onChannelClick,
}) => {
  const [activeTab, setActiveTab] = useState<"AMA" | "Live">("AMA");

  const filteredRooms = rooms.filter((room) => room.roomType === activeTab);
  return (
    <ModalContainer
      modalId="more-rooms"
      onClose={onClose}
      isOpen={true}
      modalContentClassName="max-w-[656px] p-0 rounded-3xl"
    >
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-gradient text-2xl font-semibold leading-9 text-white">
            VOISPACE
          </h2>
          <div className="flex items-center gap-2">
            <Button
              title="AMA"
              variant={activeTab === "AMA" ? "primary" : "secondary"}
              onClick={() => setActiveTab("AMA")}
              borderRounded="10px"
              className="text-xs font-medium"
            />
            <Button
              title="Live Stream"
              variant={activeTab === "Live" ? "primary" : "secondary"}
              onClick={() => setActiveTab("Live")}
              borderRounded="10px"
              className="text-xs font-medium"
            />
          </div>
        </div>
        <div className="customScrollbar grid max-h-[60vh] grid-cols-1 gap-4 overflow-y-auto fxm:grid-cols-2 fmd:grid-cols-3">
          {filteredRooms.map((channel) =>
            activeTab === "AMA" ? (
              <div key={channel.id} onClick={() => onChannelClick(channel)}>
                <AmaStreamCard {...channel} />
              </div>
            ) : (
              <div key={channel.id} onClick={() => onChannelClick(channel)}>
                <LiveStreamCard {...channel} />
              </div>
            )
          )}
        </div>
      </div>
    </ModalContainer>
  );
};
