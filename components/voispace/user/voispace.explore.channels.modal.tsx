import React, { useState } from "react";
import ModalContainer from "@/components/modal/modal-container";
import clsx from "clsx";
import Button from "@/components/button";
import { AmaStreamCard } from "./ama.stream.card";
import { LiveStreamCard } from "./live.stream.card";

interface Props {
  onClose: () => void;
}

const dummyAMAChannels = [
  {
    id: 1,
    name: "AMA Channel 1",
    description: "Description for AMA 1",
    views: 100,
    duration: "1h 30m",
  },
  {
    id: 2,
    name: "AMA Channel 2",
    description: "Description for AMA 2",
    views: 50,
    duration: "45m",
  },
  {
    id: 1,
    name: "AMA Channel 1",
    description: "Description for AMA 1",
    views: 100,
    duration: "1h 30m",
  },
  {
    id: 2,
    name: "AMA Channel 2",
    description: "Description for AMA 2",
    views: 50,
    duration: "45m",
  },
  {
    id: 1,
    name: "AMA Channel 1",
    description: "Description for AMA 1",
    views: 100,
    duration: "1h 30m",
  },
  {
    id: 2,
    name: "AMA Channel 2",
    description: "Description for AMA 2",
    views: 50,
    duration: "45m",
  },
  {
    id: 1,
    name: "AMA Channel 1",
    description: "Description for AMA 1",
    views: 100,
    duration: "1h 30m",
  },
  {
    id: 2,
    name: "AMA Channel 2",
    description: "Description for AMA 2",
    views: 50,
    duration: "45m",
  },
  {
    id: 1,
    name: "AMA Channel 1",
    description: "Description for AMA 1",
    views: 100,
    duration: "1h 30m",
  },
  {
    id: 2,
    name: "AMA Channel 2",
    description: "Description for AMA 2",
    views: 50,
    duration: "45m",
  },
  {
    id: 1,
    name: "AMA Channel 1",
    description: "Description for AMA 1",
    views: 100,
    duration: "1h 30m",
  },
  {
    id: 2,
    name: "AMA Channel 2",
    description: "Description for AMA 2",
    views: 50,
    duration: "45m",
  },
];

const dummyLiveChannels = [
  {
    id: 1,
    name: "Live Channel 1",
    description: "Description for Live 1",
    views: 200,
    duration: "2h",
  },
  {
    id: 2,
    name: "Live Channel 2",
    description: "Description for Live 2",
    views: 150,
    duration: "1h 15m",
  },
  {
    id: 1,
    name: "Live Channel 1",
    description: "Description for Live 1",
    views: 200,
    duration: "2h",
  },
  {
    id: 2,
    name: "Live Channel 2",
    description: "Description for Live 2",
    views: 150,
    duration: "1h 15m",
  },
  {
    id: 1,
    name: "Live Channel 1",
    description: "Description for Live 1",
    views: 200,
    duration: "2h",
  },
  {
    id: 2,
    name: "Live Channel 2",
    description: "Description for Live 2",
    views: 150,
    duration: "1h 15m",
  },
  {
    id: 1,
    name: "Live Channel 1",
    description: "Description for Live 1",
    views: 200,
    duration: "2h",
  },
  {
    id: 2,
    name: "Live Channel 2",
    description: "Description for Live 2",
    views: 150,
    duration: "1h 15m",
  },
];

export const VoispaceExploreChannelsModal: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"AMA" | "Live">("AMA");

  const channels = activeTab === "AMA" ? dummyAMAChannels : dummyLiveChannels;

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
        {/* customScrollbar absolute top-full z-10 mt-1.5 max-h-[195px] w-full
        overflow-y-auto rounded-xl bg-popup-0 */}
        <div className="customScrollbar grid max-h-[60vh] grid-cols-1 gap-4 overflow-y-auto fxm:grid-cols-2 fmd:grid-cols-3">
          {channels.map((channel) =>
            activeTab === "AMA" ? (
              <AmaStreamCard
                key={channel.id}
                name={channel.name}
                description={channel.description}
                views={channel.views}
                duration={channel.duration}
              />
            ) : (
              <LiveStreamCard
                key={channel.id}
                name={channel.name}
                description={channel.description}
                views={channel.views}
                duration={channel.duration}
              />
            )
          )}
        </div>
        {/* {activeTab === "AMA" ? (
          <div className="grid grid-cols-1 gap-4 fxm:grid-cols-2 fmd:grid-cols-3">
            <AmaStreamCard />
            <AmaStreamCard />
            <AmaStreamCard />
            <AmaStreamCard />
            <AmaStreamCard />
            <AmaStreamCard />
          </div>
        ) : activeTab === "Live" ? (
          <div className="grid grid-cols-1 gap-4 fxm:grid-cols-2 fmd:grid-cols-3">
            <LiveStreamCard />
            <LiveStreamCard />
            <LiveStreamCard />
            <LiveStreamCard />
            <LiveStreamCard />
            <LiveStreamCard />
          </div>
        ) : null} */}
      </div>
    </ModalContainer>
  );
};
