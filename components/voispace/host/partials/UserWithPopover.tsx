import React, { useEffect, useState } from "react";
import Image from "next/image";

import {
  LoaderSpinner,
  MutedChat,
  MutedMic,
  UnmutedChat,
  UnmutedMic,
} from "@/assets/svgs";

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

interface UserWithPopoverProps {
  client: any;
  handleKickOff: (userId: string) => void;
  handleTalkPermission: (userId: string) => void;
  handleMessagePermission: (userId: string) => void;
  mode: "admin" | "participant";
}

const UserWithPopover: React.FC<UserWithPopoverProps> = ({
  client,
  handleKickOff,
  handleTalkPermission,
  handleMessagePermission,
  mode,
}) => {
  const [kickLoader, setKickLoader] = useState<boolean>(false);
  const [muteLoader, setMuteLoader] = useState<boolean>(false);
  const [chatPermLoader, setChatPermLoader] = useState<boolean>(false);

  const handleKickOffLocal = () => {
    setKickLoader(true);
    handleKickOff(client.user._id);
  };

  const handleTalkPermissionLocal = () => {
    setMuteLoader(true);
    handleTalkPermission(client.user._id);
  };

  const handleMessagePermissionlocal = () => {
    setChatPermLoader(true);
    handleMessagePermission(client.user._id);
  };

  useEffect(() => {
    if (client) {
      setChatPermLoader(false);
    }
  }, [client.hasPermissionToMessage]);

  useEffect(() => {
    if (client && client.type == "LISTENER") {
      setMuteLoader(false);
    }
  }, [client.type]);

  return (
    <Popover placement="top">
      <PopoverTrigger>
        <ClientCardView
          name={client.user?.display_name ?? "Unknown"}
          imageURL={client.user?.profile_image ?? ""}
          isApproved={client.user?.membership?.status == "citizen"}
          isSpeaking={client?.type == "SPEAKER"}
          position={client?.type}
        />
      </PopoverTrigger>
      {mode == "admin" && (
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
                    src={client.user?.profile_image ?? ""}
                    alt={client.user?.display_name ?? "Unknown"}
                    width={40}
                    height={40}
                    objectFit="cover"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-[4px]">
                  <span className="font-monto text-[14px] font-medium">
                    {client.user?.display_name ?? "Unknown"}
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
                {muteLoader ? (
                  <LoaderSpinner className="inline-block h-4 w-4 animate-spin" />
                ) : (
                  client?.type == "SPEAKER" && (
                    <ActionButton
                      className="text-medium text-[14px] text-[#E34048]"
                      onClick={handleTalkPermissionLocal}
                    >
                      <MutedMic />
                    </ActionButton>
                  )
                )}

                {/* Chat Button */}
                {chatPermLoader ? (
                  <LoaderSpinner className="inline-block h-4 w-4 animate-spin" />
                ) : (
                  <ActionButton
                    className="text-medium text-[14px] text-[#E34048]"
                    onClick={handleMessagePermissionlocal}
                  >
                    {client.hasPermissionToMessage ? (
                      <UnmutedChat />
                    ) : (
                      <MutedChat />
                    )}
                  </ActionButton>
                )}

                {/* Kick out Button */}
                {kickLoader ? (
                  <LoaderSpinner className="inline-block h-4 w-4 animate-spin" />
                ) : (
                  <ActionButton
                    className="text-medium text-[14px] text-[#E34048]"
                    onClick={handleKickOffLocal}
                  >
                    Kick out
                  </ActionButton>
                )}
              </div>
            </div>
          </PopoverDescription>

          {/* <PopoverClose>Close</PopoverClose> */}
        </PopoverContent>
      )}
    </Popover>
  );
};

export default UserWithPopover;
