import React, { useEffect, useState } from "react";
import { ChatProfile, GrabIcon, MicIcon2, ShareWhiteIcon } from "@/assets/svgs";
import HostModalHeader from "@/components/voispace/host/partials/HostModalHeader";
import ActionButton from "./ui/ActionButton";
import UserWithPopover from "./partials/UserWithPopover";
import { useStream } from "@/hooks/stream/use.core";
import toast from "react-hot-toast";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { ICentalkBroadcast } from "@/hooks/stream/cen-talk";
import ClientCardView from "../shared/profile";
import Image from "next/image";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => any;
  roomData?: ICentalkBroadcast;
}

const TheRoomOfTraders: React.FC<DynamicProps> = ({
  onClose,
  setComponentName,
  roomData,
}) => {
  // TODO : loader should be removed and replaced with actual data sent from the useSubscribeToCurrentStream
  const [loader, setLoader] = useState(true);
  const { amaAgent, useSubscribeToCurrentStream, useSubscribeToSpeakers } =
    useStream();
  const {
    invite,
    toggleMemberTalkPermission,
    toggleMessagePermission,
    kickUser,
    toggleMute,
    leave,
    requestToTalk,
    globalIsOwner,
  } = amaAgent;

  const currentStream = useSubscribeToCurrentStream(
    roomData?.id || "",
    roomData?.type === "AMA" ? BroadcastTypeEnum.AMA : BroadcastTypeEnum.LIVE
  );

  const speakers = useSubscribeToSpeakers(roomData?.id || "");

  // const handleInvite = async () => {
  //   try {
  //     const users = ["user1", "user2"]; // Replace with dynamic user IDs
  //     invite(users);
  //     toast.success("Users have been invited.");
  //   } catch (error) {
  //     console.error("Failed to invite users:", error);
  //     toast.error("Failed to invite users.");
  //   }
  // };

  const handleToggleTalkPermission = async (userId: string) => {
    try {
      toggleMemberTalkPermission(userId);
      toast.success("Toggled member talk permission.");
    } catch (error) {
      console.error("Failed to toggle talk permission:", error);
      toast.error("Failed to toggle talk permission.");
    }
  };

  const handleToggleMessagePermission = async (userId: string) => {
    try {
      toggleMessagePermission(userId);
      toast.success("Toggled message permission.");
    } catch (error) {
      console.error("Failed to toggle message permission:", error);
      toast.error("Failed to toggle message permission.");
    }
  };

  const handleKickUser = async (userId: string) => {
    try {
      kickUser(userId);
      toast.success("User has been kicked.");
    } catch (error) {
      console.error("Failed to kick user:", error);
      toast.error("Failed to kick user.");
    }
  };

  const handleToggleMute = () => {
    try {
      toggleMute();
      toast.success("Toggled mute/unmute.");
    } catch (error) {
      console.error("Failed to toggle mute:", error);
      toast.error("Failed to toggle mute.");
    }
  };
  const handleRequestToTalk = (request: boolean) => {
    try {
      requestToTalk(request);
      toast.success("Request to talk sent.");
    } catch (error) {
      console.error("Failed to send Request to talk", error);
      toast.error("Failed to send Request to talk");
    }
  };

  const handleLeaveRoom = () => {
    try {
      leave();
      toast.success("You have left the room.");
      onClose();
    } catch (error) {
      console.error("Failed to leave the room:", error);
      toast.error("Failed to leave the room.");
    }
  };

  return (
    <div className="h-full px-[24px] py-[24px] text-white">
      <div className="flex h-full flex-col gap-[42px]">
        <HostModalHeader
          subTitle="Voispace"
          title="The Room of Traders"
          onClose={onClose}
          hasBackButton={true}
          onBack={() => null}
        >
          <button
            className="font-monto text-[14px] font-medium text-[#E34048]"
            onClick={handleLeaveRoom}
          >
            Finish
          </button>
        </HostModalHeader>

        {/* Hosts Section */}
        <div className="flex flex-col gap-[24px]">
          <div className="flex max-w-[83px] flex-col gap-[2px]">
            <span className="text-[14px]">Host</span>
          </div>
          <div className="flex flex-wrap gap-[28px]">
            {loader ? (
              <div className={`flex flex-col items-center gap-4`}>
                <div className="relative h-2 w-16 animate-pulse rounded-md bg-gray-700" />
                <div className="relative h-10 w-10 animate-pulse rounded-full bg-gray-700" />
                <div className="relative h-4 w-16 animate-pulse rounded-md bg-gray-700" />
              </div>
            ) : (
              currentStream &&
              currentStream?.hosts?.map((host: any, index) => (
                <div key={index}>
                  <ClientCardView
                    name={host.user?.display_name ?? "Unknown"}
                    imageURL={host.user?.profile_image ?? ""}
                    isApproved={host.user?.membership?.status === "citizen"}
                    isSpeaking={true}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Speakers Section */}
        <div className="flex flex-col gap-[24px]">
          <div className="flex max-w-[83px] flex-col gap-[2px]">
            <span className="text-[14px]">Speakers</span>
            <span className="rounded-[1000px] bg-[#141416] p-[8px] text-[12px]">
              <span className="text-[#FAFAFA]">{speakers?.length}</span>
              <span>&nbsp;</span>
              <span className="text-gray-shade-24">speaker(s)</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-[28px]">
            {loader
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-700"></div>
                    <div className="relative h-3 w-16 animate-pulse rounded-md bg-gray-700" />
                  </div>
                ))
              : speakers &&
                speakers?.map((speaker: any, index: number) => (
                  <div key={index}>
                    <UserWithPopover
                      client={speaker}
                      handleKickOff={handleKickUser}
                      handleTalkPermission={handleToggleTalkPermission}
                      handleMessagePermission={handleToggleMessagePermission}
                    />
                  </div>
                ))}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="absolute bottom-0 left-0 m-6 flex min-h-[70px] w-[calc(100%-48px)] items-center rounded-[24px] border border-[#32343C] bg-[#141416] p-[16px] text-white">
          <div className="flex w-[100%] justify-between">
            <div className="flex gap-[10px]">
              {/* Chat Button */}
              <ActionButton
                text="Chat"
                className="text-medium relative text-[14px] text-[#E34048]"
                onClick={() => setComponentName("ChatRoom")}
              >
                <ChatProfile />
                <div className="absolute -top-1 right-0 h-3 w-3 rounded-full bg-gradient" />
              </ActionButton>

              {/* Share Button */}
              <ActionButton
                text="Share"
                className="text-medium text-[14px] text-[#E34048]"
                onClick={() => setComponentName("InvitetoRoom")}
              >
                <ShareWhiteIcon />
              </ActionButton>
            </div>

            {/* //TODO add number of requests in it */}
            <div className="flex items-center gap-[10px]">
              {globalIsOwner && (
                <ActionButton
                  className="text-medium text-[14px] text-[#E34048]"
                  onClick={() => setComponentName("Requests")}
                >
                  <GrabIcon />
                  <span className="font-monto text-[11px] font-medium leading-[13px] tracking-[-0.4px]">
                    9
                  </span>
                </ActionButton>
              )}

              {/* //TODO add image of first two participants */}
              <ActionButton
                className="text-medium text-[14px] text-[#E34048]"
                onClick={() => setComponentName("Participators")}
              >
                <div className="relative h-[20px] w-[40px]">
                  <Image
                    src="/images/profiles/Profile-0.svg"
                    alt="Test"
                    width={20}
                    height={20}
                    className="absolute left-0 top-0 z-0 h-5 w-5"
                  />
                  <Image
                    src="/images/profiles/Profile-1.svg"
                    alt="Test"
                    width={20}
                    height={20}
                    className="z-1 absolute left-[50%] top-0 h-5 w-5 -translate-x-1/2 transform"
                  />
                </div>
                <span className="font-monto text-[11px] font-medium leading-[13px] tracking-[-0.4px]">
                  {speakers?.length + currentStream?.hosts?.length}
                </span>
              </ActionButton>

              {/* //TODO */}
              {/* TODO change text when user send the request to request sent and remove it if he has permission to speak */}
              {!globalIsOwner && (
                <ActionButton
                  className="text-medium hidden text-[14px] text-[#E34048] md:flex"
                  onClick={() => handleRequestToTalk(true)}
                >
                  <span className="font-monto text-[11px] font-medium leading-[13px] tracking-[-0.4px]">
                    Request to speak
                  </span>
                </ActionButton>
              )}

              {/* Mute Button */}
              <ActionButton
                text="Mute"
                className="text-medium text-[14px] text-[#E34048]"
                onClick={handleToggleMute}
              >
                <MicIcon2 />
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheRoomOfTraders;
