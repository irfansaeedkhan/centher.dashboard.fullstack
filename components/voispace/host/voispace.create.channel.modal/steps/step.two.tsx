import React, { useState } from "react";
import { clsx } from "clsx";
import { TextLengthChecker } from "@/components/voispace/shared/text.length.checker";
import { MicIcon2, VideoIcon2 } from "@/assets/svgs";
import Button from "@/components/button";
import Image from "next/image";

import useMediaDevices from "hooks/use.get.media.devices/index";

const StepTwo = ({ formState, handleInputChange }: any) => {
  const { cameras, microphones, error } = useMediaDevices();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setPreview(imageUrl);
        setImageName(file.name);
        handleInputChange("image", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setImageName(null);
    handleInputChange("image", null);
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 ">
        <div className={`text-xl font-medium text-white`}>
          Dive into <span className={`text-gradient-1`}>VoiceSpace</span>
        </div>
        <div className="image-container flex items-center gap-3">
          {preview && (
            <div className="image-preview flex items-center gap-2">
              <Image
                src={preview}
                alt="Uploaded Preview"
                width={50}
                height={50}
                className="h-12 w-12 rounded-full object-cover"
              />
              <h6 className="text-xs text-gray-shade-24">
                {imageName || "Uploaded"}
              </h6>
            </div>
          )}

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <Button
            title={preview ? "Remove Image" : "Upload Image"}
            variant={preview ? "danger" : "secondary"}
            onClick={
              preview
                ? handleRemoveImage
                : () => {
                    document.getElementById("image-upload")?.click();
                  }
            }
            borderRounded="10px"
            className={`text-xs font-medium`}
          />
        </div>
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
            <span className="flex items-center gap-2 py-2 text-sm text-gray-shade-24">
              <MicIcon2 /> Audio
            </span>
          </div>

          {/* Video Tab */}
          <div
            onClick={
              formState.roomType === "Live"
                ? () => handleInputChange("mode", "Video")
                : undefined
            }
            className={clsx(
              "flex w-full items-center justify-center gap-2 rounded-[10px]",
              formState.roomType === "Live"
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50",
              formState.mode === "Video"
                ? "gradient-borders-div"
                : "border-gray-600"
            )}
          >
            <span
              className={clsx(
                "flex items-center gap-2 py-2 text-sm",
                formState.roomType === "Live"
                  ? "text-gray-shade-24"
                  : "text-gray-shade-10"
              )}
            >
              <VideoIcon2 className="size-6" /> Video
            </span>
          </div>
        </div>

        {/* Dropdown for Audio/Video Options */}
        <div className="relative">
          <select
            className="mt-2 block w-full rounded-[10px] border-0 bg-[#141416] px-4 py-3 text-white focus:outline-none focus:ring-[#141416]"
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
            disabled={
              formState.roomType === "AMA" && formState.mode === "Video"
            }
          >
            {formState.mode === "Audio" &&
              microphones.map((microphone, index) => {
                return (
                  <option key={index} value={microphone.deviceId}>
                    {microphone.label}
                  </option>
                );
              })}

            {formState.mode === "Video" &&
              cameras.map((camera, index) => {
                return (
                  <option key={index} value={camera.deviceId}>
                    {camera.label}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
