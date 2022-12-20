// React, Next, NPM Packages
import React, { useState, useEffect, useCallback } from "react";
import ctl from "@netlify/classnames-template-literals";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useForm } from "react-hook-form";

// App imports
import Button from "@/components/button";
import { ShareBigIcon, BNBIcon, AuctionIcon, LoaderIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";

const AuctionBidModal = ({ onSubmit }: any) => {
  const [Modal, setModal] = useState(false);
  const [bidPrice, setBidPrice] = useState<any>(null);
  const [bidPriceErr, setBidPriceErr] = useState(true);
  // const bidNFTModalFunc = useCallback(() => {

  // }, [bidPrice, bidPriceErr, library, onSubmit]);
  const handleBidValue = (e: any) => {
    setBidPrice(e.target.value);

    if (!!e.target.value) {
      setBidPriceErr(false);
    } else {
      setBidPriceErr(true);
    }
  };
  return (
    <CustomModal
      onClose={() => {
        setModal(false);
      }}
      title={"Place a bid"}
    >
      <div className={modalBodyWrapper}>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Blockchain</label>
          <div className={`${inputFieldModal} flex items-center gap-3 !ring-0`}>
            <BNBIcon />{" "}
            <h6 className="text-14px font-semibold text-white">BNB</h6>
          </div>
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Price</label>
          <div
            className={`${inputFieldModal} flex items-center justify-between gap-3 !p-0 !px-3 !ring-0`}
          >
            <input
              type="text"
              onKeyPress={(event) => {
                if (!/[0-9.]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              pattern="[0-9.]*"
              id="bidPrice"
              autoComplete="off"
              name="bidPrice"
              onChange={handleBidValue}
              value={bidPrice}
              placeholder="0.00"
              className={
                "w-full h-full !border-0 !ring-0 bg-transparent text-white"
              }
            />
            <h6 className="text-14px font-semibold text-gray-shade-7">
              =$0000
            </h6>
          </div>
          {bidPriceErr && (
            <p className={`text-red-500 ${errMessage}`}>
              Kindly fill the form using numbers
            </p>
          )}
        </div>
        <Button
          title={"Place bid "}
          variant={bidPriceErr ? "v2" : "v1"}
          disabled={bidPriceErr}
          onClick={() => {
            onSubmit(bidPrice);
          }}
          className="py-4 mt-2"
        />
      </div>
    </CustomModal>
  );
};

export default AuctionBidModal;

// styling
const modalBodyWrapper = ctl(`
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 
`);
const errMessage = ctl(`
pb-2 text-12px font-medium
`);
const fieldWrapper = ctl(`
  flex gap-2 flex-col w-full
`);
const fieldTitle = ctl(`
  text-14px  font-normal text-white
`);
const inputFieldModal = ctl(`
  w-full py-3 px-5 h-[48px]  !bg-black-shade-2  text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none ring-black-shade-7 ring-2 focus:!ring-yellow-theme active:!ring-yellow-theme
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

const ImgStyling = ctl(`
w-[64px] h-[64px]  rounded-2xl object-contain mx-auto
`);

const footerBtnContainer = ctl(`
flex items-center gap-4
`);
