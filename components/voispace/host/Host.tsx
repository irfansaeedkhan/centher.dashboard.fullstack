import React from "react";
import ClientCardView from "../shared/profile";
import { speakers } from "../dummy.data/speakers.list";
import { ChatProfile, MicIcon, ShareWhiteIcon } from "@/assets/svgs";

const HostMainView: React.FC = () => {
  return (
    <div className="px-[24px] py-[24px] text-white">
      <div className="flex flex-col gap-[42px]">
        <div className="align-start flex justify-between">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[14px] font-semibold text-[#B7BBCC]">
              Voispace
            </span>
            <span className="text-[24px] font-bold">The Room of Traders</span>
          </div>
          <button>Finish</button>
        </div>

        <div className="flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[24px]">
            <div className="flex max-w-[83px] flex-col gap-[2px]">
              <span className="text-[14px]">Host</span>
              <span className="rounded-[1000px] bg-[#141416] p-[8px] text-[12px]">
                <span className="text-[#FAFAFA]">1</span>
                <span>&nbsp;</span>
                <span className="text-[#A8ABBB]">host</span>
              </span>
            </div>

            <div>
              <ClientCardView
                name="John Wedson"
                imageURL="/images/john-wedson.png"
                isApproved={true}
                isSpeaking={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-[24px]">
            <div className="flex max-w-[83px] flex-col gap-[2px]">
              <span className="text-[14px]">Speakers</span>
              <span className="rounded-[1000px] bg-[#141416] p-[8px] text-[12px]">
                <span className="text-[#FAFAFA]">0</span>
                <span>&nbsp;</span>
                <span className="text-[#A8ABBB]">Speakers</span>
              </span>
            </div>

            <div className="flex gap-[28px]">
              {speakers.map((speaker: any, index) => {
                return (
                  <div className="" key={index}>
                    <ClientCardView
                      name={speaker.name}
                      imageURL={speaker.imageURL}
                      isApproved={speaker.isApproved}
                      isSpeaking={speaker.isSpeaking}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex min-h-[70px] items-center rounded-[24px] border border-[#32343C] bg-[#141416] p-[16px] text-white">
          <div className="flex w-[100%] justify-between">
            <div className="flex gap-[10px]">
              <button className="flex items-center gap-[6px]">
                <ChatProfile />
                Chat
              </button>
              <button>
                <ShareWhiteIcon />
              </button>
            </div>

            <div className="flex items-end gap-[10px]">
              <button>Request</button>
              <button>Count</button>
              <button>Users</button>
              <button>Mic</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostMainView;
