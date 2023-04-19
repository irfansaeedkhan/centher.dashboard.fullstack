import React from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import ctl from "@netlify/classnames-template-literals";

import NewButton from "@/components/button/new.button";

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
    AuctionEndTime: Joi.date()
      .required()
      .greater("now")
      .label("AuctionEndTime")
      .messages({
        "string.empty": `Auction End Time Required`,
        "any.required": `Required Field`,
      }),
    StartingNFTPrice: Joi.number()
      .required()
      .min(0.000000000000000001)
      .label("StartingNFTPrice")
      .messages({
        "any.required": `Required Field`,
        "date.greater": `Auction End Time must be greater than the current time`,
      }),
  });

  const auctionForm = useForm<auctionFormInterface>({
    mode: "onChange",
    resolver: joiResolver(AuctionModalschema),
  });

  const handleAuctionData = (data: auctionFormInterface) => {
    let finalData = {
      StartingNFTPrice: data.StartingNFTPrice,
      AuctionEndTime: data.AuctionEndTime.toString(),
    };
    handleAuction(finalData);
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
          className="h-[48px] w-full rounded-lg !border-0 bg-transparent !bg-black-shade-3 text-white !ring-0"
        />
        {auctionForm.formState.errors.AuctionEndTime && (
          <p className={`text-red-500 ${errMessage}`}>
            {auctionForm.formState.errors.AuctionEndTime.message}
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Starting price for NFT</label>
        <div className="relative h-[48px] rounded-lg !bg-black-shade-3">
          <span className="text-14px absolute right-2 top-[50%] translate-x-[-50%] leading-[0] text-brand-primary">
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
      <NewButton
        title={"Next"}
        variant={auctionForm.formState.isValid ? "v1" : "v10"}
        disabled={!auctionForm.formState.isValid}
        onClick={auctionForm.handleSubmit(handleAuctionData)}
        className="mt-2"
      />
    </form>
  );
};

export default CreateNFTAuctionModal;

// styling
const modalBodyWrapper = ctl(`
  flex flex-col gap-4 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 text-center
`);
const errMessage = ctl(`
pb-2 text-12px font-medium
`);
const fieldWrapper = ctl(`
  flex gap-2 flex-col w-full
`);
const fieldTitle = ctl(`
  text-14px text-start font-normal text-white
`);
