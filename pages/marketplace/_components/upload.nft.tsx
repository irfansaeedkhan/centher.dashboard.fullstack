// React, Next, NPM Packages
import React from "react";
import clsx from "clsx";

// App imports

import {
  PhotoIcon,
  GifNew,
  GifNewWhite,
  VideosIcon,
  AudioIcon,
} from "@/assets/svgs";

// same directory Imports
import ImageNFTUpload from "./image.nft.upload";
import GifNFTUpload from "./gif.nft.upload";
import VideoNFTUpload from "./video.nft.upload";
import AudioNFTUpload from "./audio.nft.upload";
import { CreateNftUploadFormType } from "../create.page";

export interface UploadNFTProps {
  asset: Blob | undefined;
  setAsset: any;
  clearForm: boolean;
}

export interface UploadNFTProps2 {
  asset: Blob | undefined;
  setAsset: any;
  clearForm: boolean;
  setVideoThumbnailPreview: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface UploadNFTProps1 {
  asset: Blob | undefined;
  setAsset: any;
  assetTab: string;
  setAssetTab: any;
  clearForm: boolean;
  setVideoThumbnailPreview: React.Dispatch<React.SetStateAction<boolean>>;
}
export const UploadNFT = ({
  asset,
  setAsset,
  assetTab,
  setAssetTab,
  clearForm,
  setVideoThumbnailPreview,
}: UploadNFTProps1) => {
  return (
    <div className="flex w-full max-w-[544px] flex-col gap-6">
      <div className="flex w-full border-b border-gray-shade-3 [@media(max-width:600px)]:flex-wrap [@media(max-width:600px)]:justify-between [@media(max-width:600px)]:!gap-0">
        <label
          onClick={() => {
            setAssetTab(CreateNftUploadFormType.Image);
          }}
          className={clsx(
            label,
            assetTab === CreateNftUploadFormType.Image
              ? "myBox text-white"
              : "text-[#A0A4BB]"
          )}
        >
          <PhotoIcon
            className={clsx(
              "group-hover:[&>*]:stroke-brand-primary",
              assetTab === CreateNftUploadFormType.Image && "[&>*]:stroke-white"
            )}
          />

          <span>Image</span>
        </label>
        <label
          className={clsx(
            label,
            assetTab === CreateNftUploadFormType.Gif
              ? "myBox text-white"
              : "text-[#A0A4BB]"
          )}
          onClick={() => {
            setAssetTab(CreateNftUploadFormType.Gif);
          }}
        >
          {assetTab === CreateNftUploadFormType.Gif ? (
            <GifNewWhite />
          ) : (
            <GifNew />
          )}
          <span>Gif</span>
        </label>
        <label
          className={clsx(
            label,
            assetTab === CreateNftUploadFormType.Video
              ? "myBox text-white"
              : "text-[#A0A4BB]"
          )}
          onClick={() => {
            setAssetTab(CreateNftUploadFormType.Video);
          }}
        >
          <VideosIcon
            className={clsx(
              "group-hover:[&>*]:stroke-brand-primary",
              assetTab === CreateNftUploadFormType.Video && "[&>*]:stroke-white"
            )}
          />
          <span>Video</span>
        </label>
        <label
          className={clsx(
            label,
            assetTab === CreateNftUploadFormType.Audio
              ? "myBox text-white"
              : "text-[#A0A4BB]"
          )}
          onClick={() => {
            setAssetTab(CreateNftUploadFormType.Audio);
          }}
        >
          <AudioIcon
            className={clsx(
              "group-hover:[&>*]:stroke-brand-primary",
              assetTab === CreateNftUploadFormType.Audio && "[&>*]:stroke-white"
            )}
          />
          <span>Audio</span>
        </label>
      </div>
      {assetTab === CreateNftUploadFormType.Image && (
        <ImageNFTUpload
          asset={asset}
          setAsset={setAsset}
          clearForm={clearForm}
        />
      )}
      {assetTab === CreateNftUploadFormType.Gif && (
        <GifNFTUpload asset={asset} setAsset={setAsset} clearForm={clearForm} />
      )}
      {assetTab === CreateNftUploadFormType.Video && (
        <VideoNFTUpload
          setVideoThumbnailPreview={setVideoThumbnailPreview}
          asset={asset}
          setAsset={setAsset}
          clearForm={clearForm}
        />
      )}
      {assetTab === CreateNftUploadFormType.Audio && (
        <AudioNFTUpload
          asset={asset}
          setAsset={setAsset}
          clearForm={clearForm}
        />
      )}
    </div>
  );
};

const label = `group flex w-full max-w-[130px] flex-shrink-0 cursor-pointer select-none items-center justify-center gap-2 rounded-md border border-transparent py-[10px] px-6 text-sm font-semibold transition-all duration-150 hover:bg-brand-primary/20 hover:text-white`;
