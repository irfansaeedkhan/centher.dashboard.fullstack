import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Countdown from "react-countdown";
import Button from "@/components/button";
import { IModalProps } from "@/components/modal/standard.modal";
import {
  BNBIcon,
  WarningIcon,
  LoaderIcon,
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
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { useWallet } from "@/web3/hooks/use.wallet";
import AuctionCountdownRenderer from "./auction-countdown.renderer";

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
  const { getSigner } = useWallet();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
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
    }
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
        getSigner()!,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId
      );
      if (result?.length) {
        setNftData();
        SuccessFunc(
          true,
          "Congratulations! You have successfully ended the auction of "
        );
      } else throw new Error();
    } catch (err: any) {
      SuccessFunc(false, "Something went wrong");
    }
  };

  const handleCancelAuction = async () => {
    try {
      ProceedFunc();
      const result = await BlockchainWrite.callCancelAuction(
        getSigner()!,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId
      );

      if (result?.length) {
        setNftData();
        SuccessFunc(
          true,
          "Congratulations! You have successfully canceled auction of "
        );
      }
    } catch (error) {
      SuccessFunc(false, "Failed to cancel auction");
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    cancelAuctionFuncModal: {
      title: "Cancel Auction",
      visibility: true,
      content: () => (
        <div className={modalBodyWrapper}>
          <WarningIcon className="mx-auto" />
          <h3 className="mt-2 text-base font-semibold leading-6 text-white fmd:text-lg">
            Are you sure you want to cancel your Auction?
          </h3>
          <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
            Canceling your auction will unpublish this sale from market and You
            will be asked to confirm the transaction through your wallet.
          </p>
          <div className={footerBtnContainer}>
            <Button
              title={"Go back"}
              variant="secondary"
              onClick={() => {
                modal.dismissModal();
              }}
              className="w-full rounded-[14px]"
            />
            <Button
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
          <h3 className="mt-2 text-base font-semibold leading-6 text-white fmd:text-lg">
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
            <h2 className="text-base font-semibold text-white f2xl:text-lg">
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
            <Button
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
          <h3 className="mt-2 text-base font-semibold leading-6 text-white fmd:text-lg">
            Click Proceed to announce winner of your NFT!
          </h3>
          <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
            Your NFT will go to{" "}
            {formatAddress(data?.auctionInfo.highestBidAddress)} and you will
            receive {formatEther2Number(data?.auctionInfo.highestBidPrice)} BNB
          </p>
          <div className={footerBtnContainer}>
            <Button
              title={"Go back"}
              variant="secondary"
              onClick={() => {
                modal.dismissModal();
              }}
              className="w-full rounded-[14px]"
            />
            <Button
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
    if (!getSigner()) {
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
        {data && data.auctionInfo.endTime && (
          <Countdown
            date={new Date(data.auctionInfo.endTime * 1000)}
            renderer={AuctionCountdownRenderer}
          />
        )}
      </div>
      <div className="buttonContainer flex items-center gap-4">
        {nowTime < endTime && (
          <Button
            title={"Cancel Auction"}
            variant="primary"
            onClick={cancelAuctionFunc}
            className="w-full rounded-[14px]"
          />
        )}
        {nowTime > endTime && (
          <Button
            title={hasBid ? "Announce Winner" : "End Auction"}
            variant="primary"
            onClick={hasBid ? endAuctionFunc : cancelAuctionFunc}
            className="w-full rounded-[14px]"
            disabled={
              data && nowTime > new Date(data?.auctionInfo.endTime * 1000)
            }
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
const BnBNum = `text-base font-bold text-white`;
const desTitle = `text-sm font-semibold text-white`;
const greyTxt = `text-sm font-normal text-gray-shade-7`;
const footerBtnContainer = `flex items-center gap-4 mt-2`;
const nftDescriptionContainer = `w-full flex flex-col gap-5`;
const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6`;
const modalBodyWrapper = `flex flex-col gap-2 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 text-center`;
