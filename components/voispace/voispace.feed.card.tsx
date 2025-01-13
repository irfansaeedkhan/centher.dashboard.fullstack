import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";

import {
  LoaderSpinner,
  SpinIcon3,
  VoispaceGradientRing,
  VoispaceLiveIcon,
} from "@/assets/svgs";
import Button from "../button";
import ChannelMainView from "./shared/ChannelMainView";
import { useStream } from "@/hooks/stream/use.core";
import {
  Room,
  VoispaceCreateChannelModal,
} from "./host/voispace.create.channel.modal/voispace.create.channel.modal";
import { VoispaceExploreChannelsModal } from "./user/voispace.explore.channels.modal";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import useUser from "@/hooks/use.user";
import { StreamEventEnum } from "@/stream/model";
import toast, { LoaderIcon } from "react-hot-toast";

export const VoiceSpaceFeedCard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [selectedRoomData, setSelectedRoomData] = useState<Room | null>(null);
  const [isUserMainViewOpen, setIsUserMainViewOpen] = useState(false);
  const { amaAgent, liveAgent, useSubscribeToAllBroadcasts } = useStream();
  const { joinRoom: joinAMARoom, event: eventOnAMA } = amaAgent;
  const { joinRoom: joinLiveRoom, event: eventOnLive } = liveAgent;
  const [joiningRoomLoader, setJoiningRoomLoader] = useState<boolean>(false);
  const { user } = useUser();
  const { loader, data: broadcasts } = useSubscribeToAllBroadcasts();

  const { leave: leaveAMA } = amaAgent;
  const { leave: leaveLive } = liveAgent;

  useEffect(() => {
    setRooms(broadcasts?.data?.broadcast);
  }, [broadcasts]);

  useEffect(() => {
    if (
      eventOnAMA?.type === StreamEventEnum.ON_JOINED_TO_BROADCAST ||
      eventOnLive?.type === StreamEventEnum.ON_JOINED_TO_BROADCAST
    ) {
      setSelectedRoomData(selectedRoom);
      setIsUserMainViewOpen(true);
      setJoiningRoomLoader(false);
    }

    if (
      eventOnAMA?.type == StreamEventEnum.STREAM_INITIALIZATION_ERROR ||
      eventOnLive?.type == StreamEventEnum.STREAM_INITIALIZATION_ERROR
    ) {
      const error = eventOnAMA?.data || eventOnLive?.data;
      toast.error(error);

      setIsUserMainViewOpen(false);
      setSelectedRoomData(null);
    }
  }, [eventOnLive, eventOnAMA]);

  const handleRoomClick = (room: Room) => {
    try {
      console.log({ room });
      if (room.type == BroadcastTypeEnum.AMA) {
        joinAMARoom(room.id as string, user?._id || "");
      } else {
        joinLiveRoom(room.id as string, user?._id || "");
      }
      setSelectedRoom(room);
      setJoiningRoomLoader(true);
    } catch (error) {
      toast.error("cannot join this room");
    }
  };

  const handleCloseModal = () => {
    if (selectedRoomData?.type === BroadcastTypeEnum.AMA) {
      leaveAMA();
    }

    if (selectedRoomData?.type === BroadcastTypeEnum.LIVE) {
      leaveLive();
    }

    setIsUserMainViewOpen(false);
    setSelectedRoomData(null);
  };

  const getValidImageUrl = (src: string) => {
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }
    return `/` + src.replace(/^\//, "");
  };
  return (
    <>
      <div className={clsx(`relative w-full select-none  flg:max-w-[272px]`)}>
        <div className={`relative rounded-10px bg-background-shade-3`}>
          <div className="border-b border-gray-shade-3">
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
          </div>
          <div className="mx-auto grid grid-cols-4 gap-4 px-4 py-4">
            {loader
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 w-12 animate-pulse rounded-full bg-gray-700"
                  ></div>
                ))
              : rooms &&
                rooms?.slice(0, 7).map((room) => (
                  <div
                    className="relative w-12 cursor-pointer  items-center justify-center"
                    key={room.id}
                    onClick={() => handleRoomClick(room)}
                  >
                    <Image
                      src="/images/voispace.gradient.ring.png"
                      alt="voispace"
                      height={50}
                      width={50}
                      className="absolute inset-0 h-12 w-12"
                    />
                    {room.type === "AMA" && (
                      <VoispaceLiveIcon className="absolute right-0 top-0 size-4" />
                    )}
                    <Image
                      src={getValidImageUrl(room.image as string)}
                      alt={room?.name || ""}
                      height={40}
                      width={40}
                      className="m-1 h-10 w-10 rounded-full object-cover"
                    />
                    <h6 className="max-w-[50px] overflow-hidden text-ellipsis whitespace-nowrap py-1 text-xs text-white">
                      {room?.name}
                    </h6>
                  </div>
                ))}

            {!loader && rooms?.length > 7 && (
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
            )}
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
          onClose={handleCloseModal} // TODO: change to leave
          roomData={selectedRoomData}
          component={
            selectedRoomData.type === BroadcastTypeEnum.AMA
              ? "TheRoomOfTraders"
              : "LiveView"
          }
        />
      )}

      {joiningRoomLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
          <div className="flex flex-col items-center gap-4 rounded-lg  px-14 py-8">
            <VoispaceGradientRing className="animate-spin text-2xl text-white" />
            <span className=" text-lg font-medium capitalize text-white">
              Joining Stream{" "}
              <span className="textGradient animate-pulse">...</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
};
