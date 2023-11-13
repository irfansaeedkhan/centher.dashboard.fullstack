import React, { useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useOnClickOutside } from "usehooks-ts";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { getUserImageUploadUrl, updateUserImage } from "@/lib/user";
import Button from "@/components/button";
import { LoggedInUser, UserImage } from "@/models/user";
import { AvatarIcon, UploadIcon } from "@/assets/svgs";
import { getUserImageUrl } from "@/utils/user.helpers";
import AvatarModal from "./avatar.modal";
import SelfieModal from "./selfie.modal";
import CropProfilePicture from "./crop-profile-picture";

interface ProfilePictureProps {
  user: LoggedInUser;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState("idle");
  const [cropModal, setCropModal] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profile_image);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File>();
  const [profileImageData, setProfileImageData] = useState<UserImage>({
    path: "",
    object_name: "",
  });
  const [profileModal, setProfileModal] = useState<
    "selfie" | "avatar" | "nft" | "upload"
  >();
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = () => {
    setIsMenuOpen(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  const handleSelectAvatar = async (avatar: UserImage) => {
    try {
      setProfileImage(avatar.path);
      await updateUserImage({
        type: "profile_image",
        object_name: avatar.object_name,
      });
      toast.success("Profile image updated successfully");
    } catch (err) {
      toast.error("Error updating profile image");
    }
  };

  const showPreviewImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // Close Menu
    setCropModal(true);
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

    setProfileImageData({
      path: URL.createObjectURL(file),
      object_name: file.name,
    });

    // Update profile image in state with base64 image
    setProfileImage(URL.createObjectURL(file));
    setUploadFile(file);
  };

  const handleUploadCustomImage: React.MouseEventHandler<
    HTMLButtonElement
  > = async (e) => {
    // Close Menu
    if (!uploadFile) return;
    setIsLoading("loading");
    setIsMenuOpen(false);

    try {
      // Get pre-signed URL from API
      const data = await getUserImageUploadUrl(
        profileImageData.object_name,
        "profile_image"
      );

      // Create form data
      const presignedPostData = data.presignedPostData;
      const formData = new FormData();
      Object.keys(presignedPostData.fields).forEach((key) => {
        formData.append(
          key,
          presignedPostData.fields[key as keyof typeof presignedPostData.fields]
        );
      });
      formData.append("file", uploadFile);

      // Upload file to S3
      await axios.post(presignedPostData.url, formData);

      profileImageData.path = getUserImageUrl({
        type: "custom-image",
        object_name: data.objectName,
      });

      // Update profile image in DB
      updateUserImage({
        type: "profile_image",
        object_name: data.objectName,
      });

      toast.success("Profile picture updated successfully!");
      setProfileImageData({
        path: "",
        object_name: "",
      });
      setIsLoading("loaded");
      setUploadFile(undefined);
    } catch (error: any) {
      process.env.NODE_ENV !== "production" && console.dir(error);
      setIsLoading("loaded");
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
    <div className="">
      <div className="flex  items-center gap-2">
        <Image
          src={profileImage}
          width={80}
          height={80}
          alt="display-picture"
          className="!h-[80px] rounded-full bg-[#ffffff08] object-cover"
        />

        <div className={fieldTitle}>
          <span className="w-fit font-semibold">Set Profile Picture</span>
          <span className="text-xs font-medium text-gray-shade-14">
            Upload a photo or choose an avatar
          </span>
        </div>
      </div>
      <div className="relative mt-4">
        {profileImageData.path ? (
          <div className="flex items-center gap-5">
            <Button
              title="Discard"
              variant="secondary"
              className="w-[100px] rounded-[14px]"
              onClick={() => {
                setProfileImageData({
                  path: "",
                  object_name: "",
                });
                setProfileImage(user.profile_image);
                setUploadFile(undefined);
              }}
            />
            <Button
              title="Upload"
              variant="primary"
              className="w-[100px] rounded-[14px]"
              onClick={handleUploadCustomImage}
              Icon={
                isLoading === "loading" && (
                  <CgSpinner className="animate-spin text-white" />
                )
              }
            />
          </div>
        ) : (
          <Button
            title="Choose Image"
            variant="primary"
            className="text-sm"
            onClick={() => setIsMenuOpen(true)}
          />
        )}
        {isMenuOpen && (
          <div
            ref={ref}
            className="absolute top-[calc(100%+0.5rem)] flex h-auto w-[380px] flex-col gap-6 rounded-xl bg-black-shade-12 p-6"
          >
            {/* Choose Avatar */}
            <div className="text-gradient-hover flex cursor-pointer items-center gap-2 text-white">
              <AvatarIcon />
              <span
                className="text-sm font-medium"
                onClick={() => setProfileModal("avatar")}
              >
                Choose Avatar
              </span>
            </div>

            {/* Choose Image */}
            <div className="flex cursor-pointer items-center gap-2 text-white">
              <UploadIcon />
              <label className="cursor-pointer">
                <span className="text-gradient-hover text-sm font-medium">
                  Upload Image
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png"
                  onChange={showPreviewImage}
                />
              </label>
            </div>

            {/* Take Selfie */}
            {/* <div className="flex gap-2 items-center">
                <CameraIcon2 />
                <span
                  className="text-sm font-medium text-gradient-hover"
                  onClick={() => setProfileModal("selfie")}
                >
                  Take Selfie
                </span>
              </div> */}

            {/* Choose NFT Image */}
            {/* <div className="flex gap-2 items-center">
                <NFTIcon />
                <span
                  className="text-sm font-medium text-gradient-hover"
                  onClick={() => setProfileModal("nft")}
                >
                  Choose NFT
                </span>
              </div> */}
          </div>
        )}
      </div>

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

      {cropModal && (
        <CropProfilePicture
          user={user}
          isOpen={cropModal}
          setCropModal={setCropModal}
          setUploadFile={setUploadFile}
          setProfileImage={setProfileImage}
          profileImageData={profileImageData}
          setProfileImageData={setProfileImageData}
        />
      )}
    </div>
  );
};

export default ProfilePicture;

const fieldTitle = `relative text-sm flex flex-col text-white`;
