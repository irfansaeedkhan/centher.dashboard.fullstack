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
}

const GifNFTUpload: React.FC<Props> = ({ asset, setAsset, clearForm }) => {
  const [showSecPreview, setShowSecPreivew] = useState<boolean>(false);

  const uploadFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (AllowedMediaExtensions.gif.indexOf(file.type.toLowerCase()) === -1) {
      toast.error("Invalid NFT Gif");
      return;
    }
    setAsset(file);
    setShowSecPreivew(true);
  };

  useEffect(() => {
    setShowSecPreivew(false);
    setAsset(undefined);
  }, [clearForm, setAsset]);

  return (
    <div className={previewContainer}>
      {showSecPreview ? (
        <div>
          <Image
            className={imageStyling}
            src={asset ? URL.createObjectURL(asset) : ""}
            alt="nft"
            height={543}
            width={543}
          />
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
            <span className={formatName}>GIF</span>
            <div className={uploadBtnContainer}>
              <label htmlFor="gif-nft" className={chooseFileBtn}>
                Choose File
              </label>
              <input
                type="file"
                id="gif-nft"
                className={chooseFileBtn2}
                onChange={uploadFile}
                accept={AllowedMediaExtensions.gif.join(", ")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GifNFTUpload;

// styling
const uploadBtnContainer = `relative w-[132px] h-10`;
const chooseFileBtn2 = `absolute w-full h-full  opacity-0`;
const formatName = `text-gray-shade-7 text-xs font-semibold`;
const imageStyling = `w-full h-full absolute rounded-2xl object-cover`;
const uploadBox = `w-full h-full absolute flex items-center justify-center`;
const uploadBoxContent = `flex flex-col items-center justify-center gap-5`;
const previewContainer = `pb-[100%] bg-black-shade-9 rounded-2xl relative w-full border border-gray-shade-3`;
const chooseFileBtn = `z-10 absolute w-full h-full text-sm text-white font-bold leading-normal bg-transparent rounded-[14px] border border-gray-shade-3 text-center flex items-center justify-center hover:bg-[#1E202B] cursor-pointer`;
const imageDelBtn = `absolute top-4 right-5 [&>*>*]:stroke-white border border-gray-shade-3 opacity-100 outline-none leading-none font-semibold focus:outline-none [&>*]:transition bg-gray-shade-3/50 rounded-xl z-30 w-[34px] h-[34px] flex items-center justify-center leading-0 backdrop-blur-lg`;
