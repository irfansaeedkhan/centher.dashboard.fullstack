// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import clsx from "clsx";

// App imports
import FinalButton from "@/components/button/final.button";
import { IModalProps } from "@/components/modal/standard.modal";
import { CustomModal } from "@/components/modal/custom.modal";
import {
  BNBIcon,
  WarningIcon,
  LoaderIcon,
  AuctionIcon,
  GreenTick,
  CircularClose,
} from "@/assets/svgs";
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
import { TokenBlackList } from "@/web3/blockchain/helpers/blacklist.helper";

interface NonNFTDescriptionProps {
  data: INFTDetailData | undefined;
  setNftData: () => void;
}

enum ModalType {
  auctionModal = "auctionModal",
  saleWithAuction = "saleWithAuction",
  cancelAuction = "cancelAuction",
  proceedFuncModal = "proceedFuncModal",
  listingFuncModal = "listingFuncModal",
  saleWithListingModal = "saleWithListingModal",
  successFuncModal = "successFuncModal",
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
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [nowTime, setNowTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [end, setEnd] = useState(true);
  const [sendNftModal, setSendNftModal] = useState(false);
  const [transferable, setTransferable] = useState(false);
  const bnbPrice = useBNBPrice();
  const isApproved = useGetApprovedForAll(account, data?.collection);

  useEffect(() => {
    if (data) {
      setTransferable(!TokenBlackList.isBlocked(data?.collection, data.nftId));
      var endtime = new Date(data?.unlock * 1000);
      var now = new Date();
      setNowTime(now);
      setEndTime(endtime);

      var updateTime = setInterval(() => {
        var now = new Date().getTime();

        var difference = data.unlock * 1000 - now;

        var newDays = Math.floor(difference / (1000 * 60 * 60 * 24));
        var newHours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var newMinutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        var newSeconds = Math.floor((difference % (1000 * 60)) / 1000);

        setDays(newDays);
        setHours(newHours);
        setMinutes(newMinutes);
        setSeconds(newSeconds);

        if (difference <= 0) {
          clearInterval(updateTime);
          setDays(0);
          setHours(0);
          setMinutes(0);
          setSeconds(0);
          setEnd(true);
        } else {
          setEnd(false);
        }
      });
    }

    return () => {
      clearInterval(updateTime);
    };
  }, [data]);
  const handleListNFT = async (bidPrice: any) => {
    try {
      validateProvider();
      modal.dismissModal();
      saleWithListing(bidPrice);
    } catch (err: any) {
      toastError("Failed to list NFT");
    }
  };
  const saleWithListing = (listingPrice: any) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.saleWithListingModal, listingPrice);
    } catch (err: any) {
      toastError("Failed to sale with listing");
    }
  };
  const listingFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.listingFuncModal);
    } catch (err: any) {
      toastError("Failed to list NFT");
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
            toastError("something went wrong");
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
        SuccessFunc(!!result, "Congratulations! You have successfully listed ");
      } catch (error) {
        toastError("something went wrong with listing");
        SuccessFunc(false, "something went wrong with listing");
      }
    } else {
      SuccessFunc(false, "something went wrong with listing");
    }
  };
  const handleAuction = async (data: any) => {
    try {
      // validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.saleWithAuction, data);
    } catch (err: any) {
      toastError("failed to auction");
    }
  };
  const setupAuctionModal = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.auctionModal);
    } catch (err: any) {
      toastError("failed to auction");
    }
  };
  const handleAuctionProc = async (auctionPrice: any, auctionDate: any) => {
    const endTime = Math.floor(auctionDate * 24 * 60 * 60);
    validateProvider();
    ProceedFunc();

    let success = false;
    try {
      if (library && data) {
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
      SuccessFunc(false, "something went wrong with auction");
    } finally {
      SuccessFunc(success, "Congratulations! You have successfully auctioned ");
    }
  };
  const handleSendNFT = async (input: {
    ReceiverAddress: string;
    LockEndTime: number;
  }) => {
    let success = false;
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
            toastError("failed to send nft");
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
        SuccessFunc(!!result, "Congratulations! You have successfully sent ");
      } catch (error) {
        toastError("failed to send nft");
        SuccessFunc(false, "failed to send nft");
      }
    } else {
      SuccessFunc(false, "failed to send nft");
    }
  };

  const ProceedFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.proceedFuncModal);
    } catch (err: any) {
      toastError("Something went wrong");
    }
  };

  const SuccessFunc = (txStatus: boolean, msg: string) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.successFuncModal, { txStatus, msg });
    } catch (err: any) {
      toastError("Something went wrong");
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    auctionModal: {
      title: "Auction",
      visibility: true,
      content: () => <CreateNFTAuctionModal handleAuction={handleAuction} />,
    },
    saleWithAuction: {
      title: "Auction",
      visibility: true,
      content: ({ StartingNFTPrice, AuctionEndTime }: any) => (
        <div className={modalBodyWrapper}>
          <WarningIcon className="mx-auto" />
          <h3 className="fmd:text-18px mt-2 text-base font-semibold leading-6 text-white">
            Are you sure you want to setup auction?
          </h3>
          <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
            It will be available for auction on market and You will be asked to
            confirm the transaction through your wallet.
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
              onClick={() =>
                handleAuctionProc(StartingNFTPrice, AuctionEndTime)
              }
              variant="primary"
              className="w-full"
            />
          </div>
        </div>
      ),
    },
    cancelAuction: {
      title: "Cancel listing",
      visibility: true,
      content: ({ StartingNFTPrice, AuctionEndTime }: any) => (
        <div className={modalBodyWrapper}>
          <WarningIcon className="mx-auto" />
          <h3 className="fmd:text-18px mt-2 text-base font-semibold leading-6 text-white">
            Are you sure you want to cancel your Listing?
          </h3>
          <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
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
              onClick={() =>
                handleAuctionProc(StartingNFTPrice, AuctionEndTime)
              }
              variant="primary"
              className="w-full"
            />
          </div>
        </div>
      ),
    },
    proceedFuncModal: {
      title: "Transaction in progress",
      visibility: true,
      content: () => (
        <div className={modalBodyWrapper}>
          <LoaderIcon className="mx-auto animate-spin" />
          <h3 className="fmd:text-18px mt-2 text-base font-semibold leading-6 text-white">
            Transaction in progress
          </h3>
          <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
            Your transaction is in progress, Please wait.
          </p>
        </div>
      ),
    },
    successFuncModal: {
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
            <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
              {msg} <span className="word-break text-white">{data?.name}</span>{" "}
              NFT on <b>Centher </b>
              platform.
            </p>
          )}
          {!txStatus && (
            <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
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
              className="w-full"
            />
          </div>
        </div>
      ),
    },
    listingFuncModal: {
      title: "List for sale",
      visibility: true,
      content: () => (
        <ChangePriceListModal
          handleListNFT={handleListNFT}
          data={data}
          handleAuction={handleAuction}
        />
      ),
    },

    saleWithListingModal: {
      title: "List for sale",
      visibility: true,
      content: (listingPrice: any) => (
        <div className={modalBodyWrapper}>
          <WarningIcon className="mx-auto" />
          <h3 className="fmd:text-18px mt-2 text-base font-semibold leading-6 text-white">
            Are you sure you want to List your NFT to sell?
          </h3>
          <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm ">
            {`Listing Price will be  ${normalizeValue(
              Number(listingPrice)
            )} BNB.`}
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
              onClick={() => handleListing(listingPrice)}
              variant="primary"
              className="w-full"
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
          {/* <NewButton
            title={"Auction"}
            variant="v1"
            onClick={() => {
              setupAuctionModal();
            }}
          /> */}
          <FinalButton
            title="Sell"
            onClick={listingFunc}
            variant="primary"
            className="h-11 w-full"
            borderRounded="14px"
          />
          {transferable && (
            <FinalButton
              title={"Send"}
              onClick={() => setSendNftModal(true)}
              variant="secondary"
              className="h-11 w-full rounded-[14px]"
            />
          )}
        </div>
      ) : (
        <div className={greyBoxContainer}>
          <h4 className={desTitle}>Description</h4>
          <p className={`${greyTxt} leading-6`}>{data?.description}</p>

          <div className="auctionTimerBox relative flex flex-row gap-3 overflow-hidden rounded-10px border-2 border-gray-shade-3 [@media(max-width:600px)]:!flex-col">
            <div className="iconBox flex min-w-[170px] flex-col items-center gap-3 bg-background-shade-2 p-6 text-center">
              <AuctionIcon />
              <h4 className="text-14px font-normal text-white">
                This NFT will unlock in
              </h4>
            </div>
            <div className="flex w-full justify-center p-4">
              <div className="timerBox flex items-center gap-5">
                <div className="dateBix flex flex-col items-center gap-2">
                  <h5 className="text-20px font-semibold text-white">{days}</h5>
                  <h6 className="text-12px font-normal text-gray-shade-7">
                    Days
                  </h6>
                </div>
                <div className="dateBix flex flex-col items-center gap-2">
                  <h5 className="text-20px font-semibold text-white">
                    {hours}
                  </h5>
                  <h6 className="text-12px font-normal text-gray-shade-7">
                    Hours
                  </h6>
                </div>
                <div className="dateBix flex flex-col items-center gap-2">
                  <h5 className="text-20px font-semibold text-white">
                    {minutes}
                  </h5>
                  <h6 className="text-12px font-normal text-gray-shade-7">
                    Minutes
                  </h6>
                </div>
                <div className="dateBix flex flex-col items-center gap-2">
                  <h5 className="text-20px font-semibold text-white">
                    {seconds}
                  </h5>
                  <h6 className="text-12px font-normal text-gray-shade-7">
                    Seconds
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {ModalModel.visibility && (
        <CustomModal
          onClose={() => {
            modal.dismissModal();
          }}
          title={ModalModel.title as any}
          disable={ModalModel.title === "Transaction in progress" ? "yes" : ""}
        >
          {ModalModel.content}
        </CustomModal>
      )}
      {sendNftModal && (
        <SendNFTModal
          handleSend={handleSendNFT}
          onClose={() => {
            setSendNftModal(false);
          }}
        />
      )}
    </div>
  );
};
// styling
const modalBodyWrapper = `flex flex-col gap-2 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 text-center`;
const footerBtnContainer = `flex items-center gap-4 mt-2`;
const nftDescriptionContainer = `w-full flex flex-col gap-5`;
const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6`;
const greyTxt = `text-14px font-normal text-gray-shade-7`;
const desTitle = `text-14px font-semibold text-white`;
const BnBNum = `text-16px font-bold text-white`;
