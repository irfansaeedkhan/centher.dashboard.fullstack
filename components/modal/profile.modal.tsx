import React from "react";
import Image from "next/image";

interface ModalProps {
  onClose: () => void;
  src: string;
}

const ProfileModal: React.FC<ModalProps> = ({ onClose, src }) => {
  return (
    <div
      className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-black bg-opacity-70 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="h-48 max-h-[90%] w-48 max-w-[90%] overflow-auto fsm:h-64 fsm:w-64 fmd:max-w-4xl">
        <Image
          src={src}
          alt={"profile image"}
          width={720}
          height={720}
          quality={100}
          className="h-full w-full"
        />
      </div>
    </div>
  );
};

export default ProfileModal;
