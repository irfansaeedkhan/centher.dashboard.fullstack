// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";
import {
  ShareBigIcon,
  BNBIcon,
  WarningIcon,
  LoaderIcon,
  QuestionIcon,
} from "@/assets/svgs";
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

interface NonNFTDescriptionProps {
  data: INFTDetailData | undefined;
  reload?: boolean;
  setReload?: any;
}
export const NonNFTDescription = ({
  data,
  reload,
  setReload,
}: NonNFTDescriptionProps) => {
  const { library, account } = useWeb3React();
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const listingModal = () => {
    setModalTitle("Listing Item");
    setModalContent(
      <form onSubmit={handleListNFT} className={modalBodyWrapper}>
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
              // value={listingPrice}
              // onChange={(e: any) => {setListingPrice(e.target.value)}}
              placeholder="0.00"
              className={
                "w-full h-full !border-0 !ring-0 bg-transparent text-white"
              }
            />
            <h6 className="text-14px font-semibold text-gray-shade-7">
              =$0000
            </h6>
          </div>
        </div>
        <Button
          title={"Next"}
          variant="v1"
          // disabled={listingPrice <= 0}
          className="py-4 mt-2"
        />
      </form>
    );
  };
  const auctionModal = () => {
    setModalTitle("Auction");
    setModalContent(
      <form onSubmit={handleAuction} className={modalBodyWrapper}>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Set Auction End Time</label>
          <input
            type="date"
            id="AuctionEndTime"
            autoComplete="off"
            placeholder="Enter NFT Price"
            className="w-full h-full !border-0 !ring-0 bg-transparent text-white"
          />
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Starting price for NFT</label>
          <input
            type="text"
            id="StartingNFTPrice"
            autoComplete="off"
            placeholder="Enter NFT Price"
            className="w-full h-full !border-0 !ring-0 bg-transparent text-white"
          />
          <div className={serviceFee}>
            <div className={serviceFeeTitle}>
              <span className={serviceFeeName}>Service fee</span>
              <QuestionIcon />
            </div>
            <span className={serviceFeeNumber}>0.0370 BNB</span>
          </div>
        </div>
        <Button
          title={"Next"}
          variant="v1"
          // disabled={auctionPrice <= 0}
          // onClick={handleAuction}
          className="py-4 mt-2"
        />
      </form>
    );
  };
  const handleAuction = async (event: any) => {
    setModal(false);
    saleWithAuction(event.target[1].value, event.target[0].value);
  };
  const handleListNFT = async (data: any) => {
    setModal(false);
    saleWithListing(data.target[0].value);
  };
  const saleWithAuction = (auctionPrice: any, auctionDate: any) => {
    setModalTitle("Cancel listing");
    setModalContent(
      <div className={modalBodyWrapper}>
        <WarningIcon className="mx-auto" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Are you sure you want to cancel your Listing?
        </h3>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
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
        <h3 className="text-white text-18px font-semibold leading-6">
          Are you sure you want to List your NFT to sell?
        </h3>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
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
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <LoaderIcon className="mx-auto" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Transaction in progress
        </h3>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
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
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <Image
          className={ImgStyling}
          src={data ? data.image : ""}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px text-white font-semibold">
          {txStatus ? "Success!" : "Failed!"}
        </h2>
        {txStatus && (
          <p className="text-gray-shade-2 text-14px font-normal leading-6">
            Congratulations! You have successfully listed{" "}
            <span className="text-white">{data?.name}</span> NFT on Nether NFT
            platform.
          </p>
        )}
        {!txStatus && (
          <p className="text-gray-shade-2 text-14px font-normal leading-6">
            Transaction Failed.
          </p>
        )}
        {/* <Link href={{
              pathname: AppRoutes.nfts.nft,
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
    const now = Date.now() / 1000;
    const endDate = new Date(auctionDate).getTime() / 1000;
    const endTime = Math.floor(endDate - now);

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
      if (isApproved) {
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
        <div className="flex gap-3  items-center">
          <BNBIcon />
          <h5 className={BnBNum}>
            {formatEther2Number(data?.listInfo.price)} BNB
          </h5>
          <h6 className={greyTxt}> =${formatBNB2USD(data?.listInfo.price)}</h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p className={`${greyTxt} leading-6`}>{data?.description}</p>
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
          onClick={() => {
            listingModal();
            setModal(true);
          }}
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

const serviceFee = ctl(`
flex justify-between items-center pt-1
`);
const serviceFeeTitle = ctl(`
flex items-center gap-3
`);
const serviceFeeName = ctl(`
text-[#838B8F] text-12px font-normal
`);
const serviceFeeNumber = ctl(`
 text-white text-12px font-normal
`);
