import React, { useRef, useState } from "react";
import Image from "next/image";
import { useSWRConfig } from "swr";
import axios from "axios";
import { useOnClickOutside } from "usehooks-ts";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";

import { LoggedInUser, UserImage } from "@/models/user";
import { axiosNodeApi } from "@/utils/axios";
import { updateUserImage } from "@/utils/user.helpers";
import { AvatarIcon, CameraIcon2, Polygon, UploadIcon } from "@/assets/svgs";

import AvatarModal from "./avatar.modal";
import SelfieModal from "./selfie.modal";

interface ProfilePictureProps {
  user: LoggedInUser;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ user }) => {
  const { mutate } = useSWRConfig();
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
    updateUserImage({
      type: "profile_image",
      object_name: avatar.object_name,
      path: avatar.path,
    });
  };

  const handleSelectCustomImage: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    // Close Menu
    setIsMenuOpen(false);

    const file = e.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    // Only allow png, jpeg and jpg
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Only png and jpg files are allowed");
      return;
    }

    const profileImageData: UserImage = {
      path: URL.createObjectURL(file),
      object_name: file.name,
    };

    try {
      // Get pre-signed URL from API
      const { data } = await axiosNodeApi.get(
        "/api/s3-upload/user-image?filename=" + file.name
      );

      profileImageData.object_name = data.objectName;

      // Update profile image in state with base64 image
      setProfileImage({ ...profileImageData });

      // Create form data
      const presignedPostData = data.presignedPostData;
      const formData = new FormData();
      Object.keys(presignedPostData.fields).forEach((key) => {
        formData.append(key, presignedPostData.fields[key]);
      });
      formData.append("file", file);

      // Upload file to S3
      await axios.post(presignedPostData.url, formData);

      profileImageData.path = presignedPostData.url + "/" + data.objectName;

      // Update profile image in DB
      updateUserImage({
        type: "profile_image",
        object_name: profileImageData.object_name,
        path: profileImageData.path,
      });

      await mutate(
        "/api/users/me",
        { ...user, profile_image: profileImageData },
        false
      );
    } catch (error: any) {
      process.env.NODE_ENV !== "production" && console.dir(error);
      let errorMsg = "Error uploading image";
      if (
        typeof error.response?.data === "string" &&
        error.response?.data.includes("EntityTooLarge")
      ) {
        errorMsg =
          "Profile image is too large. Please upload an image less than 5MB.";
      } else if (error.response?.data?.message_description) {
        errorMsg = error.response.data.message_description;
      }

      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="">
        <Image
          src={profileImage.path}
          width={80}
          height={80}
          alt="display-picture"
          className="rounded-full !h-[80px] object-cover bg-[#ffffff08]"
        />
      </div>
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
              className="absolute flex flex-col gap-6 w-[380px] h-auto bg-black-shade-12 p-6 top-10 rounded-xl"
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
              <div className="flex gap-2 items-center">
                <CameraIcon2 />
                <span
                  className="text-sm font-medium hover:text-brand-primary"
                  onClick={() => setProfileModal("selfie")}
                >
                  Take Selfie
                </span>
              </div>

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
