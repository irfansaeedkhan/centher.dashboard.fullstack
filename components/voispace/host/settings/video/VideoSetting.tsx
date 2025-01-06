import React from "react";
import DropdownSelect from "@/components/voispace/host/ui/DropdownSelect";

interface VideoSettingProps {}

const VideoSetting: React.FC<VideoSettingProps> = ({}) => {
  const cameras = ["Facetime HD Camera", "Internal Camera ( Build-in )"];
  const resoultions = [
    "Auto",
    "Standerd definition (320p)",
    "High definition (720p)",
  ];

  return (
    <div className="flex flex-col gap-[32px] text-white">
      <div className="flex flex-col gap-[10px]">
        <span className="text-[14px] font-medium leading-[36px]">Camera</span>
        <div className="flex items-center justify-between gap-[16px]">
          <DropdownSelect options={cameras} />
          <span className="text-[14px] font-medium leading-[36px] text-gray-shade-24">
            Camera is Off
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <span className="text-[14px] font-medium leading-[36px]">
          Resoultion miximum
        </span>
        <div className="flex items-center justify-between gap-[16px]">
          <DropdownSelect options={resoultions} />
          <span className="text-[14px] font-medium leading-[36px] text-gray-shade-24">
            Video Lighting
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoSetting;
