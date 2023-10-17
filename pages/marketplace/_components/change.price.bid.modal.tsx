import React, { useEffect, useState } from "react";
import Image from "next/image";

import Button from "@/components/button";
import { CustomNumberInput } from "@/components/custom-number-input";
import { BNBIcon } from "@/assets/svgs";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatEther2Number } from "@/utils/format.address";
import { BlockchainConfig } from "@/web3/blockchain/config";

interface FixedPriceNFTDescriptionProps {
  data: INFTDetailData | undefined;
  setupEditListingItemPriceModal: any;
}

const ChangePriceBidModal = ({
  data,
  setupEditListingItemPriceModal,
}: FixedPriceNFTDescriptionProps) => {
  const [nftPrice, setNFTPrice] = useState<any>("");
  const [changeNFTPrice, setChangeNFTPrice] = useState<any>(null);
  const [nftPriceError, setNFTPriceError] = useState<any>("");

  useEffect(() => {
    setNFTPrice(formatEther2Number(data?.listInfo.price));
  }, [nftPrice, data?.listInfo.price]);

  return (
    <div className={modalBodyWrapper}>
      {data && (
        <div className="flex flex-col items-center justify-center gap-6">
          <Image
            src={data.image}
            alt="NFT Image"
            width={64}
            height={64}
            className="!h-[64px] rounded-xl object-cover"
          />
          <h4 className="text-center text-lg font-semibold text-white">
            {data.name}
          </h4>
        </div>
      )}
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Price</label>
        <div
          className={`${inputFieldModal} flex items-center justify-between gap-3 !p-0 !px-3 ring-0 focus-within:!ring-brand-primary`}
        >
          <BNBIcon />
          <CustomNumberInput
            id="bidPrice"
            autoComplete="off"
            onChange={(e) => {
              setNFTPriceError("");
              const inputValue = e.target.value;
              const numberValue = Number(inputValue);

              const pattern = /^\d*\.?\d+$/; // Regular expression to match positive integers and positive floating numbers
              if (pattern.test(inputValue)) {
                if (numberValue <= 0) {
                  setNFTPriceError("NFT Price must be greater than 0");
                  setChangeNFTPrice(null);
                }
                if (numberValue < BlockchainConfig.networkDecimals) {
                  setNFTPriceError(
                    "NFT Price must be greater than 0.000000000000000001"
                  );
                  setChangeNFTPrice(null);
                }
                if (numberValue === nftPrice) {
                  setNFTPriceError(
                    "NFT Price must be different from current price"
                  );
                  setChangeNFTPrice(null);
                } else {
                  setChangeNFTPrice(numberValue);
                }
              } else if (e.target.value == "") {
                setNFTPriceError("Field Required");
                setChangeNFTPrice(null);
              } else {
                setNFTPriceError("NFT Price must be a positive number");
                setChangeNFTPrice(null);
              }
            }}
            placeholder={nftPrice}
            className={
              "h-full w-full !border-0 bg-transparent px-0 text-white !ring-0"
            }
          />
        </div>
        {nftPriceError !== "" && (
          <p className={`text-red-500 ${errMessage}`}>{nftPriceError}</p>
        )}
      </div>

      <Button
        title={"Next"}
        variant={
          changeNFTPrice === null || nftPriceError ? "primary" : "primary"
        }
        disabled={changeNFTPrice === null || nftPriceError ? true : false}
        onClick={() => setupEditListingItemPriceModal(changeNFTPrice)}
        className="mt-2"
      />
    </div>
  );
};

export default ChangePriceBidModal;

// styling
const modalBodyWrapper = `
  flex flex-col gap-4 w-full px-4 pt-4 text-center
`;
const errMessage = `
pb-2 text-12px font-medium
`;
const fieldWrapper = `
  flex gap-2 flex-col w-full
`;
const fieldTitle = `
  text-14px font-normal text-white text-start
`;
const inputFieldModal = `
  w-full py-3 px-5 h-[48px] !bg-black-shade-3  text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus-within:outline-none focus-within:ring-2 focus-within:!ring-brand-primary active:!ring-yellow-theme
`;
