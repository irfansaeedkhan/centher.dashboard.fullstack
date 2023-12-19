import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { CrossIcon } from "@/assets/svgs";
import { AllowedMediaExtensions } from "./allowed-media-extensions";
import { UploadNFTProps } from "./upload.nft";

interface Props {
  asset: UploadNFTProps["asset"];
  clearForm: UploadNFTProps["clearForm"];
  setAsset: UploadNFTProps["setAsset"];
  setVideoThumbnail: UploadNFTProps["setVideoThumbnail"];
}

const VideoNFTUpload: React.FC<Props> = ({
  asset,
  clearForm,
  setAsset,
  setVideoThumbnail,
}) => {
  const [showSecPreview, setShowSecPreivew] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>("");
  const [showPreviewImage, setShowPreviewImage] = useState<boolean>(false);

  useEffect(() => {
    setShowSecPreivew(false);
    setAsset(undefined);
    setShowPreviewImage(false);
  }, [clearForm, setAsset]);

  const uploadFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (AllowedMediaExtensions.video.indexOf(file.type.toLowerCase()) === -1) {
      toast.error("Invalid NFT Video");
      return;
    }
    setAsset(file);
    setShowSecPreivew(true);
  };

  const uploadPreviewImageFile: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (
      AllowedMediaExtensions.imageAndGif.indexOf(file.type.toLowerCase()) === -1
    ) {
      toast.error("Invalid Thumbnail Image");
      return;
    }
    setVideoThumbnail(file);
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setShowPreviewImage(true);
  };

  return (
    <>
      <div className={previewContainer}>
        {showSecPreview ? (
          <div>
            <video controls={true} className={videoStyling}>
              <source src={asset ? URL.createObjectURL(asset) : ""} />
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
                  accept={AllowedMediaExtensions.video.join(", ")}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="previewImageContainer">
        <h4 className="pb-2 text-sm font-semibold text-white">Preview image</h4>
        <p className="text-sm font-normal leading-6 text-[#B7BBCC]">
          Because you&apos;ve included multimedia, you&apos;ll need to provide
          an image (PNG, JPG, or GIF) for the card display of your item.
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
                  setVideoThumbnail(undefined);
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
                  <label htmlFor="preview-img" className={chooseFileBtn}>
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="preview-img"
                    className={chooseFileBtn2}
                    onChange={uploadPreviewImageFile}
                    accept={AllowedMediaExtensions.imageAndGif.join(", ")}
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

// styling
const uploadBtnContainer = `relative w-[132px] h-10`;
const chooseFileBtn2 = `absolute w-full h-full opacity-0`;
const formatName = `text-gray-shade-7 text-xs font-semibold`;
const videoStyling = `w-full h-full absolute rounded-2xl object-contain`;
const uploadBoxContent = `flex flex-col items-center justify-center gap-5`;
const uploadBox = `w-full h-full absolute flex items-center justify-center`;
const previewContainer = `pb-[100%] bg-black-shade-9 rounded-2xl relative w-full border border-gray-shade-3`;
const previewImgContainer = `bg-black-shade-9 rounded-2xl relative border border-gray-shade-3 w-[270px] h-[270px] mt-3`;
const chooseFileBtn = `z-10 absolute w-full h-full text-sm text-white font-bold leading-normal bg-transparent rounded-[14px] border border-gray-shade-3 text-center flex items-center justify-center hover:bg-[#1E202B] cursor-pointer`;
const imageDelBtn = `absolute top-4 right-5  [&>*>*]:stroke-white border border-gray-shade-3 opacity-100 outline-none  leading-none font-semibold focus:outline-none [&>*]:transition bg-gray-shade-3/50 rounded-xl z-30 w-[34px] h-[34px] flex items-center justify-center leading-0 backdrop-blur-lg`;
