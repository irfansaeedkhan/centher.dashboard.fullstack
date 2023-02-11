// React, Next, NPM Packages
import Image from "next/image";
import React, { useState } from "react";

// App imports
import { ModalWrapper } from "@/components/modal";
import { useAvatars } from "@/hooks/use.avatars";
import { UserImage } from "@/models/user";
import { getBackendUrl } from "@/constants/common";

const BACKEND_HTTP_URL = getBackendUrl("http", "frontend-to-backend");

interface AvatarProps {
  defaultAvatar: UserImage["path"];
  onSelect: (avatart: UserImage["path"]) => void;
}

const Avatars: React.FC<AvatarProps> = ({ defaultAvatar, onSelect }) => {
  const { avatars } = useAvatars();
  const [avatarModal, setAvatarModal] = useState(false);
  const [profileImage, setProfileImage] =
    useState<UserImage["path"]>(defaultAvatar);

  return (
    <div
      className={`
  flex 
  items-center 
  gap-2
`}
    >
      <Image
        src={`${BACKEND_HTTP_URL}${profileImage}`}
        className={`
  rounded-full
  bg-gray-shade-3 
  object-cover 
`}
        width={80}
        height={80}
        alt="Profile Image"
      />

      <button
        className={`
  rounded-lg 
  bg-brand-primary 
  px-3 
  py-2 
  font-bold
  text-black 
`}
        onClick={() => setAvatarModal(true)}
      >
        Profile Image
      </button>

      <ModalWrapper
        isOpen={avatarModal}
        onClose={() => setAvatarModal(false)}
        title={"Avatars"}
      >
        <div
          className={`
  flex 
  w-full 
  flex-wrap 
  items-center
  justify-center 
  gap-4 
`}
        >
          {avatars.map((avatar) => {
            return (
              <Image
                key={avatar.path}
                src={`${BACKEND_HTTP_URL}${avatar.path}`}
                alt={avatar.name}
                className={`
  ${`
  rounded-full
  bg-gray-shade-3 
  object-cover 
`}
  cursor-pointer
`}
                width={80}
                height={80}
                onClick={() => {
                  setAvatarModal(false);
                  setProfileImage(avatar.path);
                  onSelect(avatar.path);
                }}
              />
            );
          })}
        </div>
      </ModalWrapper>
    </div>
  );
};

export default Avatars;
