import { ModalWrapper } from "@/components/modal";
import { NODE_API_URL } from "@/constants/common";
import { useAvatars } from "@/hooks/use.avatars";
import ctl from "@netlify/classnames-template-literals";
import Image from "next/future/image";
import React, { useState } from "react";

const AvatarModal = () => {
  const { avatars } = useAvatars();
  const [avatarModal, setAvatarModal] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  return (
    <ModalWrapper onClose={() => setAvatarModal(false)} title={"Avatars"}>
      <div className={modalBodyWrapper}>
        {avatars.map((avatar) => {
          return (
            <Image
              key={avatar.path}
              src={`${NODE_API_URL}${avatar.path}`}
              alt={avatar.name}
              className={profileImageClass2}
              width={80}
              height={80}
              onClick={() => {
                setAvatarModal(false);
                setProfileImage(avatar.path);

                // {
                //   onSelect && onSelect(avatar.path);
                // }
              }}
            />
          );
        })}
      </div>
    </ModalWrapper>
  );
};

export default AvatarModal;

const mainWrapper = ctl(`
  flex 
  gap-2 
  items-center
`);

const profileImageButton = ctl(`
  px-3 
  py-2 
  font-bold 
  rounded-lg 
  text-black
  bg-brand-primary 
`);

const modalBodyWrapper = ctl(`
  flex 
  gap-4 
  w-full 
  flex-wrap
  items-center 
  justify-center 
`);

const profileImageClass = ctl(`
  object-cover
  rounded-full 
  bg-gray-shade-3 
`);
const profileImageClass2 = ctl(`
  ${profileImageClass}
  cursor-pointer
`);
