import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { BNBIcon } from "@/assets/svgs";
import { BlockchainConfig } from "@/web3/blockchain/config";
import Button from "@/components/button";
import { CustomNumberInput } from "@/components/custom-number-input";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";

import CustomDropdown from "./custom.dropdown";
import { daysData } from "./days-data";

interface Props {
  handleListNFT: any;
  data: INFTDetailData | undefined;
  handleAuction: (data: any) => void;
}

interface auctionFormInterface {
  AuctionEndTime: Date;
  StartingNFTPrice: number;
}

const ChangePriceListModal: React.FC<Props> = ({
  handleListNFT,
  data,
  handleAuction,
}) => {
  const [changeNFTPrice, setChangeNFTPrice] = useState<any>(null);
  const [nftPriceError, setNFTPriceError] = useState<any>("");
  const [activeButton, setActiveButton] = useState<"fixedPrice" | "auction">(
    "fixedPrice"
  );
  const [auctionData, setAuctionData] = useState<any>({
    StartingNFTPrice: "",
    AuctionEndTime: "1",
  });
  const [selectedOption, setSelectedOption] = useState<any>("1");

  const handleAuctionData = (auction: auctionFormInterface) => {
    const auctionDays = Number(auction.AuctionEndTime);
    let finalData = {
      StartingNFTPrice: auction.StartingNFTPrice,
      AuctionEndTime: auctionDays,
    };
    handleAuction(finalData);
  };

  return (
    <div className={`flex h-full w-full flex-col gap-4 px-2 pt-4 text-center`}>
      <div className="flex items-center justify-center gap-4">
        <Button
          title="Fixed Price"
          variant={activeButton === "fixedPrice" ? "primary" : "secondary"}
          className={clsx(activeButton === "auction" && "rounded-[14px]")}
          onClick={() => setActiveButton("fixedPrice")}
        />
        <Button
          title="Auction"
          variant={activeButton === "auction" ? "primary" : "secondary"}
          className={clsx(activeButton === "fixedPrice" && "rounded-[14px]")}
          onClick={() => setActiveButton("auction")}
        />
      </div>
      {data && (
        <div className="mt-2 flex flex-col items-center justify-center">
          <Image
            src={
              data.type.includes("audio")
                ? "/images/default-music.png"
                : data.type.includes("video")
                ? data.videoThumbnail || "/images/default-music.png"
                : data.image
            }
            width={266}
            height={190}
            alt="img"
            className="w-full max-w-[266px] rounded-xl object-cover"
          />
          <h3 className="word-break word-break mt-6 text-lg font-semibold text-white">
            {data.name}
          </h3>
        </div>
      )}
      {activeButton === "auction" && (
        <div className={`flex w-full flex-col gap-2`}>
          <label className={`text-start text-sm font-normal text-white`}>
            Set time
          </label>
          <CustomDropdown
            options={daysData.map((day) => ({
              value: day.value,
              label: day.label,
            }))}
            selectedValue={selectedOption}
            onSelect={(value) => {
              setAuctionData({
                ...auctionData,
                AuctionEndTime: value,
              });
              setSelectedOption(value);
            }}
          />
        </div>
      )}
      <div className={`flex w-full flex-col gap-2`}>
        <label className={`text-start text-sm font-normal text-white`}>
          Price
        </label>
        <div
          className={`focus-within:gradient-border-3 flex h-[48px] w-full items-center justify-between gap-2 !rounded-lg bg-black-shade-3 !p-[1px] text-sm font-semibold text-gray-shade-17`}
        >
          <BNBIcon className="ml-3 h-4 w-4" />
          <CustomNumberInput
            id="bidPrice"
            autoComplete="off"
            placeholder="0.00"
            className={
              "h-full w-full border-0 bg-transparent p-0 text-white focus:ring-0"
            }
            onChange={(e) => {
              setNFTPriceError("");
              const inputValue = e.target.value;
              const numberValue = Number(inputValue);

              const pattern = /^\d*\.?\d+$/; // Regular expression to match positive integers and positive floating numbers
              if (pattern.test(inputValue)) {
                if (numberValue <= 0) {
                  setNFTPriceError("NFT Price must be greater than 0");
                  setChangeNFTPrice(null);
                  setAuctionData({
                    ...auctionData,
                    StartingNFTPrice: "",
                  });
                }
                if (numberValue < BlockchainConfig.networkDecimals) {
                  setNFTPriceError(
                    "NFT Price must be greater than 0.000000000000000001"
                  );
                  setChangeNFTPrice(null);
                  setAuctionData({
                    ...auctionData,
                    StartingNFTPrice: "",
                  });
                }
                setChangeNFTPrice(numberValue);
                setAuctionData({
                  ...auctionData,
                  StartingNFTPrice: numberValue,
                });
              } else if (e.target.value == "") {
                setNFTPriceError("Field Required");
                setChangeNFTPrice(null);
                setAuctionData({
                  ...auctionData,
                  StartingNFTPrice: "",
                });
              } else {
                setNFTPriceError("NFT Price must be a positive number");
                setChangeNFTPrice(null);
                setAuctionData({
                  ...auctionData,
                  StartingNFTPrice: "",
                });
              }
            }}
          />
        </div>
        {nftPriceError !== "" && (
          <p className={`pb-2 text-xs font-medium text-red-500`}>
            {nftPriceError}
          </p>
        )}
      </div>

      {activeButton === "auction" ? (
        <Button
          title="Complete listing"
          variant="primary"
          className="mt-2"
          onClick={() => handleAuctionData(auctionData)}
          disabled={changeNFTPrice === null || nftPriceError ? true : false}
        />
      ) : (
        activeButton === "fixedPrice" && (
          <Button
            title="Complete listing"
            variant="primary"
            className="mt-2"
            onClick={() => handleListNFT(changeNFTPrice)}
            disabled={changeNFTPrice === null || nftPriceError ? true : false}
          />
        )
      )}
    </div>
  );
};

export default ChangePriceListModal;
