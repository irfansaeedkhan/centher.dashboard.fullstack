import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import clsx from "clsx";
import { CrossIcon } from "@/assets/svgs";
import { AllowedMediaExtensions } from "./allowed-media-extensions";

interface Props {
  profile: Blob | undefined;
  cover: Blob | undefined;
  clearForm: boolean;
  setProfile: React.Dispatch<React.SetStateAction<Blob | undefined>>;
  setCover: React.Dispatch<React.SetStateAction<Blob | undefined>>;
}

export const UploadNFTCollection: React.FC<Props> = ({
  profile,
  cover,
  clearForm,
  setProfile,
  setCover,
}) => {
  const [showCoverImage, setShowCoverImage] = useState<boolean>(false);
  const [showProfileImage, setShowProfileImage] = useState<boolean>(false);

  useEffect(() => {
    if (clearForm) {
      setShowProfileImage(false);
      setProfile(undefined);
      setShowCoverImage(false);
      setCover(undefined);
    }
  }, [clearForm, setCover, setProfile]);

  const validateImageFile = (file: File) => {
    if (
      AllowedMediaExtensions.imageAndGif.indexOf(file.type.toLowerCase()) === -1
    ) {
      throw new Error("File type is not allowed");
    }
  };

  const uploadCoverFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    try {
      const file = e.target.files[0];
      validateImageFile(file);
      setCover(file);
      setShowCoverImage(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const uploadProfileFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    try {
      const file = e.target.files[0];
      validateImageFile(file);
      setProfile(file);
      setShowProfileImage(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className={nftBoxContainer}>
      <div>
        <h4 className={title}>
          Upload Logo Image <span className="text-danger">*</span>
        </h4>
        <p className={clsx(`mb-3`, description)}>
          This image will also be used for navigation. 350 x 350 recommended.
        </p>
        <div
          className={
            "relative flex w-full flex-col items-center rounded-[20px] border border-gray-shade-3 bg-black-shade-9 p-6 md:items-start"
          }
        >
          {showProfileImage && (
            <button
              className={profileDelBtn}
              onClick={() => {
                setShowProfileImage(false);
                setProfile(undefined);
              }}
            >
              <CrossIcon />
            </button>
          )}
          <div className={profileImgContainer}>
            {showProfileImage && (
              <div>
                <Image
                  className={profileStyling}
                  src={profile ? URL.createObjectURL(profile) : ""}
                  alt="image"
                  height={270}
                  width={270}
                />
              </div>
            )}
          </div>
          {!showProfileImage ? (
            <div className={clsx(`mt-5`, uploadBtnContainer)}>
              <label
                htmlFor="collection-profile-image"
                className={chooseFileBtn}
              >
                Choose File
              </label>
              <input
                type="file"
                id="collection-profile-image"
                className={chooseFileBtn2}
                onChange={uploadProfileFile}
                accept="image/png, image/jpeg, image/webp, image/gif"
              />
            </div>
          ) : (
            <div
              className={clsx(`mt-5`, uploadBtnContainer)}
              onClick={() => {
                setShowProfileImage(false);
                setProfile(undefined);
              }}
            >
              <label
                htmlFor="collection-profile-image"
                className={chooseFileBtn}
              >
                Choose File
              </label>
              <input
                type="file"
                id="collection-profile-image"
                className={chooseFileBtn2}
                onChange={uploadProfileFile}
                accept="image/png, image/jpeg, image/webp, image/gif"
              />
            </div>
          )}
        </div>
      </div>
      <div>
        <h4 className={title}>
          Upload banner image <span className="text-danger">*</span>
        </h4>
        <p className={description}>
          This image will appear at the top of your collection page. Avoid
          including too much text in this banner image, 1400 x 350 recommended.
        </p>
        <div className={previewImgContainer}>
          {showCoverImage ? (
            <div>
              <Image
                className={coverStyling}
                src={cover ? URL.createObjectURL(cover) : ""}
                alt="image"
                height={270}
                width={270}
              />
              <button
                className={coverDelBtn}
                onClick={() => {
                  setShowCoverImage(false);
                  setCover(undefined);
                }}
              >
                <CrossIcon />
              </button>
            </div>
          ) : (
            <div className={uploadBox}>
              <div className={uploadBoxContent}>
                <span className={formatName}>PNG, JPG, GIF</span>
                <div className={uploadBtnContainer}>
                  <label
                    htmlFor="collection-banner-image"
                    className={chooseFileBtn}
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="collection-banner-image"
                    className={chooseFileBtn2}
                    onChange={uploadCoverFile}
                    accept={AllowedMediaExtensions.imageAndGif.join(", ")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const title = `text-sm font-semibold text-white pb-2`;
const description = `text-sm font-normal text-[#B7BBCC] leading-6`;
const nftBoxContainer = `w-full max-w-[544px] flex flex-col gap-6`;
const previewImgContainer = `bg-black-shade-9 rounded-2xl relative border border-gray-shade-3 w-full pb-[50%] mt-3`;
const coverStyling = `w-full h-full absolute rounded-2xl object-contain`;
const coverDelBtn = `absolute top-4 right-5 [&>*>*]:stroke-white border border-gray-shade-3 opacity-100 outline-none leading-none font-semibold focus:outline-none [&>*]:transition bg-gray-shade-3/50 rounded-xl z-30 w-[34px] h-[34px] flex items-center justify-center leading-0 backdrop-blur-lg`;
const uploadBox = `w-full h-full absolute flex items-center justify-center`;
const uploadBoxContent = `flex flex-col items-center justify-center gap-5`;
const formatName = `text-gray-shade-7 text-xs font-semibold`;
const uploadBtnContainer = `relative w-[132px] h-10`;
const chooseFileBtn = `z-10 absolute w-full h-full text-sm text-white font-bold leading-normal bg-transparent rounded-[14px] border border-gray-shade-3 text-center flex items-center justify-center hover:bg-[#1E202B] cursor-pointer`;
const chooseFileBtn2 = `absolute w-full h-full opacity-0`;
const profileImgContainer = `bg-gray-shade-9 relative border border-gray-shade-9 h-[96px] w-[96px] rounded-full `;
const profileStyling = `w-full h-full absolute rounded-full object-cover`;
const profileDelBtn = `absolute top-4 right-5  [&>*>*]:stroke-white border border-gray-shade-3 opacity-100 outline-none leading-none font-semibold focus:outline-none [&>*]:transition bg-gray-shade-3/50 rounded-xl z-30 w-[34px] h-[34px] flex items-center justify-center leading-0 backdrop-blur-lg`;
