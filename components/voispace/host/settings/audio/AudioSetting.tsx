import React from "react";
import DropdownSelect from "@/components/voispace/host/ui/DropdownSelect";
import AudioProgressBar from "@/components/voispace/host/settings/AudioProgressBar";

interface AudioSettingProps {}

const AudioSetting: React.FC<AudioSettingProps> = ({}) => {
  const options = [
    "Default- Internal Microphone ( Build-in )",
    "Internal Microphone ( Build-in )",
  ];
  const speakers = [
    "Default- Internal Speakers ( Build-in )",
    "Internal Speakers ( Build-in )",
  ];

  return (
    <div className="flex flex-col gap-[32px] text-white">
      <div className="flex flex-col gap-[10px]">
        <span className="text-[14px] font-medium leading-[36px]">
          Microphone
        </span>
        <div className="flex items-center justify-between gap-[16px]">
          <DropdownSelect options={options} />
          <AudioProgressBar />
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <span className="text-[14px] font-medium leading-[36px]">Speakers</span>
        <div className="flex items-center justify-between gap-[16px]">
          <DropdownSelect options={speakers} />
          {/* <AudioProgressBar /> */}
          <span className="text-[14px] font-medium leading-[36px] text-[#A8ABBB]">
            Micorphone is Off
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioSetting;
