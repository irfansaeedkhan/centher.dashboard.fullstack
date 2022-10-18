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

export const UploadNFT = () => {
  const [tab, setTab] = useState("Image");

  return (
    <div className={nftBoxContainer}>
      <div className={tabsBtnContainer}>
        <Button
          title={"Image"}
          variant={tab === "Image" ? "v1" : "v2"}
          Icon={<ImageIcon />}
          onClick={() => {
            setTab("Image");
          }}
          className={`${Tab} ${tab === "Image" && activeTab}`}
        />
        <Button
          title={"Gif"}
          variant={tab === "Gif" ? "v1" : "v2"}
          Icon={<GifIcon />}
          onClick={() => {
            setTab("Gif");
          }}
          className={`${Tab} ${tab === "Gif" && activeTab}`}
        />
        <Button
          title={"Video"}
          variant={tab === "Video" ? "v1" : "v2"}
          Icon={<VideosIcon />}
          onClick={() => {
            setTab("Video");
          }}
          className={`${Tab} ${tab === "Video" && activeTab}`}
        />
        <Button
          title={"Audio"}
          variant={tab === "Audio" ? "v1" : "v2"}
          Icon={<AudioIcon />}
          onClick={() => {
            setTab("Audio");
          }}
          className={`${Tab} ${tab === "Audio" && activeTab}`}
        />
      </div>
      {tab === "Image" && <ImageNFTUpload />}
      {tab === "Gif" && <GifNFTUpload />}
      {tab === "Video" && <VideoNFTUpload />}
      {tab === "Audio" && <AudioNFTUpload />}
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
