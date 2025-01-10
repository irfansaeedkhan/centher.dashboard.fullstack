import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";

import { VoispaceLiveIcon } from "@/assets/svgs";
import Button from "../button";
import ChannelMainView from "./shared/ChannelMainView";
import { useStream } from "@/hooks/stream/use.core";
import { VoispaceCreateChannelModal } from "./host/voispace.create.channel.modal/voispace.create.channel.modal";
import { VoispaceExploreChannelsModal } from "./user/voispace.explore.channels.modal";

export interface RoomData {
  id: string;
  type: "AMA" | "Live";
  roomPrivacy: "Public" | "Private" | "Privilege";
}

export const VoiceSpaceFeedCard: React.FC = () => {
  const { useSubscribeToAllBroadcasts } = useStream();
  const streamPromise = useSubscribeToAllBroadcasts();
  const [rooms, setRooms] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [selectedRoomData, setSelectedRoomData] = useState<{
    id: string;
    type: "AMA" | "Live";
    roomPrivacy: "Public" | "Private" | "Privilege";
  } | null>(null);

  const [isUserMainViewOpen, setIsUserMainViewOpen] = useState(false);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const data = await streamPromise;
        setRooms(data.data.broadcast);
      } catch (err) {
        console.log("Error fetching rooms:", err);
      }
    };

    fetchStream();
  }, [streamPromise]);

  const handleRoomClick = (room: any) => {
    const roomData = {
      id: room.id,
      type: room.type,
      roomPrivacy: room.accessMode,
    };
    console.log("roomData::", roomData);
    setSelectedRoomData(roomData);
    setIsUserMainViewOpen(true);
  };

  const handleCloseModal = () => {
    setIsUserMainViewOpen(false);
    setSelectedRoomData(null);
  };

  console.log("room::", rooms);

  const getValidImageUrl = (src: string) => {
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }
    return `/` + src.replace(/^\//, ""); // Ensure it starts with a "/"
  };
  return (
    <>
      <div className={clsx(`relative max-w-[272px] select-none`)}>
        <div className={`relative rounded-10px bg-background-shade-3`}>
          <div className={`flex items-center justify-between p-4`}>
            <h5 className={`text-gradient-1 text-base font-semibold`}>
              VoiceSpace
            </h5>
            <Button
              title={"New"}
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              borderRounded="10px"
              className={`text-xs font-medium`}
            />
          </div>
          <div className="mx-auto grid grid-cols-4 gap-4 px-4 py-4">
            {rooms &&
              rooms.map((room) => (
                <div
                  className="relative cursor-pointer"
                  key={room.id}
                  onClick={() => handleRoomClick(room)}
                >
                  <Image
                    src="/images/voispace.gradient.ring.png"
                    alt="voispace"
                    height={50}
                    width={50}
                    className="absolute inset-0"
                  />
                  {room.type === "AMA" && (
                    <VoispaceLiveIcon className="absolute right-0 top-0 size-4" />
                  )}
                  <Image
                    src={getValidImageUrl(room.image)}
                    alt={room?.name}
                    height={40}
                    width={40}
                    className="m-1"
                  />
                  <h6 className="max-w-[50px] overflow-hidden text-ellipsis whitespace-nowrap py-1 text-xs text-white">
                    {room?.name}
                  </h6>
                </div>
              ))}
            <button
              className="relative cursor-pointer"
              onClick={() => setIsMoreModalOpen(true)}
            >
              <Image
                src="/images/voispace.more.png"
                alt="voispace"
                height={50}
                width={50}
              />
              <h6 className="max-w-[50px] py-1 text-center text-xs text-white">
                More
              </h6>
            </button>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <VoispaceCreateChannelModal
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isMoreModalOpen && (
        <VoispaceExploreChannelsModal
          onClose={() => setIsMoreModalOpen(false)}
          onChannelClick={(room) => handleRoomClick(room)}
        />
      )}

      {isUserMainViewOpen && selectedRoomData && (
        <ChannelMainView
          onClose={handleCloseModal}
          roomData={selectedRoomData}
          component={
            selectedRoomData.type === "AMA" ? "TheRoomOfTraders" : "LiveView"
          }
        />
      )}
    </>
  );
};
