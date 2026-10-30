import React, { useCallback, useEffect, useState } from "react";
import { MdOutlineExpandLess } from "react-icons/md";

import ModalContainer from "@/components/modal/modal-container";
import Button from "@/components/button";
import toast from "react-hot-toast";
import { useStream } from "@/hooks/stream/use.core";
import useUser from "@/hooks/use.user";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { isNextEnabled } from "./room-validation";
import { CreateBroadcastDto } from "@/stream/types/Broadcast";

import AMAOrLive from "./steps/AMAOrLive";
import PermissionsAndDetails from "./steps/PermissionsAndDetails";
import Accessibility from "./steps/Accessibility";
import StepFour from "./steps/step.four";
import ChannelMainView from "../../shared/ChannelMainView";
import { StreamEventEnum } from "@/stream/model";
import { CreatRoomSteps } from "./enums";
import { ICentalkBroadcast } from "@/hooks/stream/cen-talk";
import {
  uploadImage,
  isCloudinaryConfigured,
  CloudinaryNotConfiguredError,
} from "@/lib/media/cloudinary";
import useMediaDevices from "@/hooks/use.get.media.devices";
import clsx from "clsx";
import { CrossIcon } from "@/assets/svgs";
import { Collection } from "@/hooks/stream/types";

interface Props {
  onClose: () => void;
}

export interface Room extends ICentalkBroadcast {
  invitedPrivateUsers: SearchResultWithType[];
  invitedPrivilegeUsers: Collection[];
  audioDevice: MediaDeviceInfo | null;
  videoDevice: MediaDeviceInfo | null;
}

export interface SearchResultWithType {
  _id: string;
  name: string;
  type: string;
}

export const SociaketSpaceCreateChannelModal: React.FC<Props> = ({
  onClose,
}) => {
  const { amaAgent, liveAgent } = useStream();
  const {
    createRoom: createAMARoom,
    event: eventOnAMA,
    leave: leaveAMARoom,
  } = amaAgent;
  const {
    createRoom: createLiveRoom,
    event: eventOnLive,
    leave: leaveLiveRoom,
  } = liveAgent;

  const [currentStep, setCurrentStep] = useState<CreatRoomSteps>(
    CreatRoomSteps.AMA_OR_LIVE
  );
  const [loading, setLoading] = useState(false);
  const [roomCreationLoader, setRoomCreationLoader] = useState(false);
  const [isHostSettingsOpen, setIsHostSettingsOpen] = useState(false);
  const [roomData, setRoomData] = useState<Room | null>(null);
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

  // Wrapped close: clear our own open state FIRST so the overlay unmounts
  // immediately, then notify the parent. Prevents the z-2000 overlay leak
  // where clicks were blocked after closing (only Esc dismissed it).
  // If a room creation is in flight, best-effort leave the voice server and
  // stop the loader so the user is never trapped on "setting up room...".
  const handleCloseModal = useCallback(() => {
    if (roomCreationLoader) {
      try {
        (formState.type === BroadcastTypeEnum.AMA
          ? leaveAMARoom
          : leaveLiveRoom)();
      } catch {
        // Socket may already be gone — closing the modal is what matters.
      }
      setRoomCreationLoader(false);
    }
    setCurrentModalIsOpen(false);
    onClose();
  }, [
    onClose,
    roomCreationLoader,
    formState.type,
    leaveAMARoom,
    leaveLiveRoom,
  ]);
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
      handleCloseModal();
      setRoomCreationLoader(false);
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
      handleCloseModal();
    }
  }, [eventOnLive, eventOnAMA, handleCloseModal]);

  const generateImageUrl = (params: any): string => {
    if (params.type === "custom-image") {
      return `/api/users?key=${params.object_name}`;
    } else {
      throw new Error("Invalid params");
    }
  };

  const handleImageUpload = async () => {
    const file = formState.image;

    if (!file || typeof file === "string") return;

    // Phase 11: image is optional — if Cloudinary isn't configured, keep the
    // placeholder and don't block room creation.
    if (!isCloudinaryConfigured()) return;

    setLoading(true);
    try {
      const secureUrl = await uploadImage(file, "centher/voispace");
      setFormState((current) => ({
        ...current,
        image: secureUrl,
      }));
    } catch (error: any) {
      if (error instanceof CloudinaryNotConfiguredError) return;
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
        image:
          typeof formState.image === "string" && formState.image
            ? formState.image
            : "/images/placeholder-square.svg",
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
        setRoomCreationLoader(false);
        return;
      }

      await createRoom(
        input,
        user._id,
        formState.audioDevice as MediaDeviceInfo,
        formState.videoDevice as MediaDeviceInfo
      );
    } catch (error) {
      // Never leave the modal stuck on "setting up room..." — stop the
      // loader and surface the failure. The modal stays open so the user
      // can retry.
      console.error("Error creating public room:", error);
      setRoomCreationLoader(false);
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Could not connect to the voice server. Please check your connection and try again."
      );
    }
  };

  const handleNext = async () => {
    // Step 2: Validation for room title and image
    if (currentStep === CreatRoomSteps.PERMISSIONS_AND_DETAILS) {
      if (!formState.name?.trim()) {
        toast.error("Room title is required.");
        return;
      }

      // Device validation mirrors PermissionsAndDetails: require selected
      // devices, but don't block when the browser has none available.
      if (!permissionsValid) {
        toast.error("Please select your audio/video devices to continue.");
        return;
      }

      try {
        await getMediaPermissions(formState.type);
      } catch (error) {
        toast.error(
          "Failed to access media devices. Please check permissions."
        );
        return;
      }

      // Phase 11: image is optional — a failed upload warns but never blocks
      // room creation (the placeholder fallback applies).
      try {
        await handleImageUpload();
      } catch (error) {
        toast.error(
          "Failed to upload image — continuing without a cover image."
        );
      }
    }

    // Step 3: Validation for devices (reuses the step-2 grace: permissionsValid
    // holds its last value while PermissionsAndDetails is unmounted, and
    // devices can't change between steps).

    if (currentStep === CreatRoomSteps.ACCESSIBILITY) {
      // Perform validation for Step 3
      if (!permissionsValid) {
        toast.error("Please select your audio/video devices to continue.");
        return;
      }

      if (!formState.name?.trim()) {
        toast.error("Room title is required.");
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
        toast.error("Please add at least one privileged user.");
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
      onClose={handleCloseModal}
      isOpen={currentModalIsOpen}
      modalContentClassName="mobile-max:h-dvh max-w-[656px] p-0 mobile-max:rounded-none mobile-max:mx-0 rounded-3xl"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={!roomCreationLoader}
    >
      <div className="header relative border-b-2 border-[#141416]">
        <div className="mb-0 flex items-center justify-between rounded-t px-4 py-4 md:py-4">
          <span className="flex items-center">
            {currentStep !== CreatRoomSteps.AMA_OR_LIVE ? (
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
            ) : (
              // Spacer keeps the title centered now that X lives top-right.
              <span className="w-7" />
            )}
          </span>

          <span className="py-1 text-base font-semibold text-white flg:text-xl">
            Create New Room
          </span>
          <span className="flex items-center gap-2">
            <Button
              title={
                loading &&
                currentStep === CreatRoomSteps.PERMISSIONS_AND_DETAILS
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
                (currentStep === CreatRoomSteps.PERMISSIONS_AND_DETAILS &&
                  !isNextEnabled(formState.name, permissionsValid))
              }
              variant="primary"
              onClick={handleNext}
              borderRounded="10px"
              className="text-xs font-medium"
            />
            {/* Always-visible close: clickable on every step, even while a
                room creation is in flight (handleCloseModal cleans up). */}
            <button
              onClick={handleCloseModal}
              aria-label="Close"
              title="Close"
              className="shrink-0 cursor-pointer p-1"
            >
              <CrossIcon className="min-w-[20px] [&>*]:stroke-white" />
            </button>
          </span>
        </div>
      </div>
      <div className="p-6">{renderStep()}</div>
    </ModalContainer>
  );
};
