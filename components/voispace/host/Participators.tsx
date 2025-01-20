import React, { useEffect, useRef, useState } from "react";

import Button from "@/components/button";
import HostModalHeader from "@/components/voispace/host/partials/HostModalHeader";

import { useStream } from "@/hooks/stream/use.core";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";

import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";
import UserWithPopover from "./partials/UserWithPopover";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { CurrentUserContainer } from "../shared/ChannelMainView";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => string;
  roomData: Room;
  currentUserContainer: CurrentUserContainer;
}

const Participators: React.FC<DynamicProps> = ({
  onClose,
  setComponentName,
  roomData,
  currentUserContainer,
}) => {
  const { useSubscribeToParticipators, amaAgent, liveAgent } = useStream();

  const isOwner = amaAgent.globalIsOwner || liveAgent.globalIsOwner;

  const isPrivate =
    roomData.accessMode == StreamAccessModeEnum.ACCESS_BY_INVITATION;

  const [limit, setLimit] = useState<number>(25);
  const [allParticipators, setAllParticipators] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, loader } = useSubscribeToParticipators(
    roomData.id as string,
    limit
  );

  const {
    toggleMemberTalkPermission: amaTalkPerm,
    toggleMessagePermission: amaMsgPerm,
    kickUser: amaKick,
  } = amaAgent;

  const { toggleMessagePermission: liveMsgPerm, kickUser: liveKick } =
    liveAgent;

  const handleToggleTalkPermission = async (userId: string) => {
    try {
      if (roomData.type == BroadcastTypeEnum.AMA) {
        amaTalkPerm(userId);
      }
    } catch (error) {
      console.error("Failed to toggle talk permission:", error);
    }
  };
  const handleToggleMessagePermission = async (userId: string) => {
    try {
      if (roomData.type == BroadcastTypeEnum.AMA) {
        amaMsgPerm(userId);
      } else {
        liveMsgPerm(userId);
      }
    } catch (error) {
      console.error("Failed to toggle message permission:", error);
    }
  };
  const handleKickUser = async (userId: string) => {
    try {
      if (roomData.type == BroadcastTypeEnum.AMA) {
        amaKick(userId);
      } else {
        liveKick(userId);
      }
    } catch (error) {
      console.error("Failed to kick user:", error);
    }
  };

  useEffect(() => {
    if (data?.participators?.length) {
      setAllParticipators(
        data.participators.filter((e: any) => e.type != "HOST")
      );

      if (data.participators.length < limit) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  }, [data, limit]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loader) {
          setLimit((prevLimit) => prevLimit + 25);
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loaderRef.current, hasMore, loader]);

  console.log("allParticipators::", allParticipators);
  return (
    <div className="px-[24px] py-[24px] text-white">
      <div className="flex flex-col gap-[27px]">
        <HostModalHeader
          subTitle={roomData?.name || "N/A"}
          title="Participants"
          onClose={onClose}
          hasBackButton={true}
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

        <div className="customScrollbar flex max-h-[60vh] flex-wrap items-center gap-12 overflow-y-auto py-2 sm:px-2">
          {allParticipators?.length > 0 &&
            allParticipators?.map((participator: any, index: number) => {
              return (
                <div className="" key={index}>
                  <div key={index}>
                    <UserWithPopover
                      mode={isOwner ? "admin" : "participant"}
                      client={participator}
                      handleKickOff={handleKickUser}
                      handleTalkPermission={handleToggleTalkPermission}
                      handleMessagePermission={handleToggleMessagePermission}
                      currentUserContainer={currentUserContainer}
                    />
                  </div>
                </div>
              );
            })}

          {allParticipators?.length < 1 && (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-gay-300 text-sm md:text-base">
                No Participants Found
              </p>
            </div>
          )}

          {loader &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-700"></div>
                <div className="relative h-3 w-16 animate-pulse rounded-md bg-gray-700" />
              </div>
            ))}

          <div ref={loaderRef} className="h-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Participators;
