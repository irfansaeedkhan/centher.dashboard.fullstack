import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChatProfile, MicIcon2, ShareWhiteIcon } from "@/assets/svgs";
import HostModalHeader from "@/components/voispace/host/partials/HostModalHeader";
import ActionButton from "./ui/ActionButton";
import UserWithPopover from "./partials/UserWithPopover";
import { useStream } from "@/hooks/stream/use.core";
import toast from "react-hot-toast";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { ICentalkBroadcast } from "@/hooks/stream/cen-talk";

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
  const { amaAgent, useSubscribeToCurrentStream } = useStream();
  const {
    invite,
    toggleMemberTalkPermission,
    toggleMessagePermission,
    kickUser,
    toggleMute,
    leave,
  } = amaAgent;

  const [streamData, setStreamData] = useState<any>(null);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [hosts, setHosts] = useState<any[]>([]);

  const currentStream = useSubscribeToCurrentStream(
    roomData?.id || "",
    roomData?.type === "AMA" ? BroadcastTypeEnum.AMA : BroadcastTypeEnum.LIVE
  );

  // Fetch current stream data
  useEffect(() => {
    if (currentStream && Object.keys(currentStream).length > 0) {
      console.log("Current Stream Data:", currentStream);

      // Update state only if the data is valid
      setStreamData(currentStream);
      setHosts(currentStream.hosts || []);
      setSpeakers(
        currentStream.latestParticipants?.filter(
          (participant: any) => participant.type === "SPEAKER"
        ) || []
      );
    } else if (currentStream === null) {
      console.warn("Current stream data is null or empty.");
    }
  }, [currentStream]);

  const handleInvite = async () => {
    try {
      const users = ["user1", "user2"]; // Replace with dynamic user IDs
      invite(users);
      toast.success("Users have been invited.");
    } catch (error) {
      console.error("Failed to invite users:", error);
      toast.error("Failed to invite users.");
    }
  };

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

  console.log("streamData::", streamData);
  console.log("hosts::", hosts);

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
            <span className="rounded-[1000px] bg-[#141416] p-[8px] text-[12px]">
              <span className="text-[#FAFAFA]">{hosts?.length}</span>
              <span>&nbsp;</span>
              <span className="text-gray-shade-24">host(s)</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-[28px]">
            {hosts.map((host: any, index) => (
              <div key={index}>
                <UserWithPopover client={host.user} />
              </div>
            ))}
          </div>
        </div>

        {/* Speakers Section */}
        <div className="flex flex-col gap-[24px]">
          <div className="flex max-w-[83px] flex-col gap-[2px]">
            <span className="text-[14px]">Speakers</span>
            <span className="rounded-[1000px] bg-[#141416] p-[8px] text-[12px]">
              <span className="text-[#FAFAFA]">{speakers.length}</span>
              <span>&nbsp;</span>
              <span className="text-gray-shade-24">speaker(s)</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-[28px]">
            {speakers.map((speaker: any, index) => (
              <div key={index}>
                <UserWithPopover client={speaker.user} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        {/* <div className="absolute bottom-0 left-0 m-6 flex min-h-[70px] w-[calc(100%-48px)] items-center rounded-[24px] border border-[#32343C] bg-[#141416] p-[16px] text-white"> */}
        <div className=" m-6 flex min-h-[70px]  items-center rounded-[24px] border border-[#32343C] bg-[#141416] p-[16px] text-white">
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
                onClick={handleInvite}
              >
                <ShareWhiteIcon />
              </ActionButton>
            </div>

            <div className="flex items-center gap-[10px]">
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
