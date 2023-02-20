import React, { useState } from "react";

import { BNBIcon } from "@/assets/svgs";
import Button from "@/components/button";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatEther2Number } from "@/utils/format.address";
import { networkDecimals } from "@/web3/constants/common";

interface FixedPriceNFTDescriptionProps {
  data: INFTDetailData | undefined;
  setupEditListingItemPriceModal: any;
}

const ChangePriceBidModal = ({
  data,
  setupEditListingItemPriceModal,
}: FixedPriceNFTDescriptionProps) => {
  const [nftPrice, setNFTPrice] = useState<any>(
    formatEther2Number(data?.listInfo.price)
  );
  const [changeNFTPrice, setChangeNFTPrice] = useState<any>(null);
  const [nftPriceError, setNFTPriceError] = useState<any>("");

  return (
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
                if (numberValue < networkDecimals) {
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
              "h-full w-full !border-0 bg-transparent text-white !ring-0"
            }
          />
          <h6 className="text-14px font-semibold text-gray-shade-7">=$0000</h6>
        </div>
        {nftPriceError !== "" && (
          <p className={`text-red-500 ${errMessage}`}>{nftPriceError}</p>
        )}
      </div>

      <Button
        title={"Next"}
        variant={changeNFTPrice === null || nftPriceError ? "v2" : "v1"}
        disabled={changeNFTPrice === null || nftPriceError ? true : false}
        onClick={() => setupEditListingItemPriceModal(changeNFTPrice)}
        className="mt-2 py-4"
      />
    </div>
  );
};

export default ChangePriceBidModal;

// styling
const modalBodyWrapper = `
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center
`;

const errMessage = `
pb-2 text-12px font-medium
`;
const fieldWrapper = `
  flex gap-2 flex-col w-full
`;
const fieldTitle = `
  text-14px  font-normal text-white
`;
const inputFieldModal = `
  w-full py-3 px-5 h-[48px]  !bg-black-shade-2  text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none ring-black-shade-7 ring-2 focus:!ring-yellow-theme active:!ring-yellow-theme
`;
