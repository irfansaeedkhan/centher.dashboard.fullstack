import React from "react";
import { clsx } from "clsx";

const AMAOrLive = ({ formState, handleInputChange }: any) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-xl font-medium text-white">
        Dive into <span className="text-gradient-1">VoiceSpace</span>
      </div>
      <div className="flex flex-col gap-4">
        <div
          onClick={() => handleInputChange("roomType", "AMA")}
          className={clsx(
            "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
            formState.roomType === "AMA" && "gradient-borders-div"
          )}
        >
          <div className="px-4 pt-2 text-base font-medium text-white">AMA</div>
          <div className="px-4 pb-2 text-sm text-[#A0A4BB]">
            Ask Me Anything
          </div>
        </div>
        <div
          onClick={() => handleInputChange("roomType", "Live")}
          className={clsx(
            "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
            formState.roomType === "Live" && "gradient-borders-div"
          )}
        >
          <div className="px-4 pt-2 text-base font-medium text-white">Live</div>
          <div className="px-4 pb-2 text-sm text-[#A0A4BB]">
            Real-time Discussions
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMAOrLive;
