import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { VoispaceLiveIcon } from "@/assets/svgs";
import { rooms } from "./dummy.data/rooms.list";
import Button from "../button";
import { VoispaceCreateChannelModal } from "./host/voispace.create.channel.modal";
import { VoispaceExploreChannelsModal } from "./user/voispace.explore.channels.modal";
import Modal from "./shared/Modal.js";

import DynamicComponent from "./host/HostMainView";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const VoiceSpaceFeedCard: React.FC<Props> = ({
  className,
  ...props
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [mainChannelChatBox, setMainChannelChatBox] = useState(false);

  return (
    <>
      <div
        className={clsx(`relative max-w-[272px] select-none`, className)}
        {...props}
      >
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
              className={` text-xs font-medium`}
            />
            <button
              onClick={() => setMainChannelChatBox(true)}
              data-modal-target="default-modal"
              data-modal-toggle="default-modal"
              className={`gradient-borders-2 h-8 w-16 rounded-10px p-[1px] text-xs font-medium`}
            >
              <span className={`text-gradient-1`}>New</span>
            </button>

            {mainChannelChatBox && (
              <DynamicComponent onClose={() => setMainChannelChatBox(false)} />
            )}
          </div>
          <div
            className={`flex cursor-pointer items-center justify-center border-t-2 border-gray-shade-3 text-center`}
          ></div>
          <div className="mx-auto grid grid-cols-4 gap-4 px-4 py-4">
            {rooms.map((room, index) => (
              <div className="relative cursor-pointer" key={index}>
                <Image
                  src="/images/voispace.gradient.ring.png"
                  alt="voispace"
                  height={50}
                  width={50}
                  className="absolute inset-0"
                />
                {room.live && (
                  <VoispaceLiveIcon className="absolute right-0 top-0 size-4" />
                )}
                <Image
                  src={room.image}
                  alt={room.eventName}
                  height={40}
                  width={40}
                  className="m-1"
                />
                <h6 className="max-w-[50px] overflow-hidden text-ellipsis whitespace-nowrap py-1 text-xs text-white">
                  {room.eventName}
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
        />
      )}
    </>
  );
};
