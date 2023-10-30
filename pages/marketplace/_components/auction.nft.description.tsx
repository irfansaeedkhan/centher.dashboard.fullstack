import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Countdown from "react-countdown";
import Button from "@/components/button";
import { IModalProps } from "@/components/modal/standard.modal";
import { BNBIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import {
  formatAddress,
  formatBNB2USD,
  formatEther2Number,
} from "@/utils/format.address";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import MessageModal from "@/utils/modal/message-modal";
import TrxInProgressModal from "@/utils/modal/trx-modal";
import SuccessMessageModal from "@/utils/modal/success-modal";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
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
    modal.dismissModal();
    modal.createModal(ModalType.proceedFuncModal);
  };

  const SuccessFunc = (txStatus: boolean, msg: string) => {
    try {
      modal.dismissModal();
      modal.createModal(ModalType.successFuncModal, { txStatus, msg });
    } catch (err: any) {
      !txStatus && toastError("Something went wrong");
    }
  };

  const handleEndAuction = async () => {
    ProceedFunc();
    let response = { success: false, message: "" };
    try {
      const result = await BlockchainWrite.callEndAuction(
        getSigner()!,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId
      );
      if (result?.length) {
        setNftData();
        response.success = true;
        response.message =
          "Congratulations! You have successfully ended the auction of ";
      } else throw new Error();
    } catch (err: any) {
      response.success = false;
      response.message = "something went wrong";
    } finally {
      SuccessFunc(response.success, response.message);
    }
  };

  const handleCancelAuction = async () => {
    ProceedFunc();
    let response = { success: false, message: "" };
    try {
      const result = await BlockchainWrite.callCancelAuction(
        getSigner()!,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId
      );

      if (!!result) {
        setNftData();
        response.success = true;
        response.message =
          "Congratulations! You have successfully canceled auction of ";
      }
    } catch (error) {
      response.success = false;
      response.message = "Failed to cancel auction";
    } finally {
      SuccessFunc(response.success, response.message);
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    cancelAuctionFuncModal: {
      title: "Cancel Auction",
      visibility: true,
      content: () => (
        <MessageModal
          heading="Are you sure you want to cancel your Auction?"
          subHeading="Canceling your auction will unpublish this sale from market and You
        will be asked to confirm the transaction through your wallet."
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={handleCancelAuction}
        />
      ),
    },
    proceedFuncModal: {
      title: "Transaction in progress",
      visibility: true,
      content: () => <TrxInProgressModal />,
    },
    successFuncModal: {
      title: "Checkout",
      visibility: true,
      // give them types

      content: ({ txStatus, msg }: IModalProps) => (
        <SuccessMessageModal
          heading={
            <h2 className="mt-2 text-base font-semibold text-white f2xl:text-lg">
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
          }
          subHeading={
            <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
              {msg}
              <span className="word-break text-white">{data?.name} </span> NFT
              on <b> Centher </b> platform.
            </p>
          }
          txStatus={txStatus}
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={() => {
            modal.dismissModal();
          }}
        />
      ),
    },
    endAuctionFuncModal: {
      title: "Announce Winner",
      visibility: true,
      content: () => (
        <MessageModal
          heading="Click Proceed to announce winner of your NFT!"
          subHeading={`Your NFT will go to{" "}
          ${formatAddress(data?.auctionInfo.highestBidAddress)} and you will
          receive ${formatEther2Number(data?.auctionInfo.highestBidPrice)} BNB`}
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={handleEndAuction}
        />
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

  useEffect(() => {
    if (ModalModel.visibility) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [ModalModel.visibility]);

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
