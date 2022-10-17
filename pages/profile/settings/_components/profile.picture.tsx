// React, Next, NPM Packages
import React, { useRef, useState } from "react";
import Image from "next/future/image";
import axios from "axios";
import { useOnClickOutside } from "usehooks-ts";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { LoggedInUser, UserImage } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";
import { AvatarIcon, CameraIcon2, Polygon, UploadIcon } from "@/assets/svgs";

// Current directory imports
import AvatarModal from "./avatar.modal";
import SelfieModal from "./selfie.modal";
import { updateProfileImage } from "./update.profile.image";

interface ProfilePictureProps {
  user: LoggedInUser;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ user }) => {
  const [profileImage, setProfileImage] = useState(user.profile_image);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileModal, setProfileModal] = useState<
    "selfie" | "avatar" | "nft" | "upload"
  >();
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = () => {
    setIsMenuOpen(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  const handleSelectAvatar = (avatar: UserImage) => {
    setProfileImage(avatar);
    updateProfileImage(avatar);
  };

  const handleSelectCustomImage: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    if (!e.currentTarget.files || e.currentTarget.files.length < 1) {
      return;
    }

    const file = e.currentTarget.files[0];

    const profileImageData: UserImage = {
      name: file.name,
      path: URL.createObjectURL(file),
      object_name: file.name,
    };

    try {
      // Get pre-signed URL from API
      const { data } = await axiosNodeApi.get(
        "/api/s3-upload/profile-image?filename=" + file.name
      );

      profileImageData.name = data.objectName;
      profileImageData.object_name = data.objectName;

      // Update profile image in state with base64 image
      setProfileImage(profileImageData);

      // Upload file to S3
      await axios.put(data.uploadURL, file);

      profileImageData.path = data.uploadURL.split("?")[0];

      // Update profile image in DB
      updateProfileImage(profileImageData);
    } catch (err) {
      process.env.NODE_ENV !== "production" && console.dir(err);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Image
        src={profileImage.path}
        width={80}
        height={80}
        alt="display-picture"
        className="rounded-full object-cover !h-[80px] border border-[#45474d4d] bg-[#ffffff08]"
      />
      <div className={fieldTitle}>
        <button onClick={() => setIsMenuOpen(true)}>
          Change Profile Image
        </button>

        {isMenuOpen && (
          <>
            <div className="absolute top-8 left-8">
              <Polygon />
            </div>
            <div
              ref={ref}
              // TODO: Waqar: Extract this bg color to tailwind config
              className="absolute flex flex-col gap-6 w-[380px] h-auto bg-[#0D0D0D] p-6 top-10 rounded-xl"
            >
              {/* Choose Avatar */}
              <div className="flex gap-2 items-center">
                <AvatarIcon />
                <span
                  className="text-sm font-medium hover:text-brand-primary"
                  onClick={() => setProfileModal("avatar")}
                >
                  Choose Avatar
                </span>
              </div>

              {/* Choose Image */}
              <div className="flex gap-2 items-center">
                <UploadIcon />
                <label className="cursor-pointer">
                  <span className="text-sm font-medium hover:text-brand-primary">
                    Choose Image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png"
                    onChange={handleSelectCustomImage}
                  />
                </label>
              </div>

              {/* Take Selfie */}
              {/* <div className="flex gap-2 items-center">
                <CameraIcon2 />
                <span
                  className="text-sm font-medium hover:text-brand-primary"
                  onClick={() => setProfileModal("selfie")}
                >
                  Take Selfie
                </span>
              </div> */}

              {/* Choose NFT Image */}
              {/* <div className="flex gap-2 items-center">
                <NFTIcon />
                <span
                  className="text-sm font-medium hover:text-brand-primary"
                  onClick={() => setProfileModal("nft")}
                >
                  Choose NFT
                </span>
              </div> */}
            </div>
          </>
        )}

        <SelfieModal
          isOpen={profileModal === "selfie"}
          onClose={() => {
            setProfileModal(undefined);
          }}
        />

        <AvatarModal
          isOpen={profileModal === "avatar"}
          onClose={() => {
            setProfileModal(undefined);
          }}
          onAvatarSelect={handleSelectAvatar}
        />
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
