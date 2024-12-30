import React from "react";
import ClientCardView from "./../../shared/profile";
import ActionButton from "./../ui/ActionButton";
import Chips from "./../ui/Chips";
import Image from "next/image";
import { ChatProfile, MicIcon2 } from "@/assets/svgs";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
  PopoverClose,
} from "./../ui/Popover";

interface UserProfileCard {
  imageURL: string;
  name: string;
  isApproved: boolean;
  isSpeaking: boolean;
}

interface UserWithPopoverProps {
  client: UserProfileCard;
}

const UserWithPopover: React.FC<UserWithPopoverProps> = ({ client }) => {
  return (
    <Popover placement="top">
      <PopoverTrigger>
        <ClientCardView
          name={client.name}
          imageURL={client.imageURL}
          isApproved={client.isApproved}
          isSpeaking={client.isSpeaking}
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
                  src={client.imageURL}
                  alt={client.name}
                  width={40}
                  height={40}
                  objectFit="cover"
                  className="rounded-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-[4px]">
                <span className="font-monto text-[14px] font-medium">
                  Hala Yasmin
                </span>
                <Chips>
                  <span className="font-monto text-[12px] font-medium leading-[18px]">
                    Speakers
                  </span>
                </Chips>
              </div>
            </div>

            <div className="flex items-center gap-[8px]">
              <ActionButton className="text-medium text-[14px] text-[#E34048]">
                <MicIcon2 />
              </ActionButton>

              <ActionButton className="text-medium text-[14px] text-[#E34048]">
                <ChatProfile />
              </ActionButton>

              <span>Kick off</span>
            </div>
          </div>
        </PopoverDescription>
        {/* <PopoverClose>Close</PopoverClose> */}
      </PopoverContent>
    </Popover>
  );
};

export default UserWithPopover;
