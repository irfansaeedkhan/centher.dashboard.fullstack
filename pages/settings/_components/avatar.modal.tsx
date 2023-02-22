// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";

// App imports
import { useAvatars } from "@/hooks/use.avatars";
import { AvatarModalWrapper } from "@/components/modal/avatar.modal.wrapper";
import { UserImage } from "@/models/user";
import { Avatar } from "@/models/avatars";
import clsx from "clsx";

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
      bodyWrapper="flex justify-center"
    >
      <div
        className={`m-0 flex w-full max-w-[536px] flex-wrap items-center justify-center gap-10`}
      >
        {avatars.map((avatar) => {
          return (
            <Image
              key={avatar.path}
              src={avatar.path}
              alt={avatar.name}
              width={92}
              height={92}
              onClick={() => {
                setSlectedAvatar(avatar);
              }}
              className={clsx(
                `cursor-pointer rounded-full bg-gray-shade-3 object-cover focus:outline-brand-primary`,
                slectedAvatar === avatar && `ring-2 ring-brand-primary`
              )}
            />
          );
        })}
        {slectedAvatar ? (
          <button
            onClick={() => {
              onAvatarSelect(slectedAvatar);
              onClose();
              setSlectedAvatar(null);
            }}
            className="w-full rounded-lg bg-brand-primary py-[10px] text-base font-bold leading-6 text-black"
          >
            Choose
          </button>
        ) : (
          <button
            disabled
            className="w-full rounded-lg bg-gray-shade-3 py-[10px] text-base font-bold leading-6 text-gray-shade-8"
          >
            Choose
          </button>
        )}
      </div>
    </AvatarModalWrapper>
  );
};

export default AvatarModal;
