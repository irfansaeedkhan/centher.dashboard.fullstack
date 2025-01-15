import React, { useCallback, useEffect, useState } from "react";
import { MdOutlineExpandLess } from "react-icons/md";

import ModalContainer from "@/components/modal/modal-container";
import Button from "@/components/button";
import toast from "react-hot-toast";
import { useStream } from "@/hooks/stream/use.core";
import useUser from "@/hooks/use.user";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { CreateBroadcastDto } from "@/stream/types/Broadcast";
import axios from "axios";

import AMAOrLive from "./steps/AMAOrLive";
import PermissionsAndDetails from "./steps/PermissionsAndDetails";
import Accessibility from "./steps/Accessibility";
import StepFour from "./steps/step.four";
import ChannelMainView from "../../shared/ChannelMainView";
import { StreamEventEnum } from "@/stream/model";
import { CreatRoomSteps } from "./enums";
import { ICentalkBroadcast } from "@/hooks/stream/cen-talk";
import { CFSBaseURL } from "@/constants/base-urls";
import { getUserImageUploadUrl } from "@/lib/user";
import useMediaDevices from "@/hooks/use.get.media.devices";
import clsx from "clsx";
import { CrossIcon } from "@/assets/svgs";

interface Props {
  onClose: () => void;
}

export interface Room extends ICentalkBroadcast {
  invitedPrivateUsers: SearchResultWithType[];
  invitedPrivilegeUsers: CFSCollection[];
  audioDevice: MediaDeviceInfo | null;
  videoDevice: MediaDeviceInfo | null;
}

export interface SearchResultWithType {
  _id: string;
  name: string;
  type: string;
}

export interface CFSCollection {
  collection: string;
  name: string;
}

export const VoispaceCreateChannelModal: React.FC<Props> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState<CreatRoomSteps>(
    CreatRoomSteps.AMA_OR_LIVE
  );
  const [loading, setLoading] = useState(false);
  const [roomCreationLoader, setRoomCreationLoader] = useState(false);
  const [isHostSettingsOpen, setIsHostSettingsOpen] = useState(false);
  const [roomData, setRoomData] = useState<Room | null>(null);
  const { amaAgent, liveAgent } = useStream();
  const { createRoom: createAMARoom, event: eventOnAMA } = amaAgent;
  const { createRoom: createLiveRoom, event: eventOnLive } = liveAgent;
  const { user } = useUser();
  const { getMediaPermissions, error: mediaError } = useMediaDevices();
  const [currentModalIsOpen, setCurrentModalIsOpen] = useState(true);
  const [permissionsValid, setPermissionsValid] = useState<boolean>(true);

  const [formState, setFormState] = useState<Room>({
    type: BroadcastTypeEnum.AMA,
    image: "",
    name: "",
    accessMode: StreamAccessModeEnum.NONE,
    invitedPrivateUsers: [],
    invitedPrivilegeUsers: [],
    audioDevice: null,
    videoDevice: null,
    invitedUsers: [],
    latestParticipants: [],
    participatorsCount: { aggregate: { count: 0 } },
    speakersCount: { aggregate: { count: 0 } },
    hasTalkRequestUsers: { aggregate: { count: 0 } },
  });

  useEffect(() => {
    if (mediaError) {
      toast.error("Check your audio and video devices");
    }
  }, [mediaError]);

  useEffect(() => {
    if (
      eventOnAMA?.type === StreamEventEnum.ON_CREATE_CENTALK ||
      eventOnLive?.type === StreamEventEnum.ON_CREATE_CENTALK
    ) {
      const newRoomData: Room = {
        ...formState!,
        accessMode: formState.accessMode,
        id: eventOnAMA?.data.id || eventOnLive?.data.id,
      };

      setRoomData(newRoomData);
      setIsHostSettingsOpen(true);
      setRoomCreationLoader(false);
      setCurrentModalIsOpen(false);
    }

    if (
      eventOnAMA?.type == StreamEventEnum.STREAM_INITIALIZATION_ERROR ||
      eventOnLive?.type == StreamEventEnum.STREAM_INITIALIZATION_ERROR
    ) {
      const error = eventOnAMA?.data || eventOnLive?.data;
      toast.error(error);
      console.log("on error");
      onClose();
      setRoomCreationLoader(false);
      setCurrentModalIsOpen(false);
    }

    if (
      eventOnAMA?.type == StreamEventEnum.ON_FINISH_BROADCAST ||
      eventOnLive?.type == StreamEventEnum.ON_FINISH_BROADCAST ||
      eventOnAMA?.type == StreamEventEnum.ON_USER_KICKED ||
      eventOnLive?.type == StreamEventEnum.ON_USER_KICKED
    ) {
      console.log("on finish");
      setRoomData(null);
      setIsHostSettingsOpen(true);
      setRoomCreationLoader(false);
      setCurrentModalIsOpen(false);
      onClose();
    }
  }, [eventOnLive, eventOnAMA]);

  const generateImageUrl = (params: any): string => {
    if (params.type === "custom-image") {
      return `${CFSBaseURL}/users?key=${params.object_name}`;
    } else {
      throw new Error("Invalid params");
    }
  };

  const handleImageUpload = async () => {
    const file = formState.image;

    if (!file || typeof file === "string") return;

    try {
      if (
        !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        )
      ) {
        toast.error("Invalid file type. Please upload a valid image.");
        return;
      }

      setLoading(true);

      // Get presigned URL for the image
      const { presignedPostData, objectName } = await getUserImageUploadUrl(
        file.name,
        "cover_image"
      );

      // Prepare form data for uploading the image
      const formData = new FormData();
      Object.entries(presignedPostData.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      // Upload the image to AWS S3 using the presigned URL
      await axios.post(presignedPostData.url, formData);

      // Generate the full image URL
      const imageUrl = generateImageUrl({
        type: "custom-image",
        object_name: objectName,
      });

      setFormState((current) => ({
        ...current,
        image: imageUrl,
      }));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = useCallback(
    (field: keyof Room, value: any) => {
      setFormState((prev) => {
        const updatedState = { ...prev, [field]: value };

        if (field === "accessMode") {
          updatedState.invitedPrivateUsers =
            value === StreamAccessModeEnum.ACCESS_BY_INVITATION
              ? prev.invitedPrivateUsers
              : [];
          updatedState.invitedPrivilegeUsers =
            value === StreamAccessModeEnum.ACCESS_BY_TOKEN
              ? prev.invitedPrivilegeUsers
              : [];
        }

        return updatedState;
      });
    },
    [setFormState]
  );

  const createRoom = async () => {
    try {
      setRoomCreationLoader(true);
      const input: CreateBroadcastDto = {
        name: formState.name,
        description: "",
        accessMode: formState.accessMode,
        type: formState.type,
        image: formState.image as string,
        invitedUsers:
          formState.accessMode === StreamAccessModeEnum.ACCESS_BY_INVITATION
            ? formState.invitedPrivateUsers.map((u) => u._id)
            : [],
        tokenAddress:
          formState.accessMode === StreamAccessModeEnum.ACCESS_BY_TOKEN
            ? formState.invitedPrivilegeUsers.map((c) => c.collection)
            : [],
      };

      const createRoom =
        formState.type === BroadcastTypeEnum.AMA
          ? createAMARoom
          : createLiveRoom;

      if (!user) {
        toast.error("User not found. Please try again.");
        return;
      }

      await createRoom(input, user._id);
    } catch (error) {
      console.error("Error creating public room:", error);
    }
  };

  const handleNext = async () => {
    // Step 2: Validation for room title and image
    if (currentStep === CreatRoomSteps.PERMISSIONS_AND_DETAILS) {
      if (!formState.name) {
        toast.error("Room title is required.");
        return;
      }

      if (!formState.image) {
        toast.error("Image is required.");
        return;
      }

      if (formState.type === BroadcastTypeEnum.LIVE) {
        if (!formState.audioDevice || !formState.videoDevice) {
          toast.error(
            "Audio and video permissions are required for live sessions."
          );
          return;
        }
      }

      try {
        await getMediaPermissions(formState.type);
        await handleImageUpload();
      } catch (error) {
        toast.error("Failed to upload image, please try another image");
        return;
      }
    }

    // Step 3: Validation for audio device

    if (currentStep === CreatRoomSteps.ACCESSIBILITY) {
      // Perform validation for Step 3
      if (!formState.audioDevice) {
        toast.error("Audio device is required.");
        return;
      }

      if (formState.type === BroadcastTypeEnum.LIVE) {
        if (!formState.videoDevice) {
          toast.error("Video device is required.");
          return;
        }
      }

      if (!formState.name) {
        toast.error("Room title is required.");
        return;
      }

      if (!formState.image) {
        toast.error("Room image is required.");
        return;
      }

      if (formState.accessMode === StreamAccessModeEnum.PUBLIC) {
        await createRoom();
        return;
      }
      // Proceed to Step 4 for Private/Privilege rooms
      setCurrentStep(CreatRoomSteps.ROOM);
      return;
    }

    if (currentStep === CreatRoomSteps.ROOM) {
      // Perform validation specific to Step 4
      if (
        formState.accessMode === StreamAccessModeEnum.ACCESS_BY_INVITATION &&
        formState.invitedPrivateUsers.length === 0
      ) {
        toast.error("Please add at least one user for a private room.");
        return;
      }

      if (
        formState.accessMode === StreamAccessModeEnum.ACCESS_BY_TOKEN &&
        formState.invitedPrivilegeUsers.length === 0
      ) {
        toast.error("Please add at least one privilege user.");
        return;
      }

      await createRoom();
      return;
    }

    // Move to the next step
    setCurrentStep((prev) => {
      if (prev === CreatRoomSteps.AMA_OR_LIVE)
        return CreatRoomSteps.PERMISSIONS_AND_DETAILS;
      if (prev === CreatRoomSteps.PERMISSIONS_AND_DETAILS)
        return CreatRoomSteps.ACCESSIBILITY;
      return CreatRoomSteps.ROOM;
    });
  };

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev <= CreatRoomSteps.AMA_OR_LIVE) return CreatRoomSteps.AMA_OR_LIVE;
      if (prev === CreatRoomSteps.PERMISSIONS_AND_DETAILS)
        return CreatRoomSteps.AMA_OR_LIVE;
      if (prev === CreatRoomSteps.ACCESSIBILITY)
        return CreatRoomSteps.PERMISSIONS_AND_DETAILS;
      if (prev === CreatRoomSteps.ROOM) return CreatRoomSteps.ACCESSIBILITY;
      return prev;
    });
  }, []);

  if (isHostSettingsOpen && roomData) {
    return (
      <ChannelMainView
        onClose={onClose}
        roomData={roomData}
        component={
          roomData?.type === BroadcastTypeEnum.AMA
            ? "TheRoomOfTraders"
            : "LiveView"
        }
      />
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case CreatRoomSteps.AMA_OR_LIVE:
        return (
          <AMAOrLive
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case CreatRoomSteps.PERMISSIONS_AND_DETAILS:
        return (
          <PermissionsAndDetails
            formState={formState}
            handleInputChange={handleInputChange}
            loading={loading}
            setPermissionsValid={setPermissionsValid}
          />
        );
      case CreatRoomSteps.ACCESSIBILITY:
        return (
          <Accessibility
            formState={formState}
            handleInputChange={handleInputChange}
            loading={roomCreationLoader}
          />
        );
      case CreatRoomSteps.ROOM:
        return (
          <StepFour
            formState={formState}
            setFormState={setFormState}
            setIsHostSettingsOpen={setIsHostSettingsOpen}
            loading={roomCreationLoader}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ModalContainer
      modalId="create-room"
      onClose={onClose}
      isOpen={currentModalIsOpen}
      modalContentClassName="mobile-max:h-[100vh] max-w-[656px] p-0 mobile-max:rounded-none mobile-max:mx-0 rounded-3xl"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={!roomCreationLoader}
    >
      <div className="header relative border-b-2 border-[#141416]">
        <div className="mb-0 flex items-center justify-between rounded-t px-4 py-4 md:py-4">
          <span className="flex items-center">
            {currentStep !== CreatRoomSteps.AMA_OR_LIVE && (
              <button
                onClick={loading || roomCreationLoader ? undefined : handleBack}
                className={clsx("transition-opacity", {
                  "pointer-events-none opacity-50":
                    loading || roomCreationLoader,
                  "opacity-100": !loading && !roomCreationLoader,
                })}
              >
                <MdOutlineExpandLess className="h-7 w-7 -rotate-90 text-white" />
              </button>
            )}
            {currentStep === CreatRoomSteps.AMA_OR_LIVE && (
              <span className="py-1 text-xl font-semibold text-white flg:hidden">
                <CrossIcon
                  className="mx-auto min-w-[20px] shrink-0 cursor-pointer [&>*]:stroke-white"
                  onClick={onClose}
                />
              </span>
            )}
          </span>

          <span className="py-1 text-base font-semibold text-white flg:text-xl">
            Create New Room
          </span>
          <Button
            title={
              loading && currentStep === CreatRoomSteps.PERMISSIONS_AND_DETAILS
                ? "Uploading..."
                : roomCreationLoader
                ? "setting up room..."
                : currentStep === CreatRoomSteps.ROOM
                ? "Submit"
                : "Next"
            }
            disabled={
              loading ||
              roomCreationLoader ||
              !permissionsValid ||
              (currentStep === CreatRoomSteps.PERMISSIONS_AND_DETAILS &&
                (!formState.name || !formState.image))
            }
            variant="primary"
            onClick={handleNext}
            borderRounded="10px"
            className="text-xs font-medium"
          />
        </div>
      </div>
      <div className="p-6">{renderStep()}</div>
    </ModalContainer>
  );
};
