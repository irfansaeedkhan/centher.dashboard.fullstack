// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

// App imports
import Button from "@/components/button";
import { ShareBigIcon, BNBIcon, WarningIcon, LoaderIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import {
  formatAddress,
  formatBNB2USD,
  formatEther2Number,
} from "@/utils/format.address";
import { ethers } from "ethers";
import {
  callApproveNFTToMarketplace,
  callCancelItemForSale,
  callCreateAuction,
  callEditItemForSale,
  callListItemForSale,
} from "@/web3/utils/call.helpers";
import { useWeb3React } from "@web3-react/core";
import { useGetApprovedForAll } from "@/web3/hooks/use.contracts.functions";
import toast from "react-hot-toast";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";

interface NonNFTDescriptionProps {
  data: INFTDetailData | undefined;
  reload?: boolean;
  setReload?: any;
}
interface listingFormInterface {
  bidPrice: number;
}
interface auctionFormInterface {
  AuctionEndTime: Date;
  StartingNFTPrice: number;
}
const ListingModalschema = Joi.object({
  bidPrice: Joi.number().required().label("bidPrice").messages({
    "string.empty": `bid Price Required`,
    "any.required": `Required Field`,
  }),
});
const AuctionModalschema = Joi.object({
  AuctionEndTime: Joi.string().required().label("AuctionEndTime").messages({
    "string.empty": `Auction End Time Required`,
    "any.required": `Required Field`,
  }),
  StartingNFTPrice: Joi.number().required().label("StartingNFTPrice").messages({
    "string.empty": `Starting NFT Price Required`,
    "any.required": `Required Field`,
  }),
});
export const NonNFTDescription = ({
  data,
  reload,
  setReload,
}: NonNFTDescriptionProps) => {
  const { library, account } = useWeb3React();
  const [Modal, setModal] = useState(false);
  const [renderState, setRenderState] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const bnbPrice = useBNBPrice();

  const listingForm = useForm<listingFormInterface>({
    mode: "onChange",
    resolver: joiResolver(ListingModalschema),
  });
  const auctionForm = useForm<auctionFormInterface>({
    mode: "onChange",
    resolver: joiResolver(AuctionModalschema),
  });

  const listingModal = () => {
    setModal(true);
    if (!library) {
      toast.error("Confirm your Wallet Connection.");
      return;
    }
    setModalTitle("Listing Item");
    setModalContent(
      <form className={modalBodyWrapper}>
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
              type="number"
              // value={listingPrice}
              // onChange={(e: any) => {setListingPrice(e.target.value)}}
              id="bidPrice"
              autoComplete="off"
              {...listingForm.register("bidPrice")}
              placeholder="0.00"
              className={
                "h-full w-full !border-0 bg-transparent text-white !ring-0"
              }
            />
            <h6 className="text-14px font-semibold text-gray-shade-7">
              =$0000
            </h6>
          </div>
          {listingForm.formState.errors?.bidPrice && (
            <p className={`text-red-500 ${errMessage}`}>
              {listingForm.formState.errors.bidPrice.message}
            </p>
          )}
        </div>

        <Button
          title={"Next"}
          variant={listingForm.formState.isValid ? "v1" : "v2"}
          disabled={listingForm.formState.isValid ? false : true}
          onClick={listingForm.handleSubmit(handleListNFT)}
          className="mt-2 py-4"
        />
      </form>
    );
  };

  const auctionModal = () => {
    if (!library) {
      toast.error("Confirm your Wallet Connection.");
      return;
    }
    setModalTitle("Auction");
    setModalContent(
      <form className={modalBodyWrapper}>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Set Auction End Time</label>
          <input
            type="datetime-local"
            id="AuctionEndTime"
            autoComplete="off"
            {...auctionForm.register("AuctionEndTime")}
            placeholder="Set Auction End Time"
            className="h-full w-full !border-0 bg-transparent text-white !ring-0"
          />
          {auctionForm.formState.errors.AuctionEndTime && (
            <p className={`text-red-500 ${errMessage}`}>
              {auctionForm.formState.errors.AuctionEndTime.message}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Starting price for NFT</label>
          <div className="relative">
            <span className="text-14px absolute right-2 top-[50%] translate-x-[-50%] leading-[0] text-yellow-theme">
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
          onClick={auctionForm.handleSubmit(handleAuction)}
          className="mt-2 py-4"
        />
      </form>
    );
  };
  const handleAuction = async (data: any) => {
    setModal(false);
    saleWithAuction(data.StartingNFTPrice, data.AuctionEndTime);
  };
  const handleListNFT = async (data: any) => {
    setModal(false);
    saleWithListing(data.bidPrice);
  };
  const saleWithAuction = (auctionPrice: any, auctionDate: any) => {
    setModalTitle("Cancel listing");
    setModalContent(
      <div className={modalBodyWrapper}>
        <WarningIcon className="mx-auto" />
        <h3 className="text-18px font-semibold leading-6 text-white">
          Are you sure you want to cancel your Listing?
        </h3>
        <p className="text-14px font-normal leading-6 text-gray-shade-2">
          Canceling your listing will unpublish this sale from market and You
          will be asked to confirm the transaction through your wallet.
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"Go back"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModalTitle("");
              setModalContent(null);
              setModal(false);
            }}
          />
          <Button
            title={"Proceed"}
            onClick={() => handleAuctionProc(auctionPrice, auctionDate)}
            variant="v1"
            className="py-4"
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const saleWithListing = (listingPrice: any) => {
    setModalTitle("Edit listing");
    setModalContent(
      <div className={modalBodyWrapper}>
        <WarningIcon className="mx-auto" />
        <h3 className="text-18px font-semibold leading-6 text-white">
          Are you sure you want to List your NFT to sell?
        </h3>
        <p className="text-14px font-normal leading-6 text-gray-shade-2">
          Listing Price will be {listingPrice} BNB.
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"Go back"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModalTitle("");
              setModalContent(null);
              setModal(false);
            }}
          />
          <Button
            title={"Proceed"}
            onClick={() => handleListing(listingPrice)}
            variant="v1"
            className="py-4"
          />
        </div>
      </div>
    );
    setModal(true);
  };

  const ProceedFunc = () => {
    setModalTitle("Complete Checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <LoaderIcon className="mx-auto animate-spin" />
        <h3 className="text-18px font-semibold leading-6 text-white">
          Transaction in progress
        </h3>
        <p className="text-14px font-normal leading-6 text-gray-shade-2">
          Your transaction is in progress, Please wait.
        </p>
        {/* <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Transaction Hash
          <span className="text-yellow-theme ml-2">0x1204...23b350</span>
        </p> */}
        {/* <div className={footerBtnContainer}>
          <Button
            title={"Cancel"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
        </div> */}
      </div>
    );
    setModal(true);
  };
  const SuccessFunc = (txStatus: boolean) => {
    setModalTitle("Complete Checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <Image
          className={ImgStyling}
          src={data ? data.image : ""}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px font-semibold text-white">
          {txStatus ? "Success!" : "Failed!"}
        </h2>
        {txStatus && (
          <p className="text-14px font-normal leading-6 text-gray-shade-2">
            Congratulations! You have successfully listed{" "}
            <span className="text-white">{data?.name}</span> NFT on{" "}
            <b>Centher</b>
            platform.
          </p>
        )}
        {!txStatus && (
          <p className="text-14px font-normal leading-6 text-gray-shade-2">
            Transaction Failed.
          </p>
        )}
        {/* <Link href={{
              pathname: AppRoutes.marketplace.nft,
              query: {
                collection: nftData?.collection,
                nftId: 2,
              }}}
          className={footerBtnContainer}
        > */}
        <div className={footerBtnContainer}>
          <Button
            title={"Ok"}
            variant="v4"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
          {/* </Link> */}
        </div>
      </div>
    );
    setModal(true);
  };

  const handleAuctionProc = async (auctionPrice: any, auctionDate: any) => {
    const endTime = Math.floor((Date.parse(auctionDate) - Date.now()) / 1000);

    ProceedFunc();
    if (library && data) {
      const result = await callCreateAuction(
        library,
        data.collection,
        data.nftId,
        Number(auctionPrice),
        endTime
      );
      SuccessFunc(result.success);
    } else {
      SuccessFunc(false);
    }
  };
  const isApproved = useGetApprovedForAll(account, data?.collection);
  const handleListing = async (listingPrice: any) => {
    ProceedFunc();
    if (library && data) {
      if (!isApproved) {
        const approveResult = await callApproveNFTToMarketplace(
          library,
          data.collection
        );
        if (approveResult.success) {
          const result = await callListItemForSale(
            library,
            data.collection,
            data.nftId,
            listingPrice
          );
          SuccessFunc(result.success);
        } else {
          SuccessFunc(false);
        }
      } else {
        const result = await callListItemForSale(
          library,
          data.collection,
          data.nftId,
          listingPrice
        );
        SuccessFunc(result.success);
      }
    } else {
      SuccessFunc(false);
    }
  };

  return (
    <div className={nftDescriptionContainer}>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Current Price</h4>
        <div className="flex items-center  gap-3">
          <BNBIcon />
          <h5 className={BnBNum}>
            {formatEther2Number(data?.listInfo.price)} BNB
          </h5>
          <h6 className={greyTxt}>
            {" "}
            =${formatBNB2USD(data?.listInfo.price, bnbPrice)}
          </h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p className={`${greyTxt} whitespace-pre-wrap break-all leading-6`}>
          {data?.description}
        </p>
      </div>
      <div className="buttonContainer flex items-center gap-4">
        <Button
          title={"Auction"}
          variant="v1"
          className="py-4"
          onClick={() => {
            auctionModal();
            setModal(true);
          }}
        />
        <Button
          title={"List"}
          onClick={listingModal}
          variant="v4"
          className="py-4"
        />
      </div>

      {Modal && (
        <CustomModal
          onClose={() => {
            setModal(false);
          }}
          title={ModalTitle}
        >
          {ModalContent}
        </CustomModal>
      )}
    </div>
  );
};
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
