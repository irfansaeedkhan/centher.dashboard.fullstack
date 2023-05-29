// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";

// App imports
import FinalButton from "@/components/button/final.button";
import { IModalProps } from "@/components/modal/standard.modal";
import {
  BNBIcon,
  WarningIcon,
  LoaderIcon,
  HammerIconBG,
  GreenTick,
  CircularClose,
} from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import {
  formatAddress,
  formatBNB2USD,
  formatEther2Number,
} from "@/utils/format.address";
import toast from "react-hot-toast";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";

interface AuctionNftDescriptionProps {
  data: INFTDetailData | undefined;
  setNftData: () => void;
}

enum ModalType {
  cancelAuctionFuncModal = "cancelAuctionFuncModal",
  proceedFuncModal = "proceedFuncModal",
  successFuncModal = "successFuncModal",
  endAuctionFuncModal = "endAuctionFuncModal",
}

export const AuctionNftDescription = ({
  data,
  setNftData,
}: AuctionNftDescriptionProps) => {
  const { library } = useWeb3React();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const [end, setEnd] = useState(true);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [nowTime, setNowTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [hasBid, sethasBid] = useState(false);

  const bnbPrice = useBNBPrice();

  useEffect(() => {
    if (data) {
      var hasBid = data.auctionInfo.bids?.length > 0;
      var endtime = new Date(data?.auctionInfo.endTime * 1000);
      var now = new Date();
      setNowTime(now);
      setEndTime(endtime);
      sethasBid(hasBid);

      var updateTime = setInterval(() => {
        var now = new Date().getTime();

        var difference = data.auctionInfo.endTime * 1000 - now;

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
          setNftData();
        } else {
          setEnd(false);
        }
      }, 1000);
    }

    return () => {
      clearInterval(updateTime);
    };
  }, [data, setNftData]);

  const cancelAuctionFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.cancelAuctionFuncModal);
    } catch (err: any) {
      toastError("something went wrong");
    }
  };
  const endAuctionFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.endAuctionFuncModal);
    } catch (err: any) {
      toastError("something went wrong");
    }
  };
  const ProceedFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.proceedFuncModal);
    } catch (err: any) {
      toastError("something went wrong");
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
  const handleEndAuction = async () => {
    ProceedFunc();
    try {
      const result = await BlockchainWrite.callEndAuction(
        library,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId
      );
      SuccessFunc(
        !!result,
        "Congratulations! You have successfully ended the auction of "
      );
      setNftData();
    } catch (err: any) {
      toastError("something went wrong");
    }
  };
  const handleCancelAuction = async () => {
    let success = false;
    try {
      ProceedFunc();
      const result = await BlockchainWrite.callCancelAuction(
        library,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId
      );

      if (result?.length) {
        setNftData();
        success = true;
      }
    } catch (error) {
      toastError("something went wrong");
      SuccessFunc(false, "Failed to cancel auction");
    } finally {
      SuccessFunc(
        success,
        "Congratulations! You have successfully canceled auction of "
      );
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    cancelAuctionFuncModal: {
      title: "Cancel Auction",
      visibility: true,
      content: () => (
        <div className={modalBodyWrapper}>
          <WarningIcon className="mx-auto" />
          <h3 className="fmd:text-18px mt-2 text-base font-semibold leading-6 text-white">
            Are you sure you want to cancel your Auction?
          </h3>
          <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
            Canceling your auction will unpublish this sale from market and You
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
              variant="primary"
              onClick={handleCancelAuction}
              className="w-full rounded-[14px]"
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
      title: "Checkout",
      visibility: true,
      // give them types

      content: ({ txStatus, msg }: IModalProps) => (
        <div className={modalBodyWrapper}>
          <div className="flex flex-col items-center justify-center">
            {txStatus ? <GreenTick /> : <CircularClose />}
            <h2 className="text-18px font-semibold text-white">
              {txStatus ? (
                <span>
                  {msg.includes("updated")
                    ? "Auction successfully updated"
                    : msg.includes("canceled")
                    ? "Auction successfully canceled"
                    : "Auction successfully created"}
                </span>
              ) : (
                "Failed!"
              )}
            </h2>
          </div>
          {txStatus && (
            <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
              {msg}
              <span className="word-break text-white">{data?.name} </span> NFT
              on <b> Centher </b> platform.
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
              className="w-full rounded-[14px]"
            />
            {/* </Link> */}
          </div>
        </div>
      ),
    },
    endAuctionFuncModal: {
      title: "Announce Winner",
      visibility: true,
      content: () => (
        <div className={modalBodyWrapper}>
          <WarningIcon className="mx-auto" />
          <h3 className="fmd:text-18px mt-2 text-base font-semibold leading-6 text-white">
            Click Proceed to announce winner of your NFT!
          </h3>
          <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
            Your NFT will go to{" "}
            {formatAddress(data?.auctionInfo.highestBidAddress)} and you will
            receive {formatEther2Number(data?.auctionInfo.highestBidPrice)} BNB
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
              onClick={handleEndAuction}
              variant="primary"
              className="w-full rounded-[14px]"
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
        <h4 className={greyTxt}>Minimum Bid</h4>
        <div className="flex items-center  gap-3">
          <BNBIcon className="[&>*]:fill-[#E35259]" />
          <h5 className={BnBNum}>
            {`${normalizeValue(
              formatEther2Number(data?.auctionInfo.highestBidPrice)
            )} BNB`}
          </h5>
          <h6 className={greyTxt}>
            {" "}
            =${formatBNB2USD(data?.auctionInfo.highestBidPrice, bnbPrice)}
          </h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p className={`${greyTxt} word-break leading-6`}>{data?.description}</p>
        <div className="w-full overflow-hidden rounded-xl border border-gray-shade-3 bg-[url('/images/backcolouredshadow.png')] bg-[length:85%] bg-center bg-no-repeat ">
          <div className="text-14px flex h-full w-full flex-col items-center justify-evenly gap-5 bg-black bg-opacity-20 bg-contain px-4 py-2 text-white backdrop-blur-[30px] fsm:m-0 fsm:flex-row fmd:mb-0 fmd:text-left">
            <div className="flex flex-col items-center gap-3 text-center  fsm:max-w-[138px]">
              <HammerIconBG className="scale-150" />
              <h4 className="text-14px font-normal text-white">
                This Auction will end in
              </h4>
            </div>
            <div className="flex h-full w-full max-w-[280px] items-center justify-evenly gap-2 fsm:justify-end fsm:gap-8">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[20px] font-semibold text-white">
                  {days}
                </span>
                <span className="text-[12px] font-medium text-[#CFD1DD]">
                  DAYS
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[20px] font-semibold text-white">
                  {hours}
                </span>
                <span className="text-[12px] font-medium text-[#CFD1DD]">
                  HOURS
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[20px] font-semibold text-white">
                  {minutes}
                </span>
                <span className="text-[12px] font-medium text-[#CFD1DD]">
                  MIN
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[20px] font-semibold text-white">
                  {seconds}
                </span>
                <span className="text-[12px] font-medium text-[#CFD1DD]">
                  Seconds
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="buttonContainer flex items-center gap-4">
        {nowTime < endTime && (
          <FinalButton
            title={"Cancel Auction"}
            variant="primary"
            onClick={cancelAuctionFunc}
            className="w-full rounded-[14px]"
          />
        )}
        {nowTime > endTime && (
          <FinalButton
            title={hasBid ? "Announce Winner" : "End Auction"}
            variant="primary"
            onClick={hasBid ? endAuctionFunc : cancelAuctionFunc}
            className="w-full rounded-[14px]"
            disabled={!end}
          />
        )}
      </div>
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
const ImgStyling = `w-[64px] h-[64px]  rounded-2xl object-contain mx-auto`;
