import React, { useState } from "react";
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
  mode: "Audio" | "Video";
  roomResponse: any;
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
  const [formState, setFormState] = useState<Room>({
    roomType: "AMA",
    image: "",
    roomTitle: "",
    roomPrivacy: "Public",
    invitedPrivateUsers: [],
    invitedPrivilegeUsers: [],
    audioDevice: "",
    videoDevice: "",
    mode: "Audio",
    roomResponse: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isHostSettingsOpen, setIsHostSettingsOpen] = useState(false);
  const { hasPermission } = useMediaDevices();
  const { amaAgent, liveAgent } = useStream();
  const { createRoom: createAMARoom } = amaAgent;
  const { createRoom: createLiveRoom } = liveAgent;
  const { user } = useUser();
  // Generic input change handler
  const handleInputChange = (field: keyof Room, value: any) => {
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
  };

  const handleNext = async () => {
    if (currentStep === 2 && !formState.roomTitle) {
      toast.error("Room title is required.");
      return;
    }

    if (currentStep === 4) {
      if (
        formState.roomPrivacy === "Private" &&
        formState.invitedPrivateUsers.length === 0
      ) {
        toast.error("Please add at least one user.");
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
        // Reset formState fields based on roomPrivacy
        const updatedFormState = {
          ...formState,
          invitedPrivateUsers:
            formState.roomPrivacy === "Private"
              ? formState.invitedPrivateUsers
              : [],
          invitedPrivilegeUsers:
            formState.roomPrivacy === "Privilege"
              ? formState.invitedPrivilegeUsers
              : [],
        };

        setFormState(updatedFormState); // Update formState locally

        const accessMode: StreamAccessModeEnum =
          updatedFormState.roomPrivacy === "Public"
            ? StreamAccessModeEnum.PUBLIC
            : updatedFormState.roomPrivacy === "Private"
            ? StreamAccessModeEnum.ACCESS_BY_INVITATION
            : StreamAccessModeEnum.ACCESS_BY_TOKEN;

        const type: BroadcastTypeEnum =
          updatedFormState.roomType === "AMA"
            ? BroadcastTypeEnum.AMA
            : BroadcastTypeEnum.LIVE;

        const input: CreateBroadcastDto = {
          name: updatedFormState.roomTitle,
          description: "",
          accessMode,
          type,
          image: updatedFormState.image,
          invitedUsers:
            accessMode === StreamAccessModeEnum.ACCESS_BY_INVITATION
              ? updatedFormState.invitedPrivateUsers.map((u) => u._id)
              : [],
          tokenAddress:
            accessMode === StreamAccessModeEnum.ACCESS_BY_TOKEN
              ? updatedFormState.invitedPrivilegeUsers.map((c) => c.collection)
              : [],
        };

        const createRoom =
          updatedFormState.roomType === "AMA" ? createAMARoom : createLiveRoom;

        if (!user) {
          toast.error("User not found. Please try again.");
          return;
        }
        const response = await createRoom(input, user._id);
        toast.success("Room created successfully!");
        console.log("response::", response);
        setFormState((prev) => ({
          ...prev,
          roomResponse: response,
        }));

        setIsHostSettingsOpen(true);
      } catch (error) {
        toast.error("Failed to create room. Please try again.");
        console.error(error);
      }
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (isHostSettingsOpen) {
    return (
      <ChannelMainView
        onClose={onClose}
        formState={formState}
        component={
          formState.roomType === "AMA" ? "TheRoomOfTraders" : "LiveView"
        }
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
          </span>
          <Button
            title={currentStep === 4 ? "Submit" : "Next"}
            disabled={
              (currentStep === 2 && !hasPermission) ||
              (currentStep === 2 && !formState.image)
            } // Disable on Step 2 if no image
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
