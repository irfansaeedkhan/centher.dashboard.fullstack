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
import { toast } from "react-hot-toast";
import { useStream } from "@/hooks/stream/use.core";
import useGetUser from "@/hooks/use.get.user";

interface UserProfileCard {
  id: string; // Assuming each user has a unique ID
  imageURL: string;
  name: string;
  isApproved: boolean;
  isSpeaking: boolean;
}

interface UserWithPopoverProps {
  client: UserProfileCard;
}

const UserWithPopover: React.FC<UserWithPopoverProps> = ({ client }) => {
  const { amaAgent } = useStream();
  const { kickUser } = amaAgent;
  // get user details :
  const { user } = useGetUser(client.id);
  console.log("user::", user, client.id);
  const handleKickOff = async () => {
    try {
      await kickUser(client.id);
      toast.success(`User ${client.name} has been kicked.`);
    } catch (error) {
      console.error("Failed to kick user:", error);
      toast.error(`Failed to kick user ${client.name}.`);
    }
  };

  return (
    <Popover placement="top">
      <PopoverTrigger>
        <ClientCardView
          name={user?.display_name ?? "Unknown"}
          imageURL={user?.profile_image ?? ""}
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
                  src={user?.profile_image ?? ""}
                  alt={user?.display_name ?? "Unknown"}
                  width={40}
                  height={40}
                  objectFit="cover"
                  className="rounded-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-[4px]">
                <span className="font-monto text-[14px] font-medium">
                  {user?.display_name ?? "Unknown"}
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
              <ActionButton className="text-medium text-[14px] text-[#E34048]">
                <MicIcon2 />
              </ActionButton>

              {/* Chat Button */}
              <ActionButton className="text-medium text-[14px] text-[#E34048]">
                <ChatProfile />
              </ActionButton>

              {/* Kick Off Button */}
              <ActionButton
                className="text-medium text-[14px] text-[#E34048]"
                onClick={handleKickOff}
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
