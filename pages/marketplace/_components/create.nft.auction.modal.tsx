import React from "react";
import Joi, { string } from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import ctl from "@netlify/classnames-template-literals";
import clsx from "clsx";

import Button from "@/components/button";

interface CreateNFTAuctionModalProps {
  handleAuction: any;
}
const CreateNFTAuctionModal = ({
  handleAuction,
}: CreateNFTAuctionModalProps) => {
  interface auctionFormInterface {
    AuctionEndTime: Date;
    StartingNFTPrice: number;
  }

  const AuctionModalschema = Joi.object({
    AuctionEndTime: Joi.string().required().label("AuctionEndTime").messages({
      "string.empty": `Auction End Time Required`,
      "any.required": `Required Field`,
    }),
    StartingNFTPrice: Joi.number()
      .required()
      .label("StartingNFTPrice")
      .messages({
        "string.empty": `Starting NFT Price Required`,
        "any.required": `Required Field`,
      }),
  });

  const auctionForm = useForm<auctionFormInterface>({
    mode: "onChange",
    resolver: joiResolver(AuctionModalschema),
  });

  const handleAuctionData = (data: auctionFormInterface) => {
    handleAuction(data);
  };
  return (
    <form className={modalBodyWrapper}>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Set Auction End Time</label>
        <input
          type="datetime-local"
          id="AuctionEndTime"
          autoComplete="off"
          {...auctionForm.register("AuctionEndTime")}
          placeholder="Set Auction End Time"
          className="h-[48px] w-full rounded-lg !border-0 bg-transparent !bg-black-shade-2 text-white !ring-0"
        />
        {auctionForm.formState.errors.AuctionEndTime && (
          <p className={`text-red-500 ${errMessage}`}>
            {auctionForm.formState.errors.AuctionEndTime.message}
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Starting price for NFT</label>
        <div className="relative h-[48px]  !bg-black-shade-2">
          <span className="text-14px text-yellow-theme absolute right-2 top-[50%] translate-x-[-50%] leading-[0]">
            BNB
          </span>
          <input
            type="text"
            id="StartingNFTPrice"
            autoComplete="off"
            {...auctionForm.register("StartingNFTPrice")}
            placeholder="Enter NFT Price"
            className="h-full w-full !border-0 bg-transparent text-white !ring-0"
          />
        </div>

        {auctionForm.formState.errors.StartingNFTPrice && (
          <p className={`text-red-500 ${errMessage}`}>
            {auctionForm.formState.errors.StartingNFTPrice.message}
          </p>
        )}
      </div>
      <Button
        title={"Next"}
        variant={auctionForm.formState.isValid ? "v1" : "v2"}
        disabled={!auctionForm.formState.isValid}
        onClick={auctionForm.handleSubmit(handleAuctionData)}
        className="mt-2 py-4"
      />
    </form>
  );
};

export default CreateNFTAuctionModal;

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
const formContainer = ctl(`
 flex flex-col gap-4
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
const inputField = ctl(`
  w-full py-3 px-5  !bg-black-shade-3  text-white font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:ring-yellow-theme
`);
