import React, { useState } from "react";

import ModalContainer from "@/components/modal/modal-container";
import HostModalHeaderV2 from "@/components/voispace/host/partials/HostModalHeaderV2";
import AudioSetting from "@/components/voispace/host/settings/audio/AudioSetting";
import VideoSetting from "@/components/voispace/host/settings/video/VideoSetting";

import {
  ChatProfile,
  MicIcon,
  MicIcon2,
  VideoIcon2,
  ShareWhiteIcon,
  GrabIcon,
} from "@/assets/svgs";

interface SettingComponentInterface {
  onClose: () => void;
}

const SettingComponent: React.FC<SettingComponentInterface> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("Audio");

  const tabs = [
    {
      id: "Audio",
      label: (
        <>
          <MicIcon2 /> Audio
        </>
      ),
      component: <AudioSetting />,
    },
    {
      id: "Video",
      label: (
        <>
          <VideoIcon2 /> Video
        </>
      ),
      component: <VideoSetting />,
    },
  ];

  const activeComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <ModalContainer
      modalId="host-settings"
      onClose={onClose}
      isOpen={true}
      modalContentClassName="max-w-[100%] h-[100%] md:h-auto md:max-w-[861px] min-h-[645px] p-0 md:rounded-3xl"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={false}
    >
      <div className="h-full">
        <HostModalHeaderV2
          title="Settings"
          subTitle="Host"
          onClose={onClose}
          onBack={onClose}
        />

        <div className="flex h-[558px]">
          {/* Sidebar */}
          <div className="w-[208px] border-r border-[#1F1F1F] py-4 text-white">
            <ul>
              {tabs.map((tab) => (
                <li
                  key={tab.id}
                  onClick={() => {
                    console.log("Switching to tab:", tab.id);
                    setActiveTab(tab.id);
                  }}
                  className={`flex cursor-pointer gap-[12px] py-[10px] pl-[24px] text-[14px] font-medium leading-[22px] ${
                    activeTab === tab.id ? "bg-[#212228]" : "hover:bg-[#212228]"
                  }`}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div className="flex-1 px-[32px] py-[26px] text-white">
            <div>{activeComponent || "No content available"}</div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default SettingComponent;
