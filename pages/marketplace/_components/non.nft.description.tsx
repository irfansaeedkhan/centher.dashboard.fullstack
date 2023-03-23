// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import clsx from "clsx";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

// App imports
import Button from "@/components/button";
import { BNBIcon, WarningIcon, LoaderIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import { useGetApprovedForAll } from "@/web3/hooks/use.contracts.functions";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import ChangePriceListModal from "./change.price.list.modal";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { BlockchainWrite } from "@/web3/blockchain";
import NewButton from "@/components/button/new.button";

interface NonNFTDescriptionProps {
  data: INFTDetailData | undefined;
  setNftData: () => void;
}
interface auctionFormInterface {
  AuctionEndTime: Date;
  StartingNFTPrice: number;
}

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
  setNftData,
}: NonNFTDescriptionProps) => {
  const router = useRouter();
  const { library, account } = useWeb3React();
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const bnbPrice = useBNBPrice();

  const auctionForm = useForm<auctionFormInterface>({
    mode: "onChange",
    resolver: joiResolver(AuctionModalschema),
  });

  const listingModal = () => {
    setModal(true);
    if (!library) {
      toast.error("Connect your wallet");
      return;
    }
    setModalTitle("Listing Item");
    setModalContent(<ChangePriceListModal handleListNFT={handleListNFT} />);
  };

  const handleListNFT = async (bidPrice: any) => {
    setModal(false);
    saleWithListing(bidPrice);
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
          {`Listing Price will be  ${normalizeValue(
            Number(listingPrice)
          )} BNB.`}
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

  const auctionModal = () => {
    if (!library) {
      toast.error("Connect your wallet");
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
            className="h-[48px] w-full rounded-lg !border-0 bg-transparent !bg-black-shade-2 text-white !ring-0"
          />
          {auctionForm.formState.errors.AuctionEndTime && (
            <p className={`text-red-500 ${errMessage}`}>
              {auctionForm.formState.errors.AuctionEndTime.message}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Starting price for NFT</label>
          <div className="relative h-[48px]  !bg-black-shade-2">
            <span className="text-14px text-yellow-theme absolute right-2 top-[50%] translate-x-[-50%] leading-[0]">
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
        </div>
      </div>
    );
    setModal(true);
  };

  const handleAuctionProc = async (auctionPrice: any, auctionDate: any) => {
    const endTime = Math.floor((Date.parse(auctionDate) - Date.now()) / 1000);

    ProceedFunc();

    let success = false;
    try {
      if (library && data) {
        const result = await BlockchainWrite.callCreateAuction(
          library,
          data.collection,
          data.nftId,
          Number(auctionPrice),
          endTime
        );
        if (result?.length) {
          setNftData();
          success = true;
        }
      }
    } catch (err) {
      success = false;
    } finally {
      SuccessFunc(success);
    }
  };

  const isApproved = useGetApprovedForAll(account, data?.collection);

  const handleListing = async (listingPrice: any) => {
    ProceedFunc();
    let success = false;
    try {
      if (library && data) {
        if (!isApproved) {
          const approveResult =
            await BlockchainWrite.callApproveNFTToMarketplace(
              library,
              data.collection
            );

          if (!approveResult?.length) {
            throw new Error();
          }
        }

        const result = await BlockchainWrite.callListItemForSale(
          library,
          data.collection,
          data.nftId,
          listingPrice
        );

        if (result.length) {
          setNftData();
          success = true;
        } else throw new Error();
      }
    } catch (error) {
      toast.error("some went wrong, please try again later");
    } finally {
      SuccessFunc(success);
    }
  };

  return (
    <div className={nftDescriptionContainer}>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Current Price</h4>
        <div className="flex items-center  gap-3">
          <BNBIcon />
          <h5 className={BnBNum}>
            {`${normalizeValue(formatEther2Number(data?.listInfo.price))} BNB`}
          </h5>
          <h6 className={greyTxt}>
            {" "}
            =${formatBNB2USD(data?.listInfo.price, bnbPrice)}
          </h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p
          className={clsx(greyTxt, `word-break whitespace-pre-wrap leading-6`)}
        >
          {data?.description}
        </p>
      </div>
      <div className="buttonContainer flex items-center gap-4">
        <NewButton
          title={"Auction"}
          variant="v1"
          onClick={() => {
            auctionModal();
            setModal(true);
          }}
        />
        <NewButton title={"List"} onClick={listingModal} variant="v4" />
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
const modalBodyWrapper = `flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center`;
const footerBtnContainer = `flex items-center gap-4`;
const nftDescriptionContainer = `w-full flex flex-col gap-5`;
const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6`;
const greyTxt = `text-14px font-normal text-gray-shade-7`;
const desTitle = `text-14px font-semibold text-white`;
const BnBNum = `text-16px font-bold text-white`;
const ImgStyling = `w-[64px] h-[64px]  rounded-2xl object-contain mx-auto`;
const errMessage = `pb-2 text-12px font-medium`;
const fieldWrapper = `flex gap-2 flex-col w-full`;
const fieldTitle = `text-14px  font-normal text-white`;
