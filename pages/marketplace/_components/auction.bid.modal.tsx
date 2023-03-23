// React, Next, NPM Packages
import React, { useState } from "react";

// App imports
import Button from "@/components/button";
import { BNBIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";

const AuctionBidModal = ({ onSubmit, onClose }: any) => {
  const [bidPrice, setBidPrice] = useState<string>("");
  const [bidPriceErr, setBidPriceErr] = useState(true);

  const handleBidValue = (e: any) => {
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
                "h-full w-full !border-0 bg-transparent text-white !ring-0"
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
          className="mt-2 py-4"
        />
      </div>
    </CustomModal>
  );
};

export default AuctionBidModal;

// styling
const modalBodyWrapper = `
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 
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
