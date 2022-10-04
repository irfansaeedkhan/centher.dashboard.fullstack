// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";
import React, { useRef, useState } from "react";
import Image from "next/future/image";
import { useOnClickOutside } from "usehooks-ts";

// App imports
import Avatars from "@/components/avatars";
import {
  AvatarIcon,
  CameraIcon,
  NFTIcon,
  Polygon,
  UploadIcon,
} from "@/assets/svgs";
import AvatarModal from "./avatar.modal";
import SelfieModal from "./selfie.modal";

// Current directory imports

const ProfilePicture: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [initialAvatar, setInitialAvatar] = useState(
    "/api/public/avatars/avatar-1.png"
  );
  const [isModal, setIsModal] = useState<true | false>(false);
  const [isDpModal, setIsDpModal] = useState<
    "selfie" | "avatar" | "" | "nft" | "upload"
  >("");
  const handleClickOutside = () => {
    setIsModal(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div className="flex gap-2 items-center">
      <Image
        src={"/images/collection.png"}
        width={80}
        height={80}
        alt="display-picture"
        className="rounded-full object-cover !h-[80px] border border-[#45474d4d] bg-[#ffffff08]"
      />
      <div className={fieldTitle}>
        <span onClick={() => setIsModal(true)}>Upload Profile Image</span>
        {isModal && (
          <>
            <div className="absolute top-8 left-8">
              <Polygon />
            </div>
            <div
              ref={ref}
              className="absolute flex flex-col gap-6 w-[380px] h-auto bg-[#0D0D0D] p-6 top-10 rounded-xl"
            >
              <div className="flex gap-2 items-center">
                <CameraIcon />
                <span
                  className="text-sm font-medium hover:text-brand-primary"
                  onClick={() => setIsDpModal("selfie")}
                >
                  Take Selfie
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <AvatarIcon />
                <span
                  className="text-sm font-medium hover:text-brand-primary"
                  onClick={() => setIsDpModal("avatar")}
                >
                  Choose Avatar
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <UploadIcon />
                <label className="cursor-pointer">
                  <span className="text-sm font-medium hover:text-brand-primary">
                    Choose Image
                  </span>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
              {/* <div className="flex gap-2 items-center">
                <NFTIcon />
                <span
                  className="text-sm font-medium hover:text-brand-primary"
                  onClick={() => setIsDpModal("nft")}
                >
                  Choose NFT
                </span>
              </div> */}
            </div>
          </>
        )}
        {isDpModal === "selfie" ? (
          <SelfieModal />
        ) : (
          isDpModal === "avatar" && <AvatarModal />
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;

const fieldTitle = ctl(`
relative
  text-sm
  underline 
  text-white
  cursor-pointer
`);
