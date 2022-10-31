// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";
import { ImageIcon, GifIcon, VideosIcon, AudioIcon } from "@/assets/svgs";

// same directory Imports
import ImageNFTUpload from "./image.nft.upload";
import GifNFTUpload from "./gif.nft.upload";
import VideoNFTUpload from "./video.nft.upload";
import AudioNFTUpload from "./audio.nft.upload";

export interface UploadNFTProps {
  asset: Blob | undefined
  setAsset: any
}
export interface UploadNFTProps1 {
  asset: Blob | undefined
  setAsset: any
  assetTab: string
  setAssetTab: any
}
export const UploadNFT = ({asset, setAsset, assetTab, setAssetTab} : UploadNFTProps1) => {

  return (
    <div className={nftBoxContainer}>
      <div className={tabsBtnContainer}>
        <Button
          title={"Image"}
          variant={assetTab === "Image" ? "v1" : "v2"}
          Icon={<ImageIcon />}
          onClick={() => {
            setAssetTab("Image");
          }}
          className={`${Tab} ${assetTab === "Image" && activeTab}`}
        />
        <Button
          title={"Gif"}
          variant={assetTab === "Gif" ? "v1" : "v2"}
          Icon={<GifIcon />}
          onClick={() => {
            setAssetTab("Gif");
          }}
          className={`${Tab} ${assetTab === "Gif" && activeTab}`}
        />
        <Button
          title={"Video"}
          variant={assetTab === "Video" ? "v1" : "v2"}
          Icon={<VideosIcon />}
          onClick={() => {
            setAssetTab("Video");
          }}
          className={`${Tab} ${assetTab === "Video" && activeTab}`}
        />
        <Button
          title={"Audio"}
          variant={assetTab === "Audio" ? "v1" : "v2"}
          Icon={<AudioIcon />}
          onClick={() => {
            setAssetTab("Audio");
          }}
          className={`${Tab} ${assetTab === "Audio" && activeTab}`}
        />
      </div>
      {assetTab === "Image" && <ImageNFTUpload asset={asset} setAsset={setAsset}/>}
      {assetTab === "Gif" && <GifNFTUpload asset={asset} setAsset={setAsset}/>}
      {assetTab === "Video" && <VideoNFTUpload asset={asset} setAsset={setAsset}/>}
      {assetTab === "Audio" && <AudioNFTUpload asset={asset} setAsset={setAsset}/>}
    </div>
  );
};
// styling
const tabsBtnContainer = ctl(`
w-full flex gap-4 [@media(max-width:600px)]:flex-wrap [@media(max-width:600px)]:justify-between [@media(max-width:600px)]:!gap-0
`);
const Tab = ctl(`
py-4 [&>*>*]:hover:stroke-black-shade-3 cursor-pointer hover:bg-brand-primary hover:text-black-shade-3 [@media(max-width:600px)]:!w-[49%] [@media(max-width:600px)]:mb-[2%]
`);
const activeTab = ctl(`
 text-black-shade-3 [&>*>*]:stroke-black-shade-3
`);
const nftBoxContainer = ctl(`
w-full max-w-[544px] flex flex-col gap-6
`);
