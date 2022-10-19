// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";
import { ShareBigIcon, BNBIcon } from "@/assets/svgs";

export const NFTDescription = () => {
  return (
    <div className={nftDescriptionContainer}>
      <div className={titleContainer}>
        <h1 className={title}>Maradona sport</h1>
        <button>
          <ShareBigIcon />
        </button>
      </div>
      <div className={desNameContainer}>
        <div className={nameBox}>
          <div className="linearCircle1"></div>
          <div className="flex flex-col gap-1">
            <h5 className={nameBoxTitle}>Creator</h5>
            <h6 className={nameBoxZValue}>You</h6>
          </div>
        </div>
        <div className={nameBox}>
          <div className="linearCircle2"></div>
          <div className="flex flex-col gap-1">
            <h5 className={nameBoxTitle}>Owner</h5>
            <h6 className={nameBoxZValue}>You</h6>
          </div>
        </div>
        <div className={nameBox}>
          <div className="flex flex-col gap-1">
            <h5 className={nameBoxTitle}>Collection</h5>
            <h6 className={nameBoxZValue}>Collection Name</h6>
          </div>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Current Price</h4>
        <div className="flex gap-3  items-center">
          <BNBIcon />
          <h5 className={BnBNum}>89.08 BNB</h5>
          <h6 className={greyTxt}> =$24190.19</h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p className={`${greyTxt} leading-6`}>
          This NFT is a &quot;bismuth edition&quot; version of Paracelsus. It is
          a tribute to the great Alchemist Paracelsus as Bismuth is one of the
          minerals with which the Philosopher&apos;s Stone can be made.
        </p>
      </div>
      <div className="buttonContainer flex items-center gap-4">
        <Button title={"Cancel Listing"} variant="v1" className="py-4" />
        <Button title={"Edit"} variant="v4" className="py-4" />
      </div>
    </div>
  );
};
// styling
const nftDescriptionContainer = ctl(`
w-full flex flex-col gap-5
`);
const titleContainer = ctl(`
flex items-center justify-between 
`);
const desNameContainer = ctl(`
flex gap-6 [@media(max-width:600px)]:flex-wrap
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  animationTextHeading text-34px
`);
const nameBox = ctl(`
flex items-start gap-3
`);
const nameBoxTitle = ctl(`
text-12px font-normal text-gray-shade-2
`);
const nameBoxZValue = ctl(`
text-14px font-semibold text-white
`);
const greyBoxContainer = ctl(`
bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6
`);
const greyTxt = ctl(`
text-14px font-normal text-gray-shade-7
`);
const desTitle = ctl(`
text-14px font-semibold text-white
`);
const BnBNum = ctl(`
text-16px font-bold text-white
`);
