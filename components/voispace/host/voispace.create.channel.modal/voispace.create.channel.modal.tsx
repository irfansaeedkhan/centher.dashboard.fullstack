import React, { useCallback, useEffect, useState } from "react";
import { MdOutlineExpandLess } from "react-icons/md";

import ModalContainer from "@/components/modal/modal-container";
import Button from "@/components/button";
import toast from "react-hot-toast";
import useMediaDevices from "hooks/use.get.media.devices/index";

import { BroadcastPreviewDto } from "@/hooks/stream/dto/broadcast-preview.dto";
import { useStream } from "@/hooks/stream/use.core";
import useUser from "@/hooks/use.user";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { CreateBroadcastDto } from "@/stream/types/Broadcast";

import AMAOrLive from "./steps/AMAOrLive";
import PermissionsAndDetails from "./steps/PermissionsAndDetails";
import Accessibility from "./steps/Accessibility";
import StepFour from "./steps/step.four";
import ChannelMainView from "../../shared/ChannelMainView";
import { StreamEventEnum } from "@/stream/model";
import { RoomData } from "../../voispace.feed.card";
import { CreatRoomSteps } from "./enums";

interface Props {
  onClose: () => void;
}

export interface Room {
  roomType: "AMA" | "Live";
  roomTitle: string;
  roomPrivacy: "Public" | "Private" | "Privilege";
  invitedPrivateUsers: SearchResultWithType[];
  invitedPrivilegeUsers: CFSCollection[];
  image: string;
  audioDevice: string;
  videoDevice: string;
  hasPermission: Boolean;
  mode: "Audio" | "Video";
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
  const [isHostSettingsOpen, setIsHostSettingsOpen] = useState(false);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const { hasPermission } = useMediaDevices();
  const { amaAgent, liveAgent, useSubscribeToAllBroadcasts } = useStream();
  const streamPromise = useSubscribeToAllBroadcasts();
  const { createRoom: createAMARoom, event: eventOnAMA } = amaAgent;
  const { createRoom: createLiveRoom, event: eventOnLive } = liveAgent;
  const { user } = useUser();

  const [formState, setFormState] = useState<Room>({
    roomType: "AMA",
    image: "",
    roomTitle: "",
    roomPrivacy: "Public",
    invitedPrivateUsers: [],
    invitedPrivilegeUsers: [],
    audioDevice: "",
    videoDevice: "",
    hasPermission: hasPermission,
    mode: "Audio",
  });

  // Add this near other useEffects
  useEffect(() => {
    console.log("eventOnAMA", eventOnAMA);
    if (eventOnAMA?.type === StreamEventEnum.ON_CREATE_CENTALK) {
      const newRoomData: RoomData = {
        id: eventOnAMA.data.id,
        type: "AMA",
        roomPrivacy: formState.roomPrivacy,
      };

      setRoomData(newRoomData);
      setIsHostSettingsOpen(true);
      toast.success("Room created successfully!");
    }
  }, [eventOnAMA, formState.roomPrivacy]);

  // useEffect(() => {
  //   setFormState((prev) => ({
  //     ...prev,
  //     hasPermission,
  //   }));
  // }, [hasPermission]);

  // Generic input change handler

  const handleInputChange = useCallback(
    (field: keyof Room, value: any) => {
      setFormState((prev) => {
        const updatedState = { ...prev, [field]: value };

        if (field === "roomPrivacy") {
          updatedState.invitedPrivateUsers =
            value === "Private" ? prev.invitedPrivateUsers : [];
          updatedState.invitedPrivilegeUsers =
            value === "Privilege" ? prev.invitedPrivilegeUsers : [];
        }

        return updatedState;
      });
    },
    [setFormState]
  );

  const handleNext = async () => {
    console.log(formState);

    // Step 2: Validation for room title and image
    if (currentStep === CreatRoomSteps.PERMISSIONS_AND_DETAILS) {
      if (!formState.roomTitle) {
        toast.error("Room title is required.");
        return;
      }
      if (!formState.image) {
        toast.error("Image is required.");
        return;
      }
      if (!hasPermission) {
        toast.error("Permission is required.");
        return;
      }
    }

    // Step 3: Validation for audio device
    if (
      currentStep === CreatRoomSteps.ACCESSIBILITY &&
      !formState.audioDevice
    ) {
      toast.error("Audio device is required.");
      return;
    }

    if (currentStep === CreatRoomSteps.ACCESSIBILITY) {
      // Perform validation for Step 3
      if (!formState.audioDevice) {
        toast.error("Audio device is required.");
        return;
      }

      if (!formState.roomTitle) {
        toast.error("Room title is required.");
        return;
      }

      if (!formState.image) {
        toast.error("Room image is required.");
        return;
      }

      if (formState.roomPrivacy === "Public") {
        try {
          const accessMode = StreamAccessModeEnum.PUBLIC;
          const type =
            formState.roomType === "AMA"
              ? BroadcastTypeEnum.AMA
              : BroadcastTypeEnum.LIVE;

          const input: CreateBroadcastDto = {
            name: formState.roomTitle,
            description: "",
            accessMode,
            type,
            image: formState.image,
            invitedUsers: [],
            tokenAddress: [],
          };

          const createRoom =
            formState.roomType === "AMA" ? createAMARoom : createLiveRoom;

          if (!user) {
            toast.error("User not found. Please try again.");
            return;
          }

          await createRoom(input, user._id);

          // const roomEvent =
          //   formState.roomType === "AMA" ? amaAgent.event : liveAgent.event;
          // if (
          //   roomEvent &&
          //   roomEvent.type === StreamEventEnum.ON_CREATE_CENTALK
          // ) {
          //   console.log("Room Created with ID:", roomEvent.data.id);

          //   // room data to be passed to the main view
          //   const newRoomData: RoomData = {
          //     id: roomEvent.data.id,
          //     type: formState.roomType,
          //     roomPrivacy: formState.roomPrivacy,
          //   };

          //   setRoomData(newRoomData);
          //   setIsHostSettingsOpen(true);
          //   toast.success("Public room created successfully!");
          // } else {
          //   toast.error("Failed to create public room.");
          // }
        } catch (error) {
          toast.error("Failed to create public room. Please try again.");
          console.error("Error creating public room:", error);
        }
        return;
      }
      // Proceed to Step 4 for Private/Privilege rooms
      setCurrentStep(CreatRoomSteps.ROOM);
      return;
    }

    if (currentStep === CreatRoomSteps.ROOM) {
      // Perform validation specific to Step 4
      if (
        formState.roomPrivacy === "Private" &&
        formState.invitedPrivateUsers.length === 0
      ) {
        toast.error("Please add at least one user for a private room.");
        return;
      }

      if (
        formState.roomPrivacy === "Privilege" &&
        formState.invitedPrivilegeUsers.length === 0
      ) {
        toast.error("Please add at least one privilege user.");
        return;
      }

      try {
        const accessMode =
          formState.roomPrivacy === "Private"
            ? StreamAccessModeEnum.ACCESS_BY_INVITATION
            : StreamAccessModeEnum.ACCESS_BY_TOKEN;

        const type =
          formState.roomType === "AMA"
            ? BroadcastTypeEnum.AMA
            : BroadcastTypeEnum.LIVE;

        const input: CreateBroadcastDto = {
          name: formState.roomTitle,
          description: "",
          accessMode,
          type,
          image: formState.image,
          invitedUsers:
            formState.roomPrivacy === "Private"
              ? formState.invitedPrivateUsers.map((u) => u._id)
              : [],
          tokenAddress:
            formState.roomPrivacy === "Privilege"
              ? formState.invitedPrivilegeUsers.map((c) => c.collection)
              : [],
        };

        const createRoom =
          formState.roomType === "AMA" ? createAMARoom : createLiveRoom;

        if (!user) {
          toast.error("User not found. Please try again.");
          return;
        }

        await createRoom(input, user._id);

        const roomEvent =
          formState.roomType === "AMA" ? amaAgent.event : liveAgent.event;

        if (roomEvent && roomEvent.type === StreamEventEnum.ON_CREATE_CENTALK) {
          console.log("Room Created with ID:", roomEvent.data.id);

          // room data to be passed to the main view
          const newRoomData: RoomData = {
            id: roomEvent.data.id,
            type: formState.roomType,
            roomPrivacy: formState.roomPrivacy,
          };

          setRoomData(newRoomData);
          setIsHostSettingsOpen(true);
          toast.success("Room created successfully!");
        } else {
          toast.error("Failed to create room.");
        }
      } catch (error) {
        toast.error("Failed to create room. Please try again.");
        console.error("Error creating room:", error);
      }
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
        component={roomData?.type === "AMA" ? "TheRoomOfTraders" : "LiveView"}
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
            setLoading={setLoading}
          />
        );
      case CreatRoomSteps.ACCESSIBILITY:
        return (
          <Accessibility
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case CreatRoomSteps.ROOM:
        return (
          <StepFour
            formState={formState}
            setFormState={setFormState}
            setIsHostSettingsOpen={setIsHostSettingsOpen}
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
      isOpen={true}
      modalContentClassName="max-w-[656px] p-0 rounded-3xl"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={currentStep === CreatRoomSteps.AMA_OR_LIVE}
    >
      <div className="header border-b-2 border-[#141416]">
        <div className="mb-0 flex items-center justify-between rounded-t px-4 py-4 md:py-4">
          <span>
            {currentStep !== CreatRoomSteps.AMA_OR_LIVE && (
              <button onClick={handleBack}>
                <MdOutlineExpandLess className="h-7 w-7 -rotate-90 text-white" />
              </button>
            )}
          </span>
          <span className="py-1 text-xl font-semibold text-white">
            Create New Room
            {/* {formState.hasPermission.toString()}{ loading.toString() } {formState.image}  */}
          </span>
          <Button
            title={
              loading && currentStep === CreatRoomSteps.PERMISSIONS_AND_DETAILS
                ? "Uploading..."
                : currentStep === CreatRoomSteps.ROOM
                ? "Submit"
                : "Next"
            }
            disabled={loading}
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
