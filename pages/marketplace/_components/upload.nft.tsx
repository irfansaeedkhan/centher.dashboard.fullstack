import React from "react";
import clsx from "clsx";
import {
  PhotoIcon,
  GifNew,
  GifNewWhite,
  VideosIcon,
  AudioIcon,
} from "@/assets/svgs";
import { CreateNftUploadFormType } from "../create.page";
import ImageNFTUpload from "./image.nft.upload";
import GifNFTUpload from "./gif.nft.upload";
import VideoNFTUpload from "./video.nft.upload";
import AudioNFTUpload from "./audio.nft.upload";

export interface UploadNFTProps {
  asset: Blob | undefined;
  assetTab: string;
  clearForm: boolean;
  setAsset: React.Dispatch<React.SetStateAction<Blob | undefined>>;
  setAssetTab: React.Dispatch<React.SetStateAction<CreateNftUploadFormType>>;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
  setVideoThumbnail: React.Dispatch<React.SetStateAction<Blob | undefined>>;
}
export const UploadNFT: React.FC<UploadNFTProps> = ({
  asset,
  assetTab,
  clearForm,
  setAsset,
  setAssetTab,
  setClearForm,
  setVideoThumbnail,
}) => {
  return (
    <div className="flex w-full max-w-[544px] flex-col gap-6">
      <div className="flex w-full border-b border-gray-shade-3 [@media(max-width:600px)]:flex-wrap [@media(max-width:600px)]:justify-between [@media(max-width:600px)]:!gap-0">
        <label
          onClick={() => {
            setClearForm(true);
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
            setClearForm(true);
            setAssetTab(CreateNftUploadFormType.Gif);
          }}
        >
          {assetTab === CreateNftUploadFormType.Gif ? (
            <GifNewWhite />
          ) : (
            <GifNew className={clsx("")} />
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
            setClearForm(true);
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
            setClearForm(true);
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
          clearForm={clearForm}
          setAsset={setAsset}
        />
      )}
      {assetTab === CreateNftUploadFormType.Gif && (
        <GifNFTUpload asset={asset} setAsset={setAsset} clearForm={clearForm} />
      )}
      {assetTab === CreateNftUploadFormType.Video && (
        <VideoNFTUpload
          asset={asset}
          clearForm={clearForm}
          setAsset={setAsset}
          setVideoThumbnail={setVideoThumbnail}
        />
      )}
      {assetTab === CreateNftUploadFormType.Audio && (
        <AudioNFTUpload
          asset={asset}
          clearForm={clearForm}
          setAsset={setAsset}
        />
      )}
    </div>
  );
};

const label = `group flex w-full max-w-[130px] flex-shrink-0 cursor-pointer select-none items-center justify-center gap-2 rounded-md border border-transparent py-[10px] px-6 text-sm font-semibold transition-all duration-150 hover:bg-brand-primary/20 hover:text-white`;
