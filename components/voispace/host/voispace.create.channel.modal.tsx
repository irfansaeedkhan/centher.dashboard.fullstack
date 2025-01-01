import React, { useState, useEffect } from "react";
import ModalContainer from "@/components/modal/modal-container";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import { SearchResultWithType, search } from "@/lib/search";
import { getSingleCollection } from "@/lib/get-single-collection";
import { CFSCollection } from "@/models/nft";
import { FindUsers } from "../shared/search.user";
import { TextLengthChecker } from "../shared/text.length.checker";
import { RemoveUser } from "../shared/remove.user";
import { MdOutlineExpandLess } from "react-icons/md";
import Button from "@/components/button";
import { SearchedPrivilegeCollection } from "../shared/search.privilege";
import { RemovePrivilegeCollection } from "../shared/remove.privilege.collection";
import { MicIcon, MicIcon2, SearchIcon, VideoIcon2 } from "@/assets/svgs";
import DynamicComponent from "./HostMainView";
import HostViewMain from "./HostMainView";

export interface Room {
  roomType: "AMA" | "Live";
  roomTitle: string;
  roomPrivacy: "Public" | "Private" | "Privilege";
  invitedPrivateUsers: SearchResultWithType[];
  invitedPrivilegeUsers: CFSCollection[];
  audioDevice: string;
  videoDevice: string;
  mode: "Audio" | "Video";
}

export interface roomType {
  image: string;
  live: boolean;
  eventName: string;
}

interface Props {
  onClose: () => void;
}

export const VoispaceCreateChannelModal: React.FC<Props> = ({ onClose }) => {
  const [formState, setFormState] = useState<Room>({
    roomType: "AMA",
    roomTitle: "",
    roomPrivacy: "Public",
    invitedPrivateUsers: [],
    invitedPrivilegeUsers: [],
    audioDevice: "",
    videoDevice: "",
    mode: "Audio",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isHostSettingsOpen, setIsHostSettingsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultWithType[]>(
    []
  );
  const [searchedValue, setSearchedValue] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [privalegeCollection, setPrivilegeCollection] =
    useState<CFSCollection | null>(null);

  const handleInputChange = (field: keyof Room, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
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
      setIsHostSettingsOpen(true);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  // Handle collection input for privilege users
  useEffect(() => {
    async function getPrivilegeCollection() {
      try {
        const collection = await getSingleCollection(collectionAddress);
        setPrivilegeCollection(collection);
      } catch (err: any) {
        setPrivilegeCollection(null);
        toast.error(err.message);
      }
    }

    if (collectionAddress) {
      getPrivilegeCollection();
    }
  }, [collectionAddress]);

  if (isHostSettingsOpen) {
    return <HostViewMain onClose={onClose} formState={formState} />;
  }

  // Handle search input for private users
  const handleInvitePrivateUser = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchedValue(event.target.value);
    const userId = event.target.value;

    if (!userId.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await search(userId);
      setSearchResults(results);
    } catch (err: any) {
      setSearchResults([]);
    }
  };

  const handleInviteClick = (user: SearchResultWithType) => {
    if (formState.invitedPrivateUsers.find((u) => u._id === user._id)) {
      toast.error("User is already invited");
      return;
    }
    setFormState((prev) => ({
      ...prev,
      invitedPrivateUsers: [...prev.invitedPrivateUsers, user],
    }));
    setSearchResults([]);
    setSearchedValue("");
  };

  const handleAddCollection = (collection: CFSCollection) => {
    if (
      formState.invitedPrivilegeUsers.find(
        (c) => c.collection === collection.collection
      )
    ) {
      toast.error("Collection is already added");
      return;
    }
    setFormState((prev) => ({
      ...prev,
      invitedPrivilegeUsers: [...prev.invitedPrivilegeUsers, collection],
    }));
    setPrivilegeCollection(null);
    setCollectionAddress("");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-6">
            <div className={`text-xl font-medium text-white`}>
              Dive into <span className={`text-gradient-1`}>VoiceSpace</span>
            </div>
            <div className="flex flex-col gap-4">
              <div
                onClick={() => handleInputChange("roomType", "AMA")}
                className={clsx(
                  "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
                  formState.roomType === "AMA" && "gradient-borders-div"
                )}
              >
                <div className="px-4 pt-2 text-base font-medium text-white">
                  AMA
                </div>
                <div className={`px-4 pb-2 text-sm font-normal text-[#A0A4BB]`}>
                  Explore the endless possibilities of conversation
                </div>
              </div>
              <div
                onClick={() => handleInputChange("roomType", "Live")}
                className={clsx(
                  "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
                  formState.roomType === "Live" && "gradient-borders-div"
                )}
              >
                <div className="px-4 pt-2 text-base font-medium text-white">
                  Live
                </div>
                <div className={`px-4 pb-2 text-sm font-normal text-[#A0A4BB]`}>
                  Engage in real-time discussions, ask and experience
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
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
                  onChange={(e) =>
                    handleInputChange("roomTitle", e.target.value)
                  }
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
                      <option value="External Microphone">
                        External Microphone
                      </option>
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
      case 3:
        return (
          <div className="flex flex-col gap-6">
            <div className={`text-xl font-medium text-white`}>
              Dive into <span className={`text-gradient-1`}>VoiceSpace</span>
            </div>
            <div className="flex w-full flex-col gap-4">
              <div
                onClick={() => handleInputChange("roomPrivacy", "Public")}
                className={clsx(
                  "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
                  formState.roomPrivacy === "Public" && "gradient-borders-div"
                )}
              >
                <div className="px-4 pt-2 text-base font-medium text-white">
                  Public
                </div>
                <div className={`px-4 pb-2 text-sm font-normal text-[#A0A4BB]`}>
                  Everyone can join this Voispace Room
                </div>
              </div>
              <div
                onClick={() => handleInputChange("roomPrivacy", "Private")}
                className={clsx(
                  "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
                  formState.roomPrivacy === "Private" && "gradient-borders-div"
                )}
              >
                <div className="px-4 pt-2 text-base font-medium text-white">
                  Private
                </div>
                <div className={`px-4 pb-2 text-sm font-normal text-[#A0A4BB]`}>
                  In next step you will add people manually or by invite links
                </div>
              </div>

              <div
                onClick={() => handleInputChange("roomPrivacy", "Privilege")}
                className={clsx(
                  "cursor-pointer rounded-2xl bg-[#141416] p-[1px]",
                  formState.roomPrivacy === "Privilege" &&
                    "gradient-borders-div"
                )}
              >
                <div className="px-4 pt-2 text-base font-medium text-white">
                  Privilege
                </div>
                <div className={`px-4 pb-2 text-sm font-normal text-[#A0A4BB]`}>
                  In next step you will add collection address to get started
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        if (formState.roomPrivacy === "Public") {
          setIsHostSettingsOpen(true);
          return null;
        }
        if (formState.roomPrivacy === "Private") {
          return (
            <div className="flex flex-col gap-6">
              <div className={`text-xl font-medium text-white`}>
                Dive into <span className={`text-gradient-1`}>VoiceSpace</span>
              </div>
              <div className="relative rounded-xl bg-[#141416] px-3 py-1">
                <div className="flex items-center">
                  <SearchIcon className="h-7 w-7 opacity-70" />
                  <input
                    className="w-full border-none bg-[#141416] text-sm font-medium text-white focus:outline-none focus:ring-0"
                    placeholder="Invite people"
                    value={searchedValue}
                    onChange={handleInvitePrivateUser}
                  />
                  {!!searchResults.length && (
                    <div className="customScrollbar absolute top-full z-10 mt-1.5 max-h-[195px] w-full overflow-y-auto rounded-xl bg-popup-0">
                      {searchResults.map((result) => (
                        <FindUsers
                          key={result._id}
                          user={result}
                          onInviteClick={handleInviteClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {formState.invitedPrivateUsers.length > 0 && (
                <div className="mt-4">
                  <div className="text-[#A0A4BB]">Invited People</div>
                  {formState.invitedPrivateUsers.map((user) => (
                    <RemoveUser
                      key={user._id}
                      user={user}
                      onRemoveClick={() =>
                        setFormState((prev) => ({
                          ...prev,
                          invitedPrivateUsers: prev.invitedPrivateUsers.filter(
                            (u) => u._id !== user._id
                          ),
                        }))
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          );
        }
        if (formState.roomPrivacy === "Privilege") {
          return (
            <div className="flex flex-col gap-6">
              <div className={`text-xl font-medium text-white`}>
                Dive into <span className={`text-gradient-1`}>VoiceSpace</span>
              </div>
              <div className="relative rounded-xl bg-[#141416] px-3 py-1">
                <div className="flex items-center">
                  <SearchIcon className="h-7 w-7 opacity-70" />
                  <input
                    className="w-full border-none bg-[#141416] text-sm font-medium text-white focus:outline-none focus:ring-0"
                    placeholder="Past collection address here"
                    value={collectionAddress}
                    onChange={(e) => setCollectionAddress(e.target.value)}
                  />
                  {privalegeCollection && (
                    <div className="absolute top-full z-10 mt-1.5 bg-popup-0">
                      <SearchedPrivilegeCollection
                        collection={privalegeCollection}
                        onAddClick={handleAddCollection}
                      />
                    </div>
                  )}
                </div>
              </div>
              {formState.invitedPrivilegeUsers.length > 0 && (
                <div className="mt-4">
                  <div className="text-[#A0A4BB]">Invited Privileged Users</div>
                  {formState.invitedPrivilegeUsers.map((collection) => (
                    <RemovePrivilegeCollection
                      key={collection.collection}
                      collection={collection}
                      onRemoveClick={() =>
                        setFormState((prev) => ({
                          ...prev,
                          invitedPrivilegeUsers:
                            prev.invitedPrivilegeUsers.filter(
                              (c) => c.collection !== collection.collection
                            ),
                        }))
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          );
        }
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
        <div
          className={`mb-0 flex items-center justify-between rounded-t px-4 py-4 md:py-4`}
        >
          <span>
            {currentStep !== 1 && (
              <button onClick={handleBack} disabled={currentStep === 1}>
                <MdOutlineExpandLess className="h-7 w-7 -rotate-90 text-white" />
              </button>
            )}
          </span>

          <span className={`py-1 text-xl font-semibold text-white`}>
            Create New Room
          </span>
          <Button
            title={currentStep === 4 ? "Submit" : "Next"}
            variant="primary"
            onClick={handleNext}
            borderRounded="10px"
            className={` text-xs font-medium`}
          />
        </div>
      </div>
      <div className="p-6">{renderStepContent()}</div>
    </ModalContainer>
  );
};
