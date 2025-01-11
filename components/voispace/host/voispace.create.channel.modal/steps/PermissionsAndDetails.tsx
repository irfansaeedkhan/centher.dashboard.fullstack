import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { TextLengthChecker } from "@/components/voispace/shared/text.length.checker";
import { MicIcon2, VideoIcon2 } from "@/assets/svgs";
import Button from "@/components/button";
import Image from "next/image";

import useMediaDevices from "hooks/use.get.media.devices/index";

import toast from "react-hot-toast";
import { Room } from "../voispace.create.channel.modal";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";

interface Fields {
  "Content-Type": string;
  Policy: string;
  "X-Amz-Algorithm": string;
  "X-Amz-Credential": string;
  "X-Amz-Date": string;
  "X-Amz-Signature": string;
  acl: string;
  bucket: string;
  key: string;
}

const PermissionsAndDetails = ({
  formState,
  handleInputChange,
  setLoading,
}: {
  formState: Room;
  handleInputChange: (key: keyof Room, value: any) => void;
  setLoading: any;
}) => {
  const { cameras, microphones, error, updateDevices, getMediaPermissions } =
    useMediaDevices();
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [rawImage, setRawImage] = useState<File | undefined>(undefined);
  const [showGetPermission, setShowGetPermission] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("audio");

  useEffect(() => {
    updateDevices().then(() => {
      if (formState.type == BroadcastTypeEnum.LIVE) {
        if (microphones.length == 0 || cameras.length == 0) {
          setShowGetPermission(true);
        } else {
          handleInputChange("videoDevice", cameras[0]);
          handleInputChange("audioDevice", microphones[0]);
        }
      }

      if (formState.type == BroadcastTypeEnum.AMA) {
        if (microphones.length == 0) {
          setShowGetPermission(true);
        } else {
          handleInputChange("audioDevice", microphones[0]);
        }
      }
    });
  }, [
    updateDevices,
    handleInputChange,
    formState.audioDevice,
    formState.videoDevice,
  ]);

  useEffect(() => {
    if (showGetPermission) {
      getMediaPermissions(formState.type).then();
    }
  }, [showGetPermission]);

  useEffect(() => {
    if (rawImage) {
      getFilePreview(rawImage);
    } else {
      getFilePreview(null);
    }
  }, [rawImage]);

  const handleOnUserSelectedImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      if (
        !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        )
      ) {
        toast.error("Invalid file type. Please upload a valid image.");
        return;
      }

      setRawImage(file);
      handleInputChange("image", file);
    } catch (error) {}
  };

  const getFilePreview = (file: File | null) => {
    if (!rawImage) {
      setPreview(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(rawImage);
  };

  const handleRemoveImage = () => {
    setRawImage(undefined);
    handleInputChange("image", null);
  };
  //TODO: show a dialog when showGetPermission is true and ask user to allow device permission, in the same dialog we shoud show mediaError if it has value
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
            </div>
          )}

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleOnUserSelectedImage}
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
            value={formState.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          ></textarea>

          <div className="absolute bottom-2 right-2 z-[100] ml-4 h-7 w-7">
            <TextLengthChecker
              currentLength={formState.name!.length}
              maxLength={100}
            />
          </div>
        </div>
      </div>
      <div className="tabs flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {/* Audio Tab */}
          {formState.type === BroadcastTypeEnum.LIVE ? (
            <div
              onClick={() => setCurrentTab("audio")}
              className={clsx(
                "flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px]"
              )}
            >
              <span className="flex items-center gap-2 py-2 text-sm text-gray-shade-24">
                <MicIcon2 /> Audio
              </span>
            </div>
          ) : (
            <div className={`text-sm font-medium text-white`}>
              Select Audio device:
            </div>
          )}

          {formState.type === BroadcastTypeEnum.LIVE && (
            <div
              onClick={() => setCurrentTab("video")}
              className={clsx(
                "flex w-full items-center justify-center gap-2 rounded-[10px] "
              )}
            >
              <span
                className={clsx(
                  "flex items-center gap-2 py-2 text-sm text-gray-shade-24"
                )}
              >
                <VideoIcon2 className="size-6" /> Video
              </span>
            </div>
          )}
        </div>

        {/* Dropdown for Audio/Video Options */}
        <div className="relative">
          <select
            className="mt-2 block w-full rounded-[10px] border-0 bg-[#141416] px-4 py-3 text-white focus:outline-none focus:ring-[#141416]"
            value={
              currentTab === "audio"
                ? formState.audioDevice?.label
                : formState.videoDevice?.label
            }
            onChange={(e) => {
              if (currentTab === "audio") {
                handleInputChange(
                  "audioDevice",
                  microphones.find((m) => m.deviceId === e.target.value)
                );
              } else {
                handleInputChange(
                  "videoDevice",
                  cameras.find((c) => c.deviceId === e.target.value)
                );
              }
            }}
          >
            {currentTab === "audio" &&
              microphones.map((microphone, index) => (
                <option key={index} value={microphone.deviceId}>
                  {microphone.label}
                </option>
              ))}

            {currentTab === "video" &&
              cameras.map((camera, index) => (
                <option key={index} value={camera.deviceId}>
                  {camera.label}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PermissionsAndDetails;
