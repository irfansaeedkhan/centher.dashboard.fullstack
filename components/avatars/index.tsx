// React, Next, NPM Packages
import Image from "next/future/image";
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { useAvatars } from "@/hooks/use.avatars";
import { Avatar } from "@/models/avatars";
import { NODE_API_URL } from "@/constants/common";

// Current directory imports
import { ModalWrapper } from "../modal";

const Avatars: React.FC = () => {
  const { avatars } = useAvatars();
  const [avatarModal, setAvatarModal] = useState(false);
  const [profileImage, setProfileImage] = useState<Avatar["name"]>();

  return (
    <div className={mainWrapper}>
      {profileImage !== undefined ? (
        <Image
          src={`${NODE_API_URL}/${profileImage}`}
          className={profileImageClass}
          width={80}
          height={80}
          alt="Profile Image"
        />
      ) : (
        <Image
          src="/images/a1.png"
          className={profileImageClass}
          width={80}
          height={80}
          alt="Profile Image"
        />
      )}
      <button
        className={profileImageButton}
        onClick={() => setAvatarModal(true)}
      >
        Profile Image
      </button>
      {avatarModal && (
        <ModalWrapper onClose={() => setAvatarModal(false)} title={"Avatars"}>
          <div className={modalBodyWrapper}>
            {avatars.map((avatar) => {
              return (
                <Image
                  key={avatar.path}
                  src={`${NODE_API_URL}/${avatar.path}`}
                  alt={avatar.name}
                  className={profileImageClass2}
                  width={80}
                  height={80}
                  onClick={() => {
                    setAvatarModal(false);
                    setProfileImage(avatar.path);
                    // setSignup((prev) => {
                    //   return {
                    //     ...prev,
                    //     profile_image: avatar.path,
                    //   };
                    // });
                  }}
                />
              );
            })}
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default Avatars;

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
