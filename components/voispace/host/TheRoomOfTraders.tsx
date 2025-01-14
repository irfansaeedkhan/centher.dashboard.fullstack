import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";

import { useStream } from "@/hooks/stream/use.core";
import { ICentalkBroadcast } from "@/hooks/stream/cen-talk";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";
import HostModalHeader from "@/components/voispace/host/partials/HostModalHeader";
import {
  CancelSpeechIcon,
  GrabIcon,
  MutedChat,
  MutedMic,
  ShareWhiteIcon,
  SpeechIcon,
  UnmutedChat,
  UnmutedMic,
} from "@/assets/svgs";

import ClientCardView from "../shared/profile";
import ActionButton from "./ui/ActionButton";
import UserWithPopover from "./partials/UserWithPopover";
import { Room } from "./voispace.create.channel.modal/voispace.create.channel.modal";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => any;
  roomData: Room;
  unreadMessages: number;
}

const TheRoomOfTraders: React.FC<DynamicProps> = ({
  onClose,
  setComponentName,
  roomData,
  unreadMessages,
}) => {
  const {
    amaAgent,
    useSubscribeToCurrentStream,
    useSubscribeToSpeakers,
    useSubscribeToCurrentUser,
  } = useStream();

  const {
    toggleMemberTalkPermission,
    toggleMessagePermission,
    kickUser,
    toggleMute,
    leave,
    requestToTalk,
    globalIsOwner,
    userId,
  } = amaAgent;
  const { stream: currentStream, loader } = useSubscribeToCurrentStream(
    roomData?.id || "",
    roomData?.type === "AMA" ? BroadcastTypeEnum.AMA : BroadcastTypeEnum.LIVE
  );

  const { data: speakers, loader: speakersLoader } = useSubscribeToSpeakers(
    roomData?.id || ""
  );

  const showInvitePeople =
    roomData?.accessMode == StreamAccessModeEnum.ACCESS_BY_INVITATION &&
    globalIsOwner;

  const { loader: currentUserLoader, currentUser } = useSubscribeToCurrentUser(
    roomData?.id || "",
    userId || ""
  );

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
    } catch (error) {
      console.error("Failed to leave the room:", error);
      toast.error("Failed to leave the room.");
    }
  };

  return (
    <div className="h-full  px-6 py-6 text-white mobile-max:px-4">
      <div className="flex h-full flex-col gap-[42px]">
        <HostModalHeader
          subTitle="Voispace"
          title="The Room of Traders"
          onClose={handleLeaveRoom}
          onBack={() => null}
          hasBackButton={true}
        >
          <button
            className="font-monto text-[14px] font-medium text-[#E34048]"
            onClick={handleLeaveRoom}
          >
            Finish
          </button>
        </HostModalHeader>

        {/* Hosts Section */}
        <div className="flex flex-col items-start gap-6">
          <div className="flex max-w-[90px] flex-col items-center gap-[2px]">
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
        <div className="flex flex-col items-start gap-6">
          <div className="flex max-w-[90px] flex-col items-start gap-[2px]">
            <span className="text-left text-[14px]">Speakers</span>
            <span className="rounded-[1000px] bg-[#141416] px-3 py-2 text-[12px]">
              <span className="text-[#FAFAFA]">{speakers?.length}</span>
              <span>&nbsp;</span>
              <span className="text-gray-shade-24">speaker(s)</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-9">
            {speakersLoader
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
                      mode={globalIsOwner ? "admin" : "participant"}
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
        <div className="absolute bottom-3 left-1/2 flex min-h-[70px] w-[calc(100%-48px)] -translate-x-1/2 items-center rounded-2xl border border-[#32343C] bg-[#141416] p-[16px] text-white mobile-max:w-[calc(100%-36px)]">
          {!currentUserLoader ? (
            <div className="flex w-[100%] justify-between">
              <div className="flex gap-[10px]">
                {/* Chat Button */}
                {currentUser?.hasPermissionToMessage ? (
                  <ActionButton
                    text="Chat"
                    className="text-medium relative text-[14px] text-[#E34048]"
                    onClick={() => setComponentName("ChatRoom")}
                  >
                    <UnmutedChat />
                    <h6 className="font-monto text-xs font-medium">Chat</h6>
                    {(unreadMessages ?? 0) > 0 && (
                      <div className="absolute -top-1 right-0 h-3 w-3 rounded-full bg-gradient" />
                    )}
                  </ActionButton>
                ) : (
                  <ActionButton
                    text="Chat"
                    className="text-medium relative cursor-not-allowed opacity-30"
                    onClick={() => null}
                  >
                    <MutedChat />
                    <h6 className="font-monto text-xs font-medium">Chat</h6>
                  </ActionButton>
                )}

                {/* Share Button */}
                {showInvitePeople && (
                  <ActionButton
                    text="Share"
                    className="text-medium text-[14px] text-[#E34048]"
                    onClick={() => setComponentName("InvitetoRoom")}
                  >
                    <ShareWhiteIcon />
                  </ActionButton>
                )}
              </div>

              <div className="flex items-center gap-[10px]">
                {globalIsOwner && (
                  <ActionButton
                    className="text-medium relative text-[14px]"
                    onClick={() => setComponentName("Requests")}
                  >
                    <div className="flex h-5 items-center justify-center  gap-[10px]">
                      <GrabIcon />
                      <span className="font-monto text-xs font-medium leading-[13px] tracking-[-0.4px]">
                        {currentStream?.hasTalkRequestUsers?.aggregate?.count}
                      </span>
                      {(currentStream?.hasTalkRequestUsers?.aggregate?.count ??
                        0) > 0 && (
                        <div className="absolute -top-1 right-0 h-3 w-3 rounded-full bg-gradient" />
                      )}
                    </div>
                  </ActionButton>
                )}

                <ActionButton
                  className="text-medium flex items-center text-[14px]"
                  onClick={() => setComponentName("Participators")}
                >
                  <div
                    className={clsx(
                      `relative flex h-5 items-center justify-center px-1`,
                      currentStream?.latestParticipants &&
                        currentStream.latestParticipants.length > 0 &&
                        " min-w-10 px-2"
                    )}
                  >
                    {currentStream?.latestParticipants &&
                    currentStream.latestParticipants.length > 0 ? (
                      currentStream?.latestParticipants.map(
                        (participant: any, index: number) => (
                          <Image
                            key={index}
                            src={participant.user.profile_image}
                            alt={participant.user.display_name}
                            width={20}
                            height={20}
                            className={clsx(
                              `absolute left-0 top-0 z-0 h-5 w-5 rounded-full object-cover`
                            )}
                            style={{ left: `${index * 10}px` }}
                          />
                        )
                      )
                    ) : (
                      <FaUser className="text-sm text-[#FAFAFA]" />
                    )}
                  </div>
                  {/* {(currentStream?.participatorsCount?.aggregate?.count ?? 0) >
                    0 && (
                    <span className="font-monto text-xs font-medium leading-[13px] tracking-[-0.4px]">
                      {currentStream?.participatorsCount?.aggregate?.count}
                    </span>
                  )} */}
                  <span className="font-monto text-xs font-medium leading-[13px] tracking-[-0.4px]">
                    {currentStream?.participatorsCount?.aggregate?.count}
                  </span>
                </ActionButton>

                {!globalIsOwner &&
                  currentUser?.type == "LISTENER" &&
                  !currentUser?.hasTalkRequest && (
                    <ActionButton
                      className="text-medium flex text-[14px] text-[#E34048]"
                      onClick={() => handleRequestToTalk(true)}
                    >
                      <span className="hidden h-5 items-center justify-center font-monto text-xs font-medium leading-[13px] tracking-[-0.4px] flg:flex">
                        Request to speak
                      </span>
                      <SpeechIcon className="block flg:hidden" />
                    </ActionButton>
                  )}

                {!globalIsOwner &&
                  currentUser?.type == "LISTENER" &&
                  currentUser?.hasTalkRequest && (
                    <ActionButton
                      className="text-medium flex text-[14px] text-[#E34048]"
                      onClick={() => handleRequestToTalk(false)}
                    >
                      <span className="hidden h-5 items-center justify-center font-monto text-xs font-medium leading-[13px] tracking-[-0.4px] flg:flex">
                        Cancel Request
                      </span>
                      <CancelSpeechIcon className="block flg:hidden" />
                    </ActionButton>
                  )}

                {/* Mute Button */}
                {currentUser?.type == "SPEAKER" && !currentUser?.isMuted && (
                  <ActionButton text="Mute" onClick={handleToggleMute}>
                    <UnmutedMic />
                  </ActionButton>
                )}
                {currentUser?.type == "SPEAKER" && currentUser?.isMuted && (
                  <ActionButton text="Unmute" onClick={handleToggleMute}>
                    <MutedMic />
                  </ActionButton>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 p-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-[#212228]"></div>
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-14 animate-pulse rounded-full bg-[#212228]" />
                <div className="relative h-8 w-18 animate-pulse rounded-full bg-[#212228]" />
                <div className="relative h-8 w-28 animate-pulse rounded-full bg-[#212228]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheRoomOfTraders;
