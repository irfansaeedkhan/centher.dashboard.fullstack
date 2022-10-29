// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { CrossIcon } from "@/assets/svgs";

export const UploadNFTCollection = () => {
  const [showCoverImage, setShowCoverImage] = useState<boolean | null>(false);
  const [coverImage, setCoverImage] = useState<string | undefined>("");
  const [showProfileImage, setShowProfileImage] = useState<boolean | null>(
    false
  );
  const [profileImage, setProfileImage] = useState<string | undefined>("");

  const uploadCoverFile = (e: any) => {
    const previewUrl = URL.createObjectURL(e.target.files[0]);
    setCoverImage(previewUrl);
    setShowCoverImage(true);
  };
  const uploadProfileFile = (e: any) => {
    const previewUrl = URL.createObjectURL(e.target.files[0]);
    setProfileImage(previewUrl);
    setShowProfileImage(true);
  };
  return (
    <div className={nftBoxContainer}>
      <div>
        <h4 className={title}>
          Upload Logo image <span className="text-red-500">*</span>
        </h4>
        <p className={description}>
          This image will also be used for navigation. 350 x 350 recommended.
        </p>
        <div className={imgBox}>
          {showProfileImage && (
            <button
              className={profileDelBtn}
              onClick={() => {
                setShowProfileImage(false);
                setProfileImage(undefined);
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
                  src={profileImage ?? ""}
                  alt="image"
                  height={270}
                  width={270}
                />
              </div>
            )}
          </div>
          <div className={uploadBtnContainer}>
            <span className={chooseFileBtn}>choose File</span>
            <input
              type="file"
              className={chooseFileBtn2}
              onChange={uploadProfileFile}
              accept="image/png, image/jpeg, image/webp, image/gif"
            />
          </div>
        </div>
      </div>
      <div>
        <h4 className={title}>Upload banner image</h4>
        <p className={description}>
          This image will appear at the top of your collection page. Avoid
          including too much text in this banner image, 1400 x 350 recommended.
        </p>
        <div className={previewImgContainer}>
          {showCoverImage ? (
            <div>
              <Image
                className={coverStyling}
                src={coverImage ?? ""}
                alt="image"
                height={270}
                width={270}
              />
              <button
                className={coverDelBtn}
                onClick={() => {
                  setShowCoverImage(false);
                  setCoverImage(undefined);
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
                  <span className={chooseFileBtn}>choose File</span>
                  <input
                    type="file"
                    className={chooseFileBtn2}
                    onChange={uploadCoverFile}
                    accept="image/png, image/jpeg, image/webp, image/gif"
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
// styling
const title = ctl(`
text-14px font-semibold text-white pb-2
`);
const description = ctl(`
text-14px font-normal text-gray-shade-18 leading-6
`);
const imgBox = ctl(`
bg-black-shade-9 rounded-2xl relative border border-gray-shade-3 w-full  mt-3 p-6 flex flex-col gap-5
`);
const nftBoxContainer = ctl(`
w-full max-w-[544px] flex flex-col gap-6
`);
const previewImgContainer = ctl(`
 bg-black-shade-9 rounded-2xl relative border border-gray-shade-3 w-full pb-[50%] mt-3
`);
const coverStyling = ctl(`
w-full h-full absolute rounded-2xl object-contain
`);

const coverDelBtn = ctl(`
  absolute top-4 right-5  [&>*>*]:stroke-white border border-gray-shade-3 opacity-100 outline-none  leading-none font-semibold focus:outline-none [&>*]:transition bg-gray-shade-3/50  rounded-xl [&>*]:!w-8 [&>*]:!h-8 [&>*]:hover:scale-125 z-30 w-[44px] h-[44px] flex items-center justify-center leading-0 backdrop-blur-lg
  `);
const uploadBox = ctl(`
w-full h-full absolute flex items-center justify-center
  `);
const uploadBoxContent = ctl(`
flex flex-col items-center justify-center gap-5
  `);
const formatName = ctl(`
  text-gray-shade-7 text-12px font-semibold
    `);
const uploadBtnContainer = ctl(`
  relative w-[132px] h-10
    `);
const chooseFileBtn = ctl(`
  absolute w-full h-full text-14px text-gray-shade-7 font-bold leading-normal bg-black-shade-7   rounded-2xl text-center py-2 cursor-pointer hover:bg-brand-primary hover:text-black-shade-3
    `);
const chooseFileBtn2 = ctl(`
  absolute w-full h-full  opacity-0
    `);

// profile img styling
const profileImgContainer = ctl(`
 bg-gray-shade-9 relative border border-gray-shade-9 h-[96px] w-[96px] rounded-full 
`);
const profileStyling = ctl(`
w-full h-full absolute rounded-full object-contain
`);
const profileDelBtn = ctl(`
  absolute top-4 right-5  [&>*>*]:stroke-white border border-gray-shade-3 opacity-100 outline-none  leading-none font-semibold focus:outline-none [&>*]:transition bg-gray-shade-3/50  rounded-xl [&>*]:!w-8 [&>*]:!h-8 [&>*]:hover:scale-125 z-30 w-[44px] h-[44px] flex items-center justify-center leading-0 backdrop-blur-lg
  `);
