import React from "react";
import HostModalHeader from "./partials/HostModalHeader";
import {
  SendChatIcon,
  MicIcon,
  MicIcon2,
  VideoIcon2,
  EyeIcon,
} from "@/assets/svgs";
import { users } from "@/components/voispace/dummy.data/users.list";
import LiveMessage from "@/components/voispace/host/partials/LiveMessage";
import DropdownButton from "@/components/voispace/host/ui/DropdownButton";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => string;
}

const LiveView: React.FC<DynamicProps> = ({ onClose, setComponentName }) => {
  const leaveHandler = () => {
    alert("Leave");
  };

  const handleSelect = (value: string) => {
    console.log("Selected:", value);
    alert(`انتخاب شد: ${value}`);
  };

  return (
    <div className="relative flex flex-col">
      <div className="flex flex-col gap-[27px] px-[24px] py-[24px]">
        <HostModalHeader
          subTitle="Voispace"
          title="Your room for China networks coming to defi"
          onClose={onClose}
          onBack={() => setComponentName("Participators")}
        />

        <div className="absolute right-[24px] top-[24px]">
          <div className="flex items-center gap-[20px]">
            <div className="flex items-center gap-[6px]">
              <div className="flex h-[20px] w-[44px] items-center justify-center gap-[4px] rounded-[5px] bg-[#1C1D21] text-white">
                <span className="h-[8px] w-[8px] rounded-[50%] bg-[#FF453A]"></span>
                <span className="font-monto text-[11px] font-medium">Live</span>
              </div>

              <div className="flex h-[20px] w-[44px] items-center justify-center gap-[2px] rounded-[5px] bg-[#1C1D21] text-white">
                <EyeIcon />
                <span className="font-monto text-[11px] font-medium">549</span>
              </div>
            </div>

            <button
              onClick={leaveHandler}
              className="font-monto text-[14px] font-medium text-[#E34048]"
            >
              Leave
            </button>
          </div>
        </div>
      </div>

      <div className="h-[100%] min-h-[645px] bg-[url('/images/live-room-bg.svg')]">
        <div className="flex h-[100%] min-h-[645px] flex-col justify-end px-[16px] py-[16px]">
          <div className="flex flex-col px-[8px]">
            {users.map((user, index) => {
              return <LiveMessage user={user} key={index} />;
            })}
          </div>

          <div className="mt-[50px] flex gap-[8px]">
            <div>
              <DropdownButton
                onSelect={handleSelect}
                dropdownContent={(onSelect) => (
                  <ul className="flex flex-col gap-[8px] p-[8px]">
                    <li
                      className="flex gap-[8px] rounded-[1000px] border border-[#32343C] bg-[#212228] px-[10px] py-[6px] text-[13px] font-medium"
                      onClick={() => onSelect("Item 1")}
                    >
                      <MicIcon />
                      Default- Internal audio...
                    </li>
                    <li
                      className="flex gap-[8px] rounded-[1000px] border border-[#32343C] bg-[#212228] px-[10px] py-[6px] text-[13px] font-medium"
                      onClick={() => onSelect("Item 1")}
                    >
                      <MicIcon />
                      Iphone 14 pro audio
                    </li>
                    <li
                      className="flex gap-[8px] rounded-[1000px] border border-[#32343C] bg-[#212228] px-[10px] py-[6px] text-[13px] font-medium"
                      onClick={() => onSelect("Item 1")}
                    >
                      View more settings
                    </li>
                  </ul>
                )}
              >
                <MicIcon2 />
              </DropdownButton>
            </div>
            <div>
              <DropdownButton
                onSelect={handleSelect}
                dropdownContent={(onSelect) => (
                  <ul className="flex flex-col gap-[8px] p-[8px]">
                    <li
                      className="flex gap-[8px] rounded-[1000px] border border-[#32343C] bg-[#212228] px-[10px] py-[6px] text-[13px] font-medium"
                      onClick={() => onSelect("Item 1")}
                    >
                      <MicIcon />
                      Default- Internal camera...
                    </li>
                    <li
                      className="flex gap-[8px] rounded-[1000px] border border-[#32343C] bg-[#212228] px-[10px] py-[6px] text-[13px] font-medium"
                      onClick={() => onSelect("Item 1")}
                    >
                      <MicIcon />
                      Iphone 14 pro Camera
                    </li>
                    <li
                      className="flex gap-[8px] rounded-[1000px] border border-[#32343C] bg-[#212228] px-[10px] py-[6px] text-[13px] font-medium"
                      onClick={() => onSelect("Item 1")}
                    >
                      View more settings
                    </li>
                  </ul>
                )}
              >
                <VideoIcon2 />
              </DropdownButton>
            </div>
            <div className="flex w-[100%] max-w-[583px] items-center overflow-hidden rounded-[12px] bg-[#212329]">
              <input
                className="font-regular flex-grow border-0 bg-transparent text-[12px] text-white"
                placeholder="Type something"
              />
              <button className="mr-[12px] h-[20px] w-[20px]">
                <SendChatIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveView;
