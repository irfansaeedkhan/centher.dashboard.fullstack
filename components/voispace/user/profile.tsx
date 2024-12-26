import React from "react";
import Image from "next/image";
import { VipIcon, MicIcon } from "@/assets/svgs";

interface UserProfileCard {
  imageURL: string;
  name: string;
  isApproved: boolean;
  isSpeaking: boolean;
}

const UserProfileCard: React.FC<UserProfileCard> = ({
  isApproved,
  imageURL,
  name,
  isSpeaking,
}) => {
  return (
    <div className="flex w-[64px] flex-col gap-[8px]">
      <div className="relative">
        <Image
          className="rounded-full"
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

        {isSpeaking && (
          <span className="absolute right-[-5px] top-0 rounded-full">
            <MicIcon />
          </span>
        )}
      </div>

      <span className="text-center font-monto text-[14px] font-semibold">
        {name}
      </span>
    </div>
  );
};

export default UserProfileCard;
