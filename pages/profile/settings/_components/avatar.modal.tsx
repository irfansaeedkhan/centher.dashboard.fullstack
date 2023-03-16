// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";

// App imports
import { useAvatars } from "@/hooks/use.avatars";
import { ModalWrapper } from "@/components/modal";
import { UserImage } from "@/models/user";

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarSelect: (avatar: UserImage) => void;
}

const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  onAvatarSelect,
}) => {
  const { avatars } = useAvatars();

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={"Avatars"}
      bodyWrapper="flex justify-center"
    >
      <div
        className={`m-0 flex w-full max-w-[28rem] flex-wrap items-center justify-center gap-4`}
      >
        {avatars.map((avatar) => {
          return (
            <Image
              key={avatar.path}
              src={avatar.path}
              alt={avatar.name}
              width={80}
              height={80}
              onClick={() => {
                onAvatarSelect(avatar);
                onClose();
              }}
              className={`cursor-pointer rounded-full bg-gray-shade-3 object-cover`}
            />
          );
        })}
      </div>
    </ModalWrapper>
  );
};

export default AvatarModal;
