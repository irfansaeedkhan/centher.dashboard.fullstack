// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import clsx from "clsx";

// App imports
import Button from "@/components/button";
import NewButton from "@/components/button/new.button";
import { CustomModal } from "@/components/modal/custom.modal";
import { BNBIcon, WarningIcon, LoaderIcon } from "@/assets/svgs";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { useGetApprovedForAll } from "@/web3/hooks/use.contracts.functions";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { BlockchainWrite } from "@/web3/blockchain";

import ChangePriceListModal from "./change.price.list.modal";
import CreateNFTAuctionModal from "./create.nft.auction.modal";
import SendNFTModal from "./send.nft.modal";

interface NonNFTDescriptionProps {
  data: INFTDetailData | undefined;
  setNftData: () => void;
}

enum ModalType {
  auctionModal = "auctionModal",
  saleWithAuction = "saleWithAuction",
  proceedFuncModal = "proceedFuncModal",
  successFuncModal = "successFuncModal",
  listingFuncModal = "listingFuncModal",
  saleWithListingModal = "saleWithListingModal",
  sendFuncModal = "sendFuncModal",
}

export const NonNFTDescription = ({
  data,
  setNftData,
}: NonNFTDescriptionProps) => {
  const { library, account } = useWeb3React();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const bnbPrice = useBNBPrice();
  const isApproved = useGetApprovedForAll(account, data?.collection);

  const handleListNFT = async (bidPrice: any) => {
    try {
      validateProvider();
      modal.dismissModal();
      saleWithListing(bidPrice);
    } catch (err: any) {
      toastError(err);
    }
  };
  const saleWithListing = (listingPrice: any) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.saleWithListingModal, listingPrice);
    } catch (err: any) {
      toastError(err);
    }
  };
  const listingFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.listingFuncModal);
    } catch (err: any) {
      toastError(err);
    }
  };
  const sendFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.sendFuncModal);
    } catch (err: any) {
      toastError(err);
    }
  };

  const handleListing = async (listingPrice: any) => {
    ProceedFunc();
    if (library && data) {
      try {
        if (!isApproved) {
          try {
            const approveResult =
              await BlockchainWrite.callApproveNFTToMarketplace(
                library,
                data.collection
              );

            if (!approveResult?.length) {
              throw new Error("something went wrong");
            }
          } catch (error) {
            toastError(error);
          }
        }

        const result = await BlockchainWrite.callListItemForSale(
          library,
          data.collection,
          data.nftId,
          listingPrice
        );
        if (result?.length) {
          setNftData();
        }
        SuccessFunc(!!result);
      } catch (error) {
        toastError(error);
        SuccessFunc(false);
      }
    } else {
      SuccessFunc(false);
    }
  };
  const handleAuction = async (data: any) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.saleWithAuction, data);
    } catch (err: any) {
      toastError(err);
    }
  };
  const setupAuctionModal = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.auctionModal);
    } catch (err: any) {
      toastError(err);
    }
  };
  const handleAuctionProc = async (auctionPrice: any, auctionDate: any) => {
    const endTime = Math.floor((Date.parse(auctionDate) - Date.now()) / 1000);
    validateProvider();
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
  const handleSendNFT = async (input: {
    ReceiverAddress: string;
    LockEndTime: number;
  }) => {
    ProceedFunc();
    if (library && data) {
      try {
        if (!isApproved) {
          try {
            const approveResult =
              await BlockchainWrite.callApproveNFTToMarketplace(
                library,
                data.collection
              );

            if (!approveResult?.length) {
              throw new Error("something went wrong");
            }
          } catch (error) {
            toastError(error);
          }
        }

        const result = await BlockchainWrite.transferNftWithLock(
          library,
          data.collection,
          data.nftId,
          input.ReceiverAddress,
          input.LockEndTime
        );
        if (result?.length) {
          setNftData();
        }
        SuccessFunc(!!result);
      } catch (error) {
        toastError(error);
        SuccessFunc(false);
      }
    } else {
      SuccessFunc(false);
    }
  };
  const ProceedFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.proceedFuncModal);
    } catch (err: any) {
      toastError(err);
    }
  };
  const SuccessFunc = (txStatus: boolean) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.successFuncModal, txStatus);
    } catch (err: any) {
      toastError(err);
    }
  };
  const modalTemplateCollection: TemplateCollection = {
    auctionModal: {
      title: "Auction",
      visibility: true,
      content: () => <CreateNFTAuctionModal handleAuction={handleAuction} />,
    },
    saleWithAuction: {
      title: "Cancel listing",
      visibility: true,
      content: ({ StartingNFTPrice, AuctionEndTime }: any) => (
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
                modal.dismissModal();
              }}
            />
            <Button
              title={"Proceed"}
              onClick={() =>
                handleAuctionProc(StartingNFTPrice, AuctionEndTime)
              }
              variant="v1"
              className="py-4"
            />
          </div>
        </div>
      ),
    },
    proceedFuncModal: {
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
    successFuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: (txStatus: any) => (
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
              <b>Centher </b>
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
                modal.dismissModal();
              }}
            />
          </div>
        </div>
      ),
    },
    listingFuncModal: {
      title: "Listing Item",
      visibility: true,
      content: () => <ChangePriceListModal handleListNFT={handleListNFT} />,
    },
    sendFuncModal: {
      title: "Send NFT",
      visibility: true,
      content: () => <SendNFTModal handleSend={handleSendNFT} />,
    },
    saleWithListingModal: {
      title: "Edit listing",
      visibility: true,
      content: (listingPrice: any) => (
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
                modal.dismissModal();
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
      {data!.unlock < +new Date() / 1000 ? (
        <div className="buttonContainer flex items-center gap-4">
          <NewButton
            title={"Auction"}
            variant="v1"
            onClick={() => {
              setupAuctionModal();
            }}
          />
          <NewButton title={"List"} onClick={listingFunc} variant="v4" />
          <NewButton title={"Send"} onClick={sendFunc} variant="v4" />
        </div>
      ) : (
        <div>This nft is locked</div>
      )}

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
const modalBodyWrapper = `flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center`;
const footerBtnContainer = `flex items-center gap-4`;
const nftDescriptionContainer = `w-full flex flex-col gap-5`;
const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6`;
const greyTxt = `text-14px font-normal text-gray-shade-7`;
const desTitle = `text-14px font-semibold text-white`;
const BnBNum = `text-16px font-bold text-white`;
const ImgStyling = `w-[64px] h-[64px]  rounded-2xl object-contain mx-auto`;
