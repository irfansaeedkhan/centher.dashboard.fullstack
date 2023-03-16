import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import clsx from "clsx";

import NewButton from "@/components/button/new.button";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import { BNBIcon, WarningIcon, LoaderIcon } from "@/assets/svgs";

import ChangePriceBidModal from "./change.price.bid.modal";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";

enum ModalType {
  cancelPrice = "cancelPrice",
  bidNft = "bidNft",
  editListing = "editListing",
  txInProgress = "txInProgress",
  success = "success",
}

export interface bidForm {
  bidPrice: number;
}

interface FixedPriceNFTDescriptionProps {
  data: INFTDetailData | undefined;
  reload?: boolean;
  setReload?: any;
}

export const FixedPriceNFTDescription = ({
  data,
}: FixedPriceNFTDescriptionProps) => {
  const router = useRouter();

  const { library } = useWeb3React();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });

  const bnbPrice = useBNBPrice();

  const setupCancelItemPriceModal = () => {
    try {
      validateProvider();
      modal.createModal(ModalType.cancelPrice);
    } catch (err: any) {
      toastError(err);
    }
  };

  const setupBidNftModal = () => {
    try {
      validateProvider();
      modal.createModal(ModalType.bidNft);
    } catch (err: any) {
      toastError(err);
    }
  };

  const setupEditListingItemPriceModal = (bidPrice: number) => {
    try {
      modal.dismissModal();
      modal.createModal(ModalType.editListing, bidPrice);
    } catch (err: any) {
      toastError(err);
    }
  };

  const setupWaitingModal = () => {
    try {
      modal.createModal(ModalType.txInProgress);
    } catch (err: any) {
      toastError(err);
    }
  };

  const setupSuccessModal = (txStatus: boolean) => {
    try {
      modal.createModal(ModalType.success, txStatus);
    } catch (err: any) {
      toastError(err);
    }
  };

  const handleCancelListing = async () => {
    setupWaitingModal();
    try {
      const result = await BlockchainWrite.callCancelItemForSale(
        library,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId
      );
      setupSuccessModal(!!result);
    } catch (error) {
      toast.error("something went wrong, please try again later");
      setupSuccessModal(false);
    }
  };

  const handleEditPrice = async (newPrice: any) => {
    let result;
    setupWaitingModal();
    try {
      validateProvider();
      if (!data?.collection || !data?.nftId || !newPrice) {
        throw new Error(
          "Something went wrong. please refresh the page or try later."
        );
      }

      result = await BlockchainWrite.callEditItemForSale(
        library,
        data.collection,
        data.nftId,
        newPrice
      );
    } catch (err) {
      toastError(err);
    }

    setupSuccessModal(!!result);
  };

  const modalTemplateCollection: TemplateCollection = {
    cancelPrice: {
      content: () => (
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
            <NewButton
              title={"Go back"}
              variant="v2"
              onClick={() => {
                modal.dismissModal();
              }}
            />
            <NewButton
              title={"Proceed"}
              onClick={handleCancelListing}
              variant="v1"
            />
          </div>
        </div>
      ),
      title: "Cancel listing",
      visibility: true,
    },
    bidNft: {
      title: "Change Price",
      visibility: true,
      content: () => (
        <ChangePriceBidModal
          data={data}
          setupEditListingItemPriceModal={setupEditListingItemPriceModal}
        />
      ),
    },
    editListing: {
      title: "Edit listing",
      visibility: true,
      content: (newPrice: any) => (
        <div className={modalBodyWrapper}>
          <WarningIcon className="mx-auto" />
          <h3 className="text-18px font-semibold leading-6 text-white">
            Are you sure you want to edit your Listing Price?
          </h3>
          <p className="text-14px font-normal leading-6 text-gray-shade-2">
            Listing Price will be changed.
          </p>
          <div className={footerBtnContainer}>
            <NewButton
              title={"Go back"}
              variant="v2"
              onClick={() => {
                modal.dismissModal();
              }}
            />
            <NewButton
              title={"Proceed"}
              onClick={() => handleEditPrice(newPrice)}
              variant="v1"
            />
          </div>
        </div>
      ),
    },
    txInProgress: {
      title: "Complete Checkout",
      visibility: true,
      content: () => (
        <div className={modalBodyWrapper}>
          <LoaderIcon className="mx-auto animate-spin" />
          <h3 className="text-18px font-semibold leading-6 text-white">
            Transaction in progress
          </h3>
          <p className="text-14px font-normal leading-6 text-gray-shade-2">
            Your transaction is in progress, Please wait.
          </p>
        </div>
      ),
    },
    success: {
      title: "Complete Checkout",
      visibility: true,
      content: (status: boolean) => (
        <div className={modalBodyWrapper}>
          <Image
            className={ImgStyling}
            src={data ? data.image : ""}
            alt="image"
            height={64}
            width={64}
          />
          <h2 className="text-18px font-semibold text-white">
            {status ? "Success!" : "Failed!"}
          </h2>
          {status && (
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              Congratulations! You have successfully changed{" "}
              <span className="text-white">{data?.name}</span> NFT price on
              <b>Centher</b> NFT platform.
            </p>
          )}
          {!status && (
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              Transaction Failed.
            </p>
          )}
          <div className={footerBtnContainer}>
            <NewButton
              title={"Ok"}
              variant="v4"
              onClick={() => {
                router.reload();
                modal.dismissModal();
              }}
            />
          </div>
        </div>
      ),
    },
  };

  const modal = new ModalManager(setModalModel, modalTemplateCollection);

  function validateProvider(): void {
    if (!library) {
      throw new Error("Connect your wallet");
    }
  }

  function toastError(err: any): void {
    toast.error(err?.message ? err.message : err);
  }

  return (
    <div className={nftDescriptionContainer}>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Current Price</h4>
        <div className="flex flex-col items-start gap-3 fsm:flex-row  fsm:items-center">
          <div className="flex items-center gap-2">
            <BNBIcon />
            <h5 className={BnBNum}>
              {`${normalizeValue(
                formatEther2Number(data?.listInfo.price)
              )} BNB`}
            </h5>
          </div>
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
          title={"Cancel Listing"}
          variant="v1"
          className="py-4"
          onClick={setupCancelItemPriceModal}
        />
        <NewButton
          title={"Edit"}
          onClick={() => {
            setupBidNftModal();
          }}
          variant="v4"
          className="py-4"
        />
      </div>

      {ModalModel.visibility && (
        <CustomModal
          onClose={() => {
            modal.dismissModal();
          }}
          title={ModalModel.title as any}
        >
          {ModalModel.content}
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
bg-background-shade-3 rounded-10px flex flex-col gap-2 p-3 fsm:p-6 
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
