// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

// App imports
import FinalButton from "@/components/button/final.button";
import { AvatarModalWrapper } from "@/components/modal/avatar.modal.wrapper";
import { useAvatars } from "@/hooks/use.avatars";
import { UserImage } from "@/models/user";
import { Avatar } from "@/models/avatars";

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
  const [slectedAvatar, setSlectedAvatar] = useState<Avatar | null>(null);

  return (
    <AvatarModalWrapper
      isOpen={isOpen}
      onClose={() => {
        setSlectedAvatar(null);
        onClose();
      }}
      title={"Choose avatar"}
      bodyWrapper="flex justify-center flex-col gap-5 items-center"
    >
      <div
        className={`scrollSetLight m-0 flex h-auto max-h-[500px] w-full max-w-[550px] flex-wrap items-center justify-center gap-8 overflow-auto px-4 pt-4`}
      >
        {avatars.map((avatar) => {
          return (
            <div
              key={avatar.path}
              className={clsx(
                slectedAvatar === avatar &&
                  `gradient-border-3 h-[72px] w-[72px] rounded-full p-[2px]`
              )}
            >
              <Image
                src={avatar.path}
                alt={avatar.name}
                width={72}
                height={72}
                onClick={() => {
                  setSlectedAvatar(avatar);
                }}
                className={clsx(
                  `cursor-pointer rounded-full bg-gray-shade-3 object-cover`
                )}
              />
            </div>
          );
        })}
      </div>
      <div className="w-full px-4">
        {slectedAvatar ? (
          <FinalButton
            title="Choose"
            variant="primary"
            onClick={() => {
              onAvatarSelect(slectedAvatar);
              onClose();
              setSlectedAvatar(null);
            }}
            disabled={!slectedAvatar}
            className="w-full"
          />
        ) : (
          <FinalButton
            title="Choose"
            variant="primary"
            disabled={!slectedAvatar}
            className="w-full"
          />
        )}
      </div>
    </AvatarModalWrapper>
  );
};

export default AvatarModal;
