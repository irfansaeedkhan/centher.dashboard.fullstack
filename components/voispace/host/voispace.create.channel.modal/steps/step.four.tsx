import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";

import { search, SearchResultWithType } from "@/lib/search";
import { SearchIcon } from "@/assets/svgs";
import { FindUsers } from "@/components/voispace/shared/search.user";
import { RemoveUser } from "@/components/voispace/shared/remove.user";
import { SearchedPrivilegeCollection } from "@/components/voispace/shared/search.privilege";
import { RemovePrivilegeCollection } from "@/components/voispace/shared/remove.privilege.collection";
import { Room } from "../voispace.create.channel.modal";
import { StreamAccessModeEnum } from "@/stream/enum/stream-access-mode.enum";
import { useStream } from "@/hooks/stream/use.core";
import { Collection } from "@/hooks/stream/types";

interface StepFourProps {
  formState: Room;
  setFormState: React.Dispatch<React.SetStateAction<any>>;
  setIsHostSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

const StepFour: React.FC<StepFourProps> = ({
  formState,
  setFormState,
  setIsHostSettingsOpen,
  loading,
}) => {
  const [searchResults, setSearchResults] = useState<SearchResultWithType[]>(
    []
  );
  const [searchedValue, setSearchedValue] = useState<string>("");
  const [collectionAddress, setCollectionAddress] = useState<string>("");
  const [privilegeCollections, setPrivilegeCollections] = useState<
    Collection[]
  >([]);
  const [activePopup, setActivePopup] = useState<
    "private" | "privilege" | null
  >(null);

  const privatePopupRef = useRef<HTMLDivElement | null>(null);
  const privilegePopupRef = useRef<HTMLDivElement | null>(null);

  const { useQueryToGetCollections } = useStream();
  const { data: validCollections } =
    useQueryToGetCollections(collectionAddress);

  useEffect(() => {
    if (validCollections) {
      setPrivilegeCollections(validCollections);
    }
  }, [validCollections]);

  const handleAddCollection = (collection: Collection) => {
    if (
      formState.invitedPrivilegeUsers.find(
        (c: any) => c.collection === collection.collection
      )
    ) {
      toast.error("Collection is already added");
      return;
    }
    setFormState((prev: any) => ({
      ...prev,
      invitedPrivilegeUsers: [...prev.invitedPrivilegeUsers, collection],
    }));
    setCollectionAddress("");
    setPrivilegeCollections([]);
    setActivePopup(null);
  };

  const handleInvitePrivateUser = async (value: string) => {
    setSearchedValue(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await search(value);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    }
  };

  const handleInviteClick = (user: SearchResultWithType) => {
    if (formState.invitedPrivateUsers.find((u: any) => u._id === user._id)) {
      toast.error("User is already invited");
      return;
    }
    setFormState((prev: any) => ({
      ...prev,
      invitedPrivateUsers: [...prev.invitedPrivateUsers, user],
    }));
    setSearchResults([]);
    setSearchedValue("");
    setActivePopup(null);
  };

  const handlePopupOpen = (popupType: "private" | "privilege") => {
    setActivePopup(popupType);

    if (popupType === "privilege" && !privilegeCollections.length) {
      setCollectionAddress((prev) => prev || "");
    }
  };

  const handlePopupClose = (e: MouseEvent) => {
    if (
      activePopup === "private" &&
      privatePopupRef.current &&
      !privatePopupRef.current.contains(e.target as Node)
    ) {
      setActivePopup(null);
    } else if (
      activePopup === "privilege" &&
      privilegePopupRef.current &&
      !privilegePopupRef.current.contains(e.target as Node)
    ) {
      setActivePopup(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handlePopupClose);
    return () => {
      document.removeEventListener("mousedown", handlePopupClose);
    };
  }, [activePopup]);

  if (formState.accessMode === StreamAccessModeEnum.PUBLIC) {
    setIsHostSettingsOpen(true);
    return null;
  }

  return (
    <div
      className={clsx(
        `flex flex-col gap-6`,
        loading && "pointer-events-none opacity-50"
      )}
    >
      <div className={`text-xl font-medium text-white`}>
        Dive into <span className={`text-gradient-1`}>VoiSpace</span>
      </div>

      {/* PRIVATE ROOMS */}
      {formState.accessMode === StreamAccessModeEnum.ACCESS_BY_INVITATION && (
        <>
          <div className="relative rounded-xl bg-[#141416] px-3 py-1">
            <div
              className="flex items-center"
              onFocus={() => handlePopupOpen("private")}
            >
              <SearchIcon className="h-7 w-7 opacity-70" />
              <input
                className="w-full border-none bg-[#141416] text-sm font-medium text-white focus:outline-none focus:ring-0"
                placeholder="Invite people"
                value={searchedValue}
                onChange={(e) => handleInvitePrivateUser(e.target.value)}
              />
              {activePopup === "private" && !!searchResults.length && (
                <div
                  className="absolute top-full z-10 mt-1.5 max-h-[195px] w-full overflow-y-auto rounded-xl bg-popup-0"
                  ref={privatePopupRef}
                >
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
              {formState.invitedPrivateUsers.map((user: any) => (
                <RemoveUser
                  key={user._id}
                  user={user}
                  onRemoveClick={() =>
                    setFormState((prev: any) => ({
                      ...prev,
                      invitedPrivateUsers: prev.invitedPrivateUsers.filter(
                        (u: any) => u._id !== user._id
                      ),
                    }))
                  }
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* PRIVILEGE ROOMS */}
      {formState.accessMode === StreamAccessModeEnum.ACCESS_BY_TOKEN && (
        <>
          <div className="relative rounded-xl bg-[#141416] px-3 py-1">
            <div
              className="flex items-center"
              onFocus={() => handlePopupOpen("privilege")}
            >
              <SearchIcon className="h-7 w-7 opacity-70" />
              <input
                className="w-full border-none bg-[#141416] text-sm font-medium text-white focus:outline-none focus:ring-0"
                placeholder="Paste collection address here"
                value={collectionAddress}
                onChange={(e) => setCollectionAddress(e.target.value)} // Only change when user types
              />
            </div>
            {activePopup === "privilege" && !!privilegeCollections.length && (
              <div
                className="absolute top-full z-10 mt-1.5 max-h-[195px] w-full overflow-y-auto rounded-xl bg-popup-0"
                ref={privilegePopupRef}
              >
                {privilegeCollections.map((collection: Collection) => (
                  <SearchedPrivilegeCollection
                    key={collection.collection}
                    collection={collection}
                    onAddClick={handleAddCollection}
                  />
                ))}
              </div>
            )}
          </div>
          {formState.invitedPrivilegeUsers.length > 0 && (
            <div className="mt-4">
              <div className="text-[#A0A4BB]">Privileged NFT Collection</div>
              {formState.invitedPrivilegeUsers.map((collection: any) => (
                <RemovePrivilegeCollection
                  key={collection.collection}
                  collection={collection}
                  onRemoveClick={() =>
                    setFormState((prev: any) => ({
                      ...prev,
                      invitedPrivilegeUsers: prev.invitedPrivilegeUsers.filter(
                        (c: any) => c.collection !== collection.collection
                      ),
                    }))
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StepFour;
