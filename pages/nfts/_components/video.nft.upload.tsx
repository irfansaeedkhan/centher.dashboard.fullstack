// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { CrossIcon } from "@/assets/svgs";
import { UploadNFTProps } from "./upload.nft";

const VideoNFTUpload = ({ asset, setAsset, clearForm }: UploadNFTProps) => {
  const [showSecPreview, setShowSecPreivew] = useState<boolean | null>(false);
  const [showPreviewImage, setShowPreviewImage] = useState<boolean | null>(
    false
  );
  const [previewImage, setPreviewImage] = useState<string | undefined>("");

  // upload image to preview
  const uploadFile = (e: any) => {
    const previewUrl = e.target.files[0];
    setAsset(previewUrl);
    setShowSecPreivew(true);
  };
  const uploadPreviewImageFile = (e: any) => {
    const previewUrl = URL.createObjectURL(e.target.files[0]);
    setPreviewImage(previewUrl);
    setShowPreviewImage(true);
  };
  useEffect(() => {
    setShowSecPreivew(false);
    setAsset(undefined);
  }, [clearForm, setAsset]);
  return (
    <>
      <div className={previewContainer}>
        {showSecPreview ? (
          <div>
            <video controls={true} className={videoStyling}>
              <source
                src={asset ? URL.createObjectURL(asset) : ""}
                type="video/mp4"
              />
            </video>
            <button
              className={imageDelBtn}
              onClick={() => {
                setShowSecPreivew(false);
                setAsset(undefined);
              }}
            >
              <CrossIcon />
            </button>
          </div>
        ) : (
          <div className={uploadBox}>
            <div className={uploadBoxContent}>
              <span className={formatName}>MP4, QUICKTIME</span>
              <div className={uploadBtnContainer}>
                <label htmlFor="video-nft" className={chooseFileBtn}>
                  Choose File
                </label>
                <input
                  type="file"
                  id="video-nft"
                  className={chooseFileBtn2}
                  onChange={uploadFile}
                  accept="video/mp4, video/x-matroska, video/quicktime, video/x-msvideo"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="previewImageContainer">
        <h4 className="text-14px font-semibold text-white pb-2">
          Preview image
        </h4>
        <p className="text-14px font-normal text-[#B7BBCC] leading-6">
          Because you’ve included multimedia, you’ll need to provide an image
          (PNG, JPG, or GIF) for the card display of your item.
        </p>
        <div className={previewImgContainer}>
          {showPreviewImage ? (
            <div>
              <Image
                className={videoStyling}
                src={previewImage ?? ""}
                alt="image"
                height={270}
                width={270}
              />
              <button
                className={imageDelBtn}
                onClick={() => {
                  setShowPreviewImage(false);
                  setPreviewImage(undefined);
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
                  <span className={chooseFileBtn}>Choose File</span>
                  <input
                    type="file"
                    className={chooseFileBtn2}
                    onChange={uploadPreviewImageFile}
                    accept="image/png, image/jpeg, image/webp, image/gif"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoNFTUpload;
const previewImgContainer = ctl(`
 bg-black-shade-9 rounded-2xl relative border border-gray-shade-3 w-[270px] h-[270px] mt-3
`);
// styling
const previewContainer = ctl(`
pb-[100%] bg-black-shade-9 rounded-2xl relative w-full border   border-gray-shade-3
`);
const videoStyling = ctl(`
w-full h-full absolute rounded-2xl object-contain
`);
const imageDelBtn = ctl(`
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
  z-10 absolute w-full h-full text-14px text-gray-shade-7 font-bold leading-normal bg-black-shade-7   rounded-2xl text-center py-2 cursor-pointer hover:bg-brand-primary hover:text-black-shade-3
    `);
const chooseFileBtn2 = ctl(`
  absolute w-full h-full  opacity-0
    `);
