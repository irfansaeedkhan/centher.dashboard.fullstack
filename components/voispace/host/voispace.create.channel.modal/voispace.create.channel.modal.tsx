import React, { useCallback, useEffect, useState } from "react";
import { MdOutlineExpandLess } from "react-icons/md";

import ModalContainer from "@/components/modal/modal-container";
import Button from "@/components/button";
import toast from "react-hot-toast";
import useMediaDevices from "hooks/use.get.media.devices/index";
import { useStream } from "@/hooks/stream/use.core";
import useUser from "@/hooks/use.user";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import { CreateBroadcastDto } from "@/stream/types/Broadcast";

import StepOne from "./steps/step.one";
import StepTwo from "./steps/step.two";
import StepThree from "./steps/step.three";
import StepFour from "./steps/step.four";
import ChannelMainView from "../../shared/ChannelMainView";
import { StreamEventEnum } from "@/stream/model";
import { RoomData } from "../../voispace.feed.card";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isHostSettingsOpen, setIsHostSettingsOpen] = useState(false);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const { hasPermission } = useMediaDevices();
  const { amaAgent, liveAgent, useSubscribeToAllBroadcasts } = useStream();
  const streamPromise = useSubscribeToAllBroadcasts();
  const { createRoom: createAMARoom } = amaAgent;
  const { createRoom: createLiveRoom } = liveAgent;
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
    if (currentStep === 2) {
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
    if (currentStep === 3 && !formState.audioDevice) {
      toast.error("Audio device is required.");
      return;
    }

    if (currentStep === 3) {
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

          const roomEvent =
            formState.roomType === "AMA" ? amaAgent.event : liveAgent.event;
          if (
            roomEvent &&
            roomEvent.type === StreamEventEnum.ON_CREATE_CENTALK
          ) {
            console.log("Room Created with ID:", roomEvent.data.id);

            // room data to be passed to the main view
            const newRoomData: RoomData = {
              id: roomEvent.data.id,
              type: formState.roomType,
              roomPrivacy: formState.roomPrivacy,
            };

            setRoomData(newRoomData);
            setIsHostSettingsOpen(true);
            toast.success("Public room created successfully!");
          } else {
            toast.error("Failed to create public room.");
          }
        } catch (error) {
          toast.error("Failed to create public room. Please try again.");
          console.error("Error creating public room:", error);
        }
        return;
      }
      // Proceed to Step 4 for Private/Privilege rooms
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
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
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

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
      case 1:
        return (
          <StepOne
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <StepTwo
            formState={formState}
            handleInputChange={handleInputChange}
            setLoading={setLoading}
          />
        );
      case 3:
        return (
          <StepThree
            formState={formState}
            handleInputChange={handleInputChange}
          />
        );
      case 4:
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
      shouldCloseOnOverlayClick={currentStep === 1}
    >
      <div className="header border-b-2 border-[#141416]">
        <div className="mb-0 flex items-center justify-between rounded-t px-4 py-4 md:py-4">
          <span>
            {currentStep !== 1 && (
              <button onClick={handleBack} disabled={currentStep === 1}>
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
              loading && currentStep === 2
                ? "Uploading..."
                : currentStep === 4
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
