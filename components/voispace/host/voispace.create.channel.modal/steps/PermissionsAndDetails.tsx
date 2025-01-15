import React, { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { TextLengthChecker } from "@/components/voispace/shared/text.length.checker";
import { MicIcon2, VideoIcon2 } from "@/assets/svgs";
import Button from "@/components/button";
import Image from "next/image";

import useMediaDevices from "hooks/use.get.media.devices/index";

import toast from "react-hot-toast";
import { Room } from "../voispace.create.channel.modal";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import CustomDropdownAll from "@/components/shared/custom-dropdown";

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
  loading,
  setPermissionsValid,
}: {
  formState: Room;
  handleInputChange: (key: keyof Room, value: any) => void;
  loading: boolean;
  setPermissionsValid: (valid: boolean) => void;
}) => {
  const { cameras, microphones, error, updateDevices, getMediaPermissions } =
    useMediaDevices();
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [rawImage, setRawImage] = useState<File | undefined>(undefined);
  const [showGetPermission, setShowGetPermission] = useState({
    audioErr: false,
    videoErr: false,
  });
  const [currentTab, setCurrentTab] = useState<string>("audio");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const isValid =
      formState.type === BroadcastTypeEnum.AMA
        ? !!formState.audioDevice
        : !!formState.audioDevice && !!formState.videoDevice;

    setPermissionsValid(isValid);
  }, [
    formState.audioDevice,
    formState.videoDevice,
    formState.type,
    setPermissionsValid,
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
      const MAX_FILE_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 2MB. Please upload a smaller image.");
        return;
      }
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
    } catch (error) {
      console.error("Error selecting image:", error);
    }
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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // audio video error handling logic here ::
  useEffect(() => {
    const updatePermissionsAndDevices = async () => {
      try {
        // Check browser permission statuses for audio and video
        const audioPermission = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        const videoPermission = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });

        console.log("audioPermission:", audioPermission.state);
        console.log("videoPermission:", videoPermission.state);

        // Fetch devices again if permissions are granted
        if (
          audioPermission.state === "granted" ||
          videoPermission.state === "granted"
        ) {
          console.log("Refreshing devices...");
          await updateDevices(); // Call the function to refresh the device list
        }

        // Log the devices after refreshing
        console.log("Updated microphones:", microphones);
        console.log("Updated cameras:", cameras);

        // Determine errors based on permissions and device lists
        const showAudioError =
          microphones.length === 0 || audioPermission.state !== "granted";
        const showVideoError =
          cameras.length === 0 || videoPermission.state !== "granted";

        setShowGetPermission({
          audioErr: showAudioError,
          videoErr: showVideoError,
        });

        // Assign default devices if permissions are granted
        if (!showAudioError && microphones.length > 0) {
          console.log("Assigning audio device:", microphones[0]);
          handleInputChange("audioDevice", microphones[0]);
        }
        if (!showVideoError && cameras.length > 0) {
          console.log("Assigning video device:", cameras[0]);
          handleInputChange("videoDevice", cameras[0]);
        }
      } catch (err) {
        console.error("Error checking permissions or updating devices:", err);
      }
    };

    updatePermissionsAndDevices();
  }, [microphones, cameras, updateDevices, handleInputChange]);

  const renderAudioDropdown = () => {
    if (!navigator.mediaDevices) {
      return (
        <div className="text-sm text-danger">
          Your browser does not support media devices. Please use a compatible
          browser.
        </div>
      );
    }
    console.log("showGetPermission.audioErr::", showGetPermission.audioErr);
    if (showGetPermission.audioErr) {
      return (
        <div className="text-sm text-danger">
          No audio devices found. Please allow microphone access or check your
          device settings.
        </div>
      );
    }

    return (
      <CustomDropdownAll
        className="rounded-[10px] bg-[#141416]"
        options={microphones.map((mic) => ({
          value: mic.deviceId,
          label: mic.label,
        }))}
        selectedValue={formState.audioDevice?.deviceId || ""}
        onSelect={(value) => {
          const selectedDevice = microphones.find(
            (mic) => mic.deviceId === value
          );
          handleInputChange("audioDevice", selectedDevice);
        }}
      />
    );
  };

  // Render video dropdown
  const renderVideoDropdown = () => {
    if (!navigator.mediaDevices) {
      return (
        <div className="text-sm text-danger">
          Your browser does not support media devices. Please use a compatible
          browser.
        </div>
      );
    }

    if (showGetPermission.videoErr) {
      return (
        <div className="text-sm text-danger">
          No video devices found. Please allow camera access or check your
          device settings.
        </div>
      );
    }

    return (
      <CustomDropdownAll
        className="rounded-[10px] bg-[#141416]"
        options={cameras.map((cam) => ({
          value: cam.deviceId,
          label: cam.label,
        }))}
        selectedValue={formState.videoDevice?.deviceId || ""}
        onSelect={(value) => {
          const selectedDevice = cameras.find((cam) => cam.deviceId === value);
          handleInputChange("videoDevice", selectedDevice);
        }}
      />
    );
  };

  //TODO: show a dialog when showGetPermission is true and ask user to allow device permission, in the same dialog we shoud show mediaError if it has value
  return (
    <div className={clsx(`flex flex-col gap-6`, loading && "opacity-50")}>
      <div className="flex flex-col items-start justify-between gap-4 ">
        <div className={`text-xl font-medium text-white`}>
          Dive into <span className={`text-gradient-1`}>VoiSpace</span>
        </div>
        <div className="image-container flex items-center gap-3">
          {preview && (
            <div className="image-preview flex items-center gap-2">
              <Image
                src={preview}
                alt="Uploaded Preview"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            </div>
          )}

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleOnUserSelectedImage}
            disabled={loading}
            ref={fileInputRef}
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
            disabled={loading}
            important={true}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="relative min-h-20 rounded-2xl bg-[#141416]">
          <div className="flex items-center">
            <textarea
              className="w-full rounded-2xl border-none bg-[#141416] p-4 text-sm font-medium text-white focus:outline-none focus:ring-0"
              placeholder="Write a smart title for your Room*"
              maxLength={100}
              value={formState.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={loading}
            ></textarea>

            <div className="absolute bottom-2 right-2 z-[100] ml-4 h-7 w-7">
              <TextLengthChecker
                currentLength={formState.name!.length}
                maxLength={100}
              />
            </div>
          </div>
        </div>
        <span
          className={clsx(
            "mt-2 block text-xs",
            formState?.name && formState?.name?.length >= 100
              ? "text-danger"
              : "text-gray-shade-24"
          )}
        >
          {formState?.name && formState.name.length >= 100
            ? "You cannot exceed 100 characters."
            : "A smart title is required. Max limit: 100 characters.*"}
        </span>
      </div>

      <div className="tabs flex flex-col gap-2">
        <div className="flex items-center gap-4">
          {/* Audio Tab */}
          {formState.type === BroadcastTypeEnum.LIVE ? (
            <div
              onClick={!loading ? () => setCurrentTab("audio") : undefined}
              className={clsx(
                "flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px]",
                currentTab === "audio"
                  ? "gradient-borders-div"
                  : "border-gray-600",
                loading && "pointer-events-none"
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
              onClick={!loading ? () => setCurrentTab("video") : undefined}
              className={clsx(
                "flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px]",
                currentTab === "video"
                  ? "gradient-borders-div"
                  : "border-gray-600",
                loading && "pointer-events-none"
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
        {/* <div className="relative">
          <select
            className="mt-2 block w-full rounded-[10px] border-0 bg-[#141416] py-3 pl-4 pr-8 text-white focus:outline-none focus:ring-[#141416]"
            value={
              currentTab === "audio"
                ? formState.audioDevice?.label
                : formState.videoDevice?.label
            }
            onChange={(e) => {
              if (!loading) {
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
              }
            }}
            disabled={loading}
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
        </div> */}

        <div className="mt-2 rounded-[10px]">
          {currentTab === "audio" && renderAudioDropdown()}
          {currentTab === "video" && renderVideoDropdown()}
        </div>
      </div>
    </div>
  );
};

export default PermissionsAndDetails;
