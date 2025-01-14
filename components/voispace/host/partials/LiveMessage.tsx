import React from "react";
import Image from "next/image";
import { BroadcastMessage } from "@/hooks/stream/dto/broadcast-inffo.dto";

interface LiveMessageProps {
  message: BroadcastMessage;
}

const LiveMessage: React.FC<LiveMessageProps> = ({ message }) => {
  const getTimeLapsed = (date: Date | string): string => {
    date = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "just now";
    }
  };

  return (
    <div className="flex gap-3">
      <div className="relative flex h-10 w-10 shrink-0">
        <Image
          src={message.sender.profile_image}
          alt={message.sender.display_name}
          width={48}
          height={48}
          className="h-full w-full rounded-full"
        />
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#141416] bg-green-500" />
      </div>

      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">
            {message.sender.display_name}
          </span>

          <span className="text-xs text-white/50">
            {getTimeLapsed(message.createdAt)}
          </span>
        </div>
        <p className="overflow-wrap white-space w-[72vw] break-words text-xs text-[#FAFAFA] flg:w-[40vw]">
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default LiveMessage;
