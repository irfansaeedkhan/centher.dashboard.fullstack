import React from "react";
import Image from "next/image";

import { VipIcon, MicIcon, SmMutedMicIcon, SmMicIcon } from "@/assets/svgs";
import { CurrentUserContainer } from "./ChannelMainView";

interface UserProfileCard {
  imageURL: string;
  name: string;
  isApproved: boolean;
  isSpeaking: boolean;
  position?: string;
  className?: string;
  currentUserContainer: CurrentUserContainer;
}

const UserProfileCard: React.FC<UserProfileCard> = ({
  isApproved,
  imageURL,
  name,
  isSpeaking,
  position,
  currentUserContainer,
  className = "w-[74px]",
}) => {
  return (
    <div className={`flex flex-col items-center gap-[8px] ${className}`}>
      <div className="relative">
        <Image
          className="h-16 w-16 rounded-full object-cover "
          src={imageURL}
          alt="profile"
          height={64}
          width={64}
        />
        {isApproved && (
          <span className="absolute bottom-0 right-[-6px] rounded-full bg-[#1C1C1E]">
            <VipIcon />
          </span>
        )}

        {/* {isSpeaking && (
          <span className="absolute right-[-5px] top-0 rounded-full">
            <MicIcon />
          </span>
        )}
        <span className="absolute right-[-5px] top-0 rounded-full">
          <SmMicIcon />
          <SmMutedMicIcon />
        </span> */}

        {(currentUserContainer?.currentUser?.type == "SPEAKER" ||
          currentUserContainer?.currentUser?.type == "HOST") &&
          !currentUserContainer?.currentUser?.isMuted && (
            <span className="absolute right-[-5px] top-0 rounded-full">
              <SmMicIcon />
            </span>
          )}
        {(currentUserContainer?.currentUser?.type == "SPEAKER" ||
          currentUserContainer?.currentUser?.type == "HOST") &&
          currentUserContainer?.currentUser?.isMuted && (
            <span className="absolute right-[-5px] top-0 rounded-full">
              <SmMutedMicIcon />
            </span>
          )}
      </div>

      <span className="text-center font-monto text-xs font-semibold">
        {name}
      </span>

      {position && (
        <span className="rounded-[1000px] bg-[#141416] p-[8px] text-center font-monto text-[12px] font-medium text-gray-shade-24">
          {position}
        </span>
      )}
    </div>
  );
};

export default UserProfileCard;
