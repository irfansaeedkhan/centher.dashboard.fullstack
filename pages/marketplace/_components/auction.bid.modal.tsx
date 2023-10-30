import React, { useState } from "react";
import { BNBIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import Button from "@/components/button";

const AuctionBidModal = ({ onSubmit, onClose }: any) => {
  const [bidPrice, setBidPrice] = useState<string>("");
  const [bidPriceErr, setBidPriceErr] = useState(true);

  const handleBidValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setBidPrice(e.target.value);
    if (!!e.target.value) {
      setBidPriceErr(false);
    } else {
      setBidPriceErr(true);
    }
  };

  return (
    <CustomModal onClose={onClose} title={"Place a bid"}>
      <div className={modalBodyWrapper}>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Blockchain</label>
          <div className={`${inputFieldModal} flex items-center gap-3 pl-2`}>
            <BNBIcon />{" "}
            <h6 className="text-sm font-semibold text-white">BNB</h6>
          </div>
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Price</label>
          <div
            className={`${inputFieldModal} gradient-border-3 flex items-center justify-between gap-3 p-[1px] `}
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
                "h-full w-full border-0 bg-transparent text-white outline-none ring-0 focus:ring-0"
              }
            />
            <h6 className="mr-2 text-sm font-semibold text-gray-shade-7">
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
          title={"Place Bid"}
          variant={"primary"}
          disabled={bidPriceErr}
          className="mt-2"
          borderRounded="14px"
          onClick={() => {
            onSubmit(bidPrice);
          }}
        />
      </div>
    </CustomModal>
  );
};

export default AuctionBidModal;

// styling
const errMessage = `pb-2 text-xs font-medium`;
const fieldWrapper = `flex gap-2 flex-col w-full`;
const fieldTitle = `text-sm text-start font-normal text-white`;
const modalBodyWrapper = `flex flex-col gap-4 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 text-center`;
const inputFieldModal = `w-full h-[48px] bg-black-shade-3 text-gray-shade-17 font-semibold text-sm rounded-lg border-0 focus:outline-none`;
