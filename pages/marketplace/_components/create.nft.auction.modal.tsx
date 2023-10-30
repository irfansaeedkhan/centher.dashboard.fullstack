import React from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
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
    <form className="flex w-full flex-col gap-4 px-2 pt-2 text-center fmd:px-4 fmd:pt-4">
      <div className="flex w-full flex-col gap-2">
        <label className="text-start text-sm font-normal text-white">
          Set Auction End Time
        </label>
        <input
          type="datetime-local"
          id="AuctionEndTime"
          autoComplete="off"
          {...auctionForm.register("AuctionEndTime")}
          placeholder="Set Auction End Time"
          className="h-[48px] w-full rounded-lg !border-0 !bg-black-shade-3 bg-transparent text-white !ring-0"
        />
        {auctionForm.formState.errors.AuctionEndTime && (
          <p className="pb-2 text-xs font-medium text-red-500">
            {auctionForm.formState.errors.AuctionEndTime.message}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col gap-2">
        <label className="text-start text-sm font-normal text-white">
          Starting price for NFT
        </label>
        <div className="relative h-[48px] rounded-lg !bg-black-shade-3">
          <span className="textGradient absolute right-2 top-[50%] translate-x-[-50%] text-sm leading-[0]">
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
          <p className="pb-2 text-xs font-medium text-red-500">
            {auctionForm.formState.errors.StartingNFTPrice.message}
          </p>
        )}
      </div>
      <Button
        title={"Next"}
        variant={auctionForm.formState.isValid ? "primary" : "secondary"}
        disabled={!auctionForm.formState.isValid}
        onClick={auctionForm.handleSubmit(handleAuctionData)}
        className="mt-2"
      />
    </form>
  );
};

export default CreateNFTAuctionModal;
