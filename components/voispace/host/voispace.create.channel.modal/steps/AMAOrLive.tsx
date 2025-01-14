import React from "react";
import { clsx } from "clsx";
import { Room } from "../voispace.create.channel.modal";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";

const AMAOrLive = ({
  formState,
  handleInputChange,
}: {
  formState: Room;
  handleInputChange: Function;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-xl font-medium text-white">
        Dive into <span className="text-gradient-1">VoiceSpace</span>
      </div>
      <div className="flex flex-col gap-4">
        <div
          onClick={() => handleInputChange("type", BroadcastTypeEnum.AMA)}
          className={clsx(
            "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
            formState.type === BroadcastTypeEnum.AMA && "gradient-borders-div"
          )}
        >
          <div className="px-4 pt-3 text-base font-medium text-white">AMA</div>
          <div className="px-4 pb-3 text-sm text-[#A0A4BB]">
            Explore the endless possibilities of conversation
          </div>
        </div>
        <div
          onClick={() => handleInputChange("type", BroadcastTypeEnum.LIVE)}
          className={clsx(
            "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
            formState.type === BroadcastTypeEnum.LIVE && "gradient-borders-div"
          )}
        >
          <div className="px-4 pt-3 text-base font-medium text-white">Live</div>
          <div className="px-4 pb-3 text-sm text-[#A0A4BB]">
            Engage in real-time discussions, ask and experience
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMAOrLive;
