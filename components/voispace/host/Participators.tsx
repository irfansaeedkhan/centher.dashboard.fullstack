import React, { useEffect, useRef, useState } from "react";

import Button from "@/components/button";
import ClientCardView from "@/components/voispace/shared/profile";
import HostModalHeader from "@/components/voispace/host/partials/HostModalHeader";

import { useStream } from "@/hooks/stream/use.core";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";

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
  const { useQueryToGetParticipatorsByBroadcastId, amaAgent, liveAgent } =
    useStream();

  const isOwner = amaAgent.globalIsOwner || liveAgent.globalIsOwner;

  const isPrivate =
    roomData.accessMode == StreamAccessModeEnum.ACCESS_BY_INVITATION;

  const [limit, setLimit] = useState<number>(0);
  const [allParticipators, setAllParticipators] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, loader } = useQueryToGetParticipatorsByBroadcastId(
    roomData.id as string,
    limit
  );

  useEffect(() => {
    if (data?.participators?.length) {
      setAllParticipators(data.participators);
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

        <div className="customScrollbar flex max-h-[60vh] flex-wrap items-center gap-12 overflow-y-auto py-2 sm:px-2">
          {allParticipators?.map((participator: any, index: number) => {
            return (
              <div className="" key={index}>
                <ClientCardView
                  className="w-18"
                  name={participator.mappedUser.display_name}
                  imageURL={participator.mappedUser.profile_image}
                  isApproved={
                    participator.mappedUser.membership.status == "citizen"
                  }
                  isSpeaking={participator.type?.toLowerCase() == "speaker"}
                  position={participator.type}
                />
              </div>
            );
          })}

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
