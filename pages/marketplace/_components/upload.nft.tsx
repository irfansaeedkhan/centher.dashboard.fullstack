// React, Next, NPM Packages
import React from "react";
import clsx from "clsx";

// App imports

import { PhotoIcon, GifNew, GifNewWhite } from "@/assets/svgs";

// same directory Imports
import ImageNFTUpload from "./image.nft.upload";
import GifNFTUpload from "./gif.nft.upload";

export interface UploadNFTProps {
  asset: Blob | undefined;
  setAsset: any;
  clearForm: boolean;
}
export interface UploadNFTProps1 {
  asset: Blob | undefined;
  setAsset: any;
  assetTab: string;
  setAssetTab: any;
  clearForm: boolean;
}
export const UploadNFT = ({
  asset,
  setAsset,
  assetTab,
  setAssetTab,
  clearForm,
}: UploadNFTProps1) => {
  return (
    <div className="flex w-full max-w-[544px] flex-col gap-6">
      <div className="flex w-full border-b border-gray-shade-3 [@media(max-width:600px)]:flex-wrap [@media(max-width:600px)]:justify-between [@media(max-width:600px)]:!gap-0">
        <label
          onClick={() => {
            setAssetTab("Image");
          }}
          className={clsx(
            label,
            assetTab === "Image" ? "myBox text-white" : "text-[#A0A4BB]"
          )}
        >
          <PhotoIcon
            className={clsx(
              "group-hover:[&>*]:stroke-brand-primary",
              assetTab === "Image" && "[&>*]:stroke-white"
            )}
          />
          <span>Image</span>
        </label>
        <label
          className={clsx(
            label,
            assetTab === "Gif" ? "myBox text-white" : "text-[#A0A4BB]"
          )}
          onClick={() => {
            setAssetTab("Gif");
          }}
        >
          {assetTab === "Gif" ? (
            <GifNewWhite />
          ) : (
            <GifNew className={clsx("")} />
          )}
          <span>Gif</span>
        </label>
      </div>
      {assetTab === "Image" && (
        <ImageNFTUpload
          asset={asset}
          setAsset={setAsset}
          clearForm={clearForm}
        />
      )}
      {assetTab === "Gif" && (
        <GifNFTUpload asset={asset} setAsset={setAsset} clearForm={clearForm} />
      )}
      {/* {assetTab === "Video" && (
        <VideoNFTUpload
          asset={asset}
          setAsset={setAsset}
          clearForm={clearForm}
        />
      )}
      {assetTab === "Audio" && (
        <AudioNFTUpload
          asset={asset}
          setAsset={setAsset}
          clearForm={clearForm}
        />
      )} */}
    </div>
  );
};

const label = `group flex w-full max-w-[130px] flex-shrink-0 cursor-pointer select-none items-center justify-center gap-2 rounded-md border border-transparent py-[10px] px-6 text-sm font-semibold transition-all duration-150 hover:bg-brand-primary/20 hover:text-white`;
