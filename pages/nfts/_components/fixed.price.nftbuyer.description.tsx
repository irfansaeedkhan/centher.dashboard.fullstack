// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";
import { ShareBigIcon, BNBIcon, WarningIcon, LoaderIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
export const FixedPriceNFTBuyerDescription = () => {
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const buyNFTStep1Func = () => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <Image
          className={ImgStyling}
          src={"/images/nftAsset.png"}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px text-white font-semibold">Maradona sport</h2>
        <h3 className="text-white text-14px font-normal">Gas fee 10%</h3>
        <h6 className="text-white text-14px font-bold flex items-center gap-2 justify-center">
          <span>Price:</span>
          <BNBIcon />
          89.08 BNB <span className="text-gray-shade-2 "> =$24190.19</span>
        </h6>
        <div className={footerBtnContainer}>
          <Button
            title={"Checkout"}
            variant="v1"
            className="py-4"
            onClick={buyNFTStep2Func}
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const buyNFTStep2Func = () => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <LoaderIcon className="mx-auto" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Transaction in progress
        </h3>
        {/* <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Your transaction is in progress, Please wait.
        </p> */}
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Transaction Hash
          <span className="text-yellow-theme ml-2">0x1204...23b350</span>
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"Cancel"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const buyNFTSuccessFunc = () => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <Image
          className={ImgStyling}
          src={"/images/nftAsset.png"}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px text-white font-semibold">Purchased</h2>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Congratulations! You have successfully bought{" "}
          <span className="text-white">Maradona sport</span> NFT on Nether NFT
          platform.
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"View item"}
            variant="v4"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
        </div>
      </div>
    );
    setModal(true);
  };

  return (
    <div className={nftDescriptionContainer}>
      <div className={desNameContainer}>
        <div className={nameBox}>
          <div className="linearCircle1"></div>
          <div className="flex flex-col gap-1">
            <h5 className={nameBoxTitle}>Creator</h5>
            <h6 className={nameBoxZValue}>Dannathaos ART</h6>
          </div>
        </div>
        <div className={nameBox}>
          <div className="linearCircle2"></div>
          <div className="flex flex-col gap-1">
            <h5 className={nameBoxTitle}>Owner</h5>
            <h6 className={nameBoxZValue}>YDannathaos ARTou</h6>
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
      <div className="buttonContainer flex items-center">
        <Button
          title={"Buy NFT"}
          variant="v1"
          className="py-4"
          onClick={buyNFTStep1Func}
        />
      </div>
      {Modal && (
        <CustomModal
          onClose={() => {
            setModal(false);
          }}
          title={ModalTitle}
        >
          {ModalContent}
        </CustomModal>
      )}
    </div>
  );
};
// styling
const modalBodyWrapper = ctl(`
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center
`);
const footerBtnContainer = ctl(`
flex items-center gap-4 mt-3
`);
const ImgStyling = ctl(`
w-[64px] h-[64px]  rounded-2xl object-contain mx-auto
`);
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
