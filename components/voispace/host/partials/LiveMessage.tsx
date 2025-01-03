import React from "react";
import Image from "next/image";

interface LiveMessageProps {
  user: any;
  message?: any;
}

const LiveMessage: React.FC<LiveMessageProps> = ({ user, message }) => {
  return (
    <div className="flex items-center gap-[16px] py-[8px] text-white">
      <div className="relative">
        <Image
          src={user.imageURL}
          alt={user.name}
          width={40}
          height={40}
          objectFit="cover"
          className="rounded-full object-cover"
        />
        <span className="absolute bottom-[0px] right-[0px] flex h-[12px] w-[12px] rounded-[50%] border-2 border-black bg-[#30D158]"></span>
      </div>

      <div className="flex flex-col gap-[4px]">
        <span className="flex items-center gap-[4px]">
          <span className="text-[14px] font-semibold text-white">
            Hala Yasmin
          </span>
          <span className="text-[11px] font-medium text-white opacity-[0.5]">
            Just now
          </span>
        </span>

        <span className="text-[12px] font-medium text-white">
          Hello and welcome to the room by traders world.
        </span>
        <span className="text-[11px] font-semibold text-white opacity-[0.5]">
          Reply
        </span>
      </div>
    </div>
  );
};

export default LiveMessage;
