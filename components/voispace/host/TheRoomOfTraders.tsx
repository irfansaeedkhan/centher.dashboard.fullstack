import React from "react";
import Image from "next/image";

import { ChatProfile, MicIcon2, ShareWhiteIcon } from "@/assets/svgs";
import HostModalHeader from "@/components/voispace/host/partials/HostModalHeader";

import ActionButton from "./ui/ActionButton";
import UserWithPopover from "./partials/UserWithPopover";
import { speakers } from "../dummy.data/speakers.list";

interface DynamicProps {
  onClose: () => void;
  setComponentName: (name: string) => any;
}

const TheRoomOfTraders: React.FC<DynamicProps> = ({
  onClose,
  setComponentName,
}) => {
  return (
    <div className="px-[24px] py-[24px] text-white">
      <div className="flex flex-col gap-[42px]">
        <HostModalHeader
          subTitle="Voispace"
          title="The Room of Traders"
          onClose={onClose}
          hasBackButton={true}
          onBack={() => null}
        >
          <button
            className="font-monto text-[14px] font-medium text-[#E34048]"
            onClick={onClose}
          >
            Finish
          </button>
        </HostModalHeader>

        <div className="flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[24px]">
            <div className="flex max-w-[83px] flex-col gap-[2px]">
              <span className="text-[14px]">Host</span>
              <span className="rounded-[1000px] bg-[#141416] p-[8px] text-[12px]">
                <span className="text-[#FAFAFA]">1</span>
                <span>&nbsp;</span>
                <span className="text-gray-shade-24">host</span>
              </span>
            </div>

            <div>
              <UserWithPopover client={speakers[0]} />
            </div>
          </div>

          <div className="flex flex-col gap-[24px]">
            <div className="flex max-w-[83px] flex-col gap-[2px]">
              <span className="text-[14px]">Speakers</span>
              <span className="rounded-[1000px] bg-[#141416] p-[8px] text-[12px]">
                <span className="text-[#FAFAFA]">0</span>
                <span>&nbsp;</span>
                <span className="text-gray-shade-24">Speakers</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-[28px]">
              {speakers.map((speaker: any, index) => {
                return index ? (
                  <div className="" key={index}>
                    <UserWithPopover client={speaker} />
                  </div>
                ) : (
                  ""
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex min-h-[70px] items-center rounded-[24px] border border-[#32343C] bg-[#141416] p-[16px] text-white">
          <div className="flex w-[100%] justify-between">
            <div className="flex gap-[10px]">
              <ActionButton
                text="Finish"
                className="text-medium relative text-[14px] text-[#E34048]"
                onClick={onClose}
              >
                <ChatProfile />
                Chat
                <div className="absolute -top-1 right-0 h-3 w-3 rounded-full bg-gradient" />
              </ActionButton>

              <ActionButton
                text="Finish"
                className="text-medium text-[14px] text-[#E34048]"
                onClick={onClose}
              >
                <ShareWhiteIcon />
              </ActionButton>
            </div>

            <div className="flex items-center gap-[10px]">
              <ActionButton
                className="text-medium text-[14px] text-[#E34048]"
                onClick={() => setComponentName("Requests")}
              >
                <div className="relative h-[20px] w-[40px]">
                  <Image
                    src="/images/profiles/Profile-0.svg"
                    alt="Test"
                    width={20}
                    height={20}
                    className="absolute left-0 top-0 z-0"
                  />
                  <Image
                    src="/images/profiles/Profile-1.svg"
                    alt="Test"
                    width={20}
                    height={20}
                    className="z-1 absolute left-[50%] top-0 -translate-x-1/2 transform"
                  />
                </div>
                <span className="font-monto text-[11px] font-medium leading-[13px] tracking-[-0.4px]">
                  9
                </span>
              </ActionButton>
              <ActionButton
                className="text-medium hidden text-[14px] text-[#E34048] md:flex"
                onClick={() => alert("Requested")}
              >
                <span className="font-monto text-[11px] font-medium leading-[13px] tracking-[-0.4px]">
                  Request to speak
                </span>
              </ActionButton>
              <ActionButton
                text="Finish"
                className="text-medium text-[14px] text-[#E34048]"
                onClick={onClose}
              >
                <MicIcon2 />
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheRoomOfTraders;
