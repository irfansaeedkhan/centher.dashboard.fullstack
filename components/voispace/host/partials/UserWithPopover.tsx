import React from "react";
import Image from "next/image";

import { ChatProfile, MicIcon2 } from "@/assets/svgs";

import ClientCardView from "../../shared/profile";
import ActionButton from "../ui/ActionButton";
import Chips from "../ui/Chips";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
} from "../ui/Popover";
import { User } from "@/models/user";

interface UserWithPopoverProps {
  client: User;
  handleKickOff: (userId: string) => void;
  handleTalkPermission: (userId: string) => void;
  handleMessagePermission: (userId: string) => void;
}

const UserWithPopover: React.FC<UserWithPopoverProps> = ({
  client,
  handleKickOff,
  handleTalkPermission,
  handleMessagePermission,
}) => {
  return (
    <Popover placement="top">
      <PopoverTrigger>
        <ClientCardView
          name={client?.display_name ?? "Unknown"}
          imageURL={client?.profile_image ?? ""}
          // TODO handle the isApproved and isSpeaking props
          isApproved={true}
          isSpeaking={true}
        />
      </PopoverTrigger>
      <PopoverContent className="Popover flex flex-col gap-[16px] bg-[#1C1D21] px-[20] py-[5px] text-white">
        <PopoverHeading>
          <div className="flex h-[41px] items-center justify-between">
            <span className="text-semibold font-monto text-[20px]">
              About Speaker
            </span>
          </div>
        </PopoverHeading>
        <PopoverDescription>
          <div className="flex w-[353px] justify-between py-[8px]">
            <div className="flex items-center gap-[16px]">
              <div className="h-[40px] w-[40px]">
                <Image
                  src={client?.profile_image ?? ""}
                  alt={client?.display_name ?? "Unknown"}
                  width={40}
                  height={40}
                  objectFit="cover"
                  className="rounded-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-[4px]">
                <span className="font-monto text-[14px] font-medium">
                  {client?.display_name ?? "Unknown"}
                </span>
                <Chips>
                  <span className="font-monto text-[12px] font-medium leading-[18px]">
                    Speakers
                  </span>
                </Chips>
              </div>
            </div>

            <div className="flex items-center gap-[8px]">
              {/* Mute Button */}
              <ActionButton
                className="text-medium text-[14px] text-[#E34048]"
                onClick={() => handleTalkPermission(client._id)}
              >
                <MicIcon2 />
              </ActionButton>

              {/* Chat Button */}
              <ActionButton
                className="text-medium text-[14px] text-[#E34048]"
                onClick={() => handleMessagePermission(client._id)}
              >
                <ChatProfile />
              </ActionButton>

              {/* Kick Off Button */}
              <ActionButton
                className="text-medium text-[14px] text-[#E34048]"
                onClick={() => handleKickOff(client._id)}
              >
                Kick off
              </ActionButton>
            </div>
          </div>
        </PopoverDescription>
        {/* <PopoverClose>Close</PopoverClose> */}
      </PopoverContent>
    </Popover>
  );
};

export default UserWithPopover;
