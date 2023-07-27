import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import clsx from "clsx";

import FinalButton from "@/components/button/final.button";
import { IModalProps } from "@/components/modal/standard.modal";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import {
  BNBIcon,
  WarningIcon,
  LoaderIcon,
  MigrateIcon,
  GreenTick,
  CircularClose,
} from "@/assets/svgs";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { ModalMigrate } from "@/components/modal/modal.migrate";

import ChangePriceBidModal from "./change.price.bid.modal";

enum ModalType {
  cancelPrice = "cancelPrice",
  bidNft = "bidNft",
  editListing = "editListing",
  txInProgress = "txInProgress",
  success = "success",
  migrate = "migrate",
}

export interface bidForm {
  bidPrice: number;
}

interface FixedPriceNFTDescriptionProps {
  data: INFTDetailData | undefined;
  setNftData: () => void;
}

export const FixedPriceNFTDescription = ({
  data,
  setNftData,
}: FixedPriceNFTDescriptionProps) => {
  const { library } = useWeb3React();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const [migrateModal, setMigrateModal] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });

  useEffect(() => {
    const CheckStatus = async () => {
      if (data?.saleState === "List") {
        const Status = await BlockchainRead.isCurrentMarketplaceOwner(
          library,
          data.collection,
          data.nftId
        );
        if (!Status) {
          setMigrateModal({
            visibility: true,
            title: "Migrate NFT",
            content: (
              <div className="p-4">
                <div className="mb-6 flex w-full justify-center">
                  <MigrateIcon />
                </div>
                <h3 className="mb-2 flex w-full justify-center space-x-1 text-sm font-semibold text-white fsm:text-lg">
                  <span>Migrate your</span>
                  <span className="text-brand-primary"> listed tokens</span>
                </h3>
                <p className="mb-6 text-center text-xs text-white fsm:text-sm">
                  Migrate your tokens to our new marketplace for uninterrupted
                  rewards and benefits. Don&apos;t miss out - act now!
                </p>
                <FinalButton
                  title={"Migrate Now"}
                  variant="primary"
                  className="w-full rounded-[14px]"
                  onClick={migrateNowHandler}
                />
              </div>
            ),
          });
        }
      }
    };

    const migrateNowHandler = async () => {
      let success = false;
      try {
        setMigrateModal({ ...migrateModal, visibility: false });
        setupWaitingModal();
        const result = await BlockchainWrite.transferNftToCurrentMarketplace(
          library,
          data?.collection as string,
          data?.nftId as number,
          data?.listInfo?.price as number,
          data?.auctionInfo.endTime as number
        );

        if (!result?.length) {
          throw new Error("cannot migrate");
        }
        success = true;
        setupSuccessModal(
          success,
          "Congratulations! Migration is completed for "
        );
      } catch (error) {
        toast.error("It's not possible to transfer your NFT to new version");
        setupSuccessModal(
          success,
          "It's not possible to transfer your NFT to new version"
        );
      }
    };
    CheckStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, library]);

  const bnbPrice = useBNBPrice();

  const setupCancelItemPriceModal = () => {
    try {
      validateProvider();
      modal.createModal(ModalType.cancelPrice);
    } catch (err: any) {
      toast.error("something went wrong, please try again later");
    }
  };

  const setupBidNftModal = () => {
    try {
      validateProvider();
      modal.createModal(ModalType.bidNft);
    } catch (err: any) {
      toast.error("something went wrong, please try again later");
    }
  };

  const setupEditListingItemPriceModal = (bidPrice: number) => {
    try {
      modal.dismissModal();
      modal.createModal(ModalType.editListing, bidPrice);
    } catch (err: any) {
      toast.error("something went wrong, please try again later");
    }
  };

  const setupWaitingModal = () => {
    try {
      modal.createModal(ModalType.txInProgress);
    } catch (err: any) {
      toast.error("something went wrong, please try again later");
    }
  };

  const setupSuccessModal = (txStatus: boolean, msg: string) => {
    try {
      modal.createModal(ModalType.success, { txStatus, msg });
    } catch (err: any) {
      toastError("something went wrong, please try again later");
    }
  };

  const handleCancelListing = async () => {
    setupWaitingModal();
    let success = false;
    try {
      const result = await BlockchainWrite.callCancelItemForSale(
        library,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId
      );

      if (result?.length) {
        setNftData();
        success = true;
      }
    } catch (error) {
      toast.error("something went wrong, please try again later");
      setupSuccessModal(
        false,
        "Something went wrong. canceling your listing failed. please refresh the page or try later."
      );
    } finally {
      setupSuccessModal(
        success,
        "Congratulations! You have successfully canceled your listing of NFT "
      );
    }
  };

  const handleEditPrice = async (newPrice: any) => {
    let result;
    setupWaitingModal();
    let success = false;
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

      if (result?.length) {
        setNftData();
        success = true;
      }
    } catch (err) {
      toast.error("something went wrong, please try again later");
      setupSuccessModal(
        false,
        "Something went wrong. please refresh the page or try later."
      );
    } finally {
      setupSuccessModal(
        success,
        "Congratulations! You have successfully updated price of your NFT "
      );
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    cancelPrice: {
      content: () => (
        <div className={modalBodyWrapper}>
          <WarningIcon className="mx-auto" />
          <h3 className="fmd:text-18px mt-2 text-base font-semibold leading-6 text-white">
            Are you sure you want to cancel your Listing?
          </h3>
          <p className="mb-2 text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
            Canceling your listing will unpublish this sale from market and You
            will be asked to confirm the transaction through your wallet.
          </p>
          <div className={footerBtnContainer}>
            <FinalButton
              title={"Go back"}
              variant="secondary"
              onClick={() => {
                modal.dismissModal();
              }}
              className="w-full rounded-[14px]"
            />
            <FinalButton
              title={"Proceed"}
              onClick={handleCancelListing}
              variant="primary"
              className="w-full rounded-[14px]"
            />
          </div>
        </div>
      ),
      title: "Cancel listing",
      visibility: true,
    },
    bidNft: {
      title: "Edit listing",
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
            <FinalButton
              title={"Go back"}
              variant="secondary"
              onClick={() => {
                modal.dismissModal();
              }}
              className="w-full rounded-[14px]"
            />
            <FinalButton
              title={"Proceed"}
              onClick={() => handleEditPrice(newPrice)}
              variant="primary"
              className="w-full rounded-[14px]"
            />
          </div>
        </div>
      ),
    },
    txInProgress: {
      title: "Transaction in progress",
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
      content: ({ txStatus, msg }: IModalProps) => (
        <div className={modalBodyWrapper}>
          <div className="flex flex-col items-center justify-center">
            {txStatus ? <GreenTick /> : <CircularClose />}
            <h2 className="text-18px font-semibold text-white">
              {txStatus ? (
                <span>
                  {msg.includes("updated")
                    ? "Listing updated successfully"
                    : msg.includes("canceled")
                    ? "Listing successfully canceled"
                    : "Listing NFT successfully"}
                </span>
              ) : (
                "Failed!"
              )}
            </h2>
          </div>

          {txStatus && (
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              {msg} <span className="word-break text-white">{data?.name}</span>{" "}
              on
              <b> Centher </b> NFT platform.
            </p>
          )}
          {!txStatus && (
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              {msg ?? "Transaction Failed."}
            </p>
          )}
          <div className={footerBtnContainer}>
            <FinalButton
              title={"View item"}
              variant="primary"
              onClick={() => {
                modal.dismissModal();
              }}
              className="w-full rounded-[14px] hover:scale-95"
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
        <FinalButton
          title={"Cancel Listing"}
          variant="secondary"
          onClick={setupCancelItemPriceModal}
          className="w-full rounded-[14px] hover:scale-95"
        />
        <FinalButton
          title={"Edit"}
          onClick={() => {
            setupBidNftModal();
          }}
          variant="primary"
          className="w-full hover:scale-95"
        />
      </div>

      {ModalModel.visibility && (
        <CustomModal
          onClose={() => {
            modal.dismissModal();
          }}
          title={ModalModel.title as string}
          disable={ModalModel.title === "Transaction in progress" ? "yes" : ""}
        >
          {ModalModel.content}
        </CustomModal>
      )}
      {migrateModal.visibility && (
        <ModalMigrate
          onClose={() => {
            setMigrateModal({ ...migrateModal, visibility: false });
          }}
          title={migrateModal.title as string}
        >
          {migrateModal.content}
        </ModalMigrate>
      )}
    </div>
  );
};

// styling
const modalBodyWrapper = `
  flex flex-col gap-2 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 text-center
`;
const footerBtnContainer = `
flex items-center gap-4
`;

const nftDescriptionContainer = `
w-full flex flex-col gap-5
`;

const greyBoxContainer = `
bg-background-shade-3 rounded-10px flex flex-col gap-2 p-3 fsm:p-6 
`;
const greyTxt = `
text-14px font-normal text-gray-shade-7
`;
const desTitle = `
text-14px font-semibold text-white
`;
const BnBNum = `
text-16px font-bold text-white
`;
const ImgStyling = `
w-[64px] h-[64px]  rounded-2xl object-contain mx-auto
`;
