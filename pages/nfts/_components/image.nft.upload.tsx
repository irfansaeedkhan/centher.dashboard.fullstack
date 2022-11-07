// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { CrossIcon } from "@/assets/svgs";
import { UploadNFTProps } from "./upload.nft";

const ImageNFTUpload = ({ asset, setAsset, clearForm }: UploadNFTProps) => {
  const [showSecPreview, setShowSecPreivew] = useState<boolean | null>(false);

  // upload image to preview
  const uploadFile = (e: any) => {
    const previewUrl = e.target.files[0];
    setAsset(previewUrl);
    setShowSecPreivew(true);
  };

  useEffect(() => {
    setShowSecPreivew(false);
  }, [clearForm]);

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
              setAsset(null);
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
                onChange={uploadFile}
                accept="image/png, image/jpeg, image/webp"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageNFTUpload;

// styling
const previewContainer = ctl(`
pb-[100%] bg-black-shade-9 rounded-2xl relative w-full border   border-gray-shade-3 
`);
const imageStyling = ctl(`
w-full h-full absolute rounded-2xl object-cover
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
  absolute w-full h-full text-14px text-gray-shade-7 font-bold leading-normal bg-black-shade-7   rounded-2xl text-center py-2 cursor-pointer hover:bg-brand-primary hover:text-black-shade-3
    `);
const chooseFileBtn2 = ctl(`
  absolute w-full h-full  opacity-0
    `);
