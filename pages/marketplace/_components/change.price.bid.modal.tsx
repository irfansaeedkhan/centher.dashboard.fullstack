import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/button";
import { CustomNumberInput } from "@/components/custom-number-input";
import { BNBIcon } from "@/assets/svgs";
import { formatEther2Number } from "@/utils/format.address";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";
import { useNFTImageSrc } from "@/hooks/use-nft-image-src";

interface Props {
  nft: CFSNFTForPage;
  setupEditListingItemPriceModal: any;
}

const ChangePriceBidModal: React.FC<Props> = ({
  nft,
  setupEditListingItemPriceModal,
}) => {
  const nftPrice = formatEther2Number(nft.listInfo.price);
  const [changeNFTPrice, setChangeNFTPrice] = useState<any>(null);
  const [nftPriceError, setNFTPriceError] = useState<any>("");
  const { nftImageSrc, setNftImageSrc, DEFAULT_NFT_IMAGE_SRC } =
    useNFTImageSrc(nft);

  return (
    <div className={`flex w-full flex-col gap-4 px-4 pt-4 text-center`}>
      <div className="flex flex-col items-center justify-center gap-3">
        <Image
          src={nftImageSrc}
          alt={nft.ipfs_metadata.name}
          width={64}
          height={64}
          onError={() => setNftImageSrc(DEFAULT_NFT_IMAGE_SRC)}
          className="!h-[64px] flex-shrink-0 rounded-xl object-cover"
        />
        <h4 className="word-break text-center text-lg font-semibold text-white">
          {nft.ipfs_metadata.name}
        </h4>
      </div>

      <div className={`flex w-full flex-col gap-2`}>
        <label className={`text-start text-sm font-normal text-white`}>
          Price
        </label>
        <div
          className={
            "focus-within:gradient-border-3 flex h-[48px] w-full items-center justify-between gap-3 !rounded-lg border-0 !bg-black-shade-3 !p-[1px] text-sm font-semibold text-gray-shade-17 ring-0"
          }
        >
          <span className="ml-3">
            <BNBIcon />
          </span>
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
            placeholder={nftPrice.toString()}
            className={
              "h-full w-full !border-0 bg-transparent px-0 text-white !ring-0"
            }
          />
        </div>
        {nftPriceError !== "" && (
          <p className={`pb-2 text-xs font-medium text-red-500`}>
            {nftPriceError}
          </p>
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
