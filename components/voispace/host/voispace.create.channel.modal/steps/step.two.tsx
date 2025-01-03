import React from "react";
import { clsx } from "clsx";
import { TextLengthChecker } from "@/components/voispace/shared/text.length.checker";
import { MicIcon2, VideoIcon2 } from "@/assets/svgs";

const StepTwo = ({ formState, handleInputChange }: any) => {
  return (
    <div className="flex flex-col gap-6">
      <div className={`text-xl font-medium text-white`}>
        Dive into <span className={`text-gradient-1`}>VoiceSpace</span>
      </div>
      <div className="relative min-h-20 rounded-2xl bg-[#141416]">
        <div className="flex items-center">
          <textarea
            className="w-full rounded-2xl border-none bg-[#141416] p-4 text-sm font-medium text-white focus:outline-none focus:ring-0"
            placeholder="Write a smart title for your Room"
            maxLength={100}
            value={formState.roomTitle}
            onChange={(e) => handleInputChange("roomTitle", e.target.value)}
          ></textarea>

          <div className="absolute bottom-2 right-2 z-[100] ml-4 h-7 w-7">
            <TextLengthChecker
              currentLength={formState.roomTitle.length}
              maxLength={100}
            />
          </div>
        </div>
      </div>
      <div className="tabs flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {/* Audio Tab */}
          <div
            onClick={() => handleInputChange("mode", "Audio")}
            className={clsx(
              "flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px]",
              formState.mode === "Audio"
                ? "gradient-borders-div"
                : "border-gray-600"
            )}
          >
            <span className="flex items-center  gap-2 py-2 text-sm text-[#A8ABBB]">
              <MicIcon2 /> Audio
            </span>
          </div>

          {/* Video Tab */}
          <div
            onClick={() => handleInputChange("mode", "Video")}
            className={clsx(
              "flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px]",
              formState.mode === "Video"
                ? "gradient-borders-div"
                : "border-gray-600"
            )}
          >
            <span className="flex items-center  gap-2 py-2 text-sm text-[#A8ABBB]">
              <VideoIcon2 className="size-6" /> Video
            </span>
          </div>
        </div>

        {/* Dropdown for Audio/Video Options */}
        <div className="relative">
          <select
            className="mt-2 block w-full rounded-[10px] border-0  bg-[#141416] px-4 py-3 text-white focus:outline-none focus:ring-[#141416]"
            value={
              formState.mode === "Audio"
                ? formState.audioDevice
                : formState.videoDevice
            }
            onChange={(e) => {
              if (formState.mode === "Audio") {
                handleInputChange("audioDevice", e.target.value);
              } else {
                handleInputChange("videoDevice", e.target.value);
              }
            }}
          >
            {formState.mode === "Audio" ? (
              <>
                <option value="Internal Microphone">
                  Default - Internal Microphone
                </option>
                <option value="External Microphone">External Microphone</option>
                <option value="Bluetooth Device">Bluetooth Device</option>
              </>
            ) : (
              <>
                <option value="Internal Camera">
                  Default - Internal Camera
                </option>
                <option value="External Camera">External Camera</option>
                <option value="Virtual Background Camera">
                  Virtual Background Camera
                </option>
              </>
            )}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
