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
        className={`flex gap-4 w-full flex-wrap items-center justify-center max-w-[28rem] m-0`}
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
              className={`object-cover rounded-full bg-gray-shade-3 cursor-pointer`}
            />
          );
        })}
      </div>
    </ModalWrapper>
  );
};

export default AvatarModal;
