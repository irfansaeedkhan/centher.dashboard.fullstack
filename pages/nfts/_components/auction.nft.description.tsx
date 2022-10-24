// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";
import { ShareBigIcon, BNBIcon, AuctionIcon, WarningIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
export const AuctionNftDescription = () => {
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const cancelListingFunc = () => {
    setModalTitle("Cancel listing");
    setModalContent(
      <div className={modalBodyWrapper}>
        <WarningIcon className="mx-auto" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Are you sure you want to cancel your Listing?
        </h3>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Canceling your listing will unpublish this sale from market and You
          will be asked to confirm the transaction through your wallet.
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"Go back"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModalTitle("");
              setModalContent(null);
              setModal(false);
            }}
          />
          <Button title={"Proceed"} variant="v1" className="py-4" />
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
        <h4 className={greyTxt}>Minimum Bid</h4>
        <div className="flex gap-3  items-center">
          <BNBIcon className="[&>*]:fill-[#E35259]" />
          <h5 className={BnBNum}>32.08 BNB</h5>
          <h6 className={greyTxt}> =$65000.6</h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p className={`${greyTxt} leading-6`}>
          This NFT is a &quot;bismuth edition&quot; version of Paracelsus. It is
          a tribute to the great Alchemist Paracelsus as Bismuth is one of the
          minerals with which the Philosopher&apos;s Stone can be made.
        </p>

        <div className="auctionTimerBox flex flex-row [@media(max-width:600px)]:!flex-col gap-3 rounded-10px relative overflow-hidden border-2 border-gray-shade-3">
          <div className="iconBox bg-background-shade-2 flex flex-col items-center gap-3 text-center p-6 min-w-[170px]">
            <AuctionIcon />
            <h4 className="text-14px font-normal text-white">
              Auction ends in
            </h4>
          </div>
          <div className="flex w-full justify-center p-4">
            <div className="timerBox flex items-center gap-5">
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">13</h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Days
                </h6>
              </div>
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">22</h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Hours
                </h6>
              </div>
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">24</h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Minutes
                </h6>
              </div>
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">02</h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Seconds
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="buttonContainer flex items-center gap-4">
        <Button
          title={"Cancel Listing"}
          variant="v1"
          className="py-4"
          onClick={cancelListingFunc}
        />
        <Button title={"Edit"} variant="v4" className="py-4" />
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
flex items-center gap-4
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
