import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";
import toast from "react-hot-toast";
import { IModalProps } from "@/components/modal/standard.modal";
import Button from "@/components/button";
import { BNBIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import {
  formatAddress,
  formatBNB2USD,
  formatEther2Number,
} from "@/utils/format.address";
import TrxInProgressModal from "@/utils/modal/trx-modal";
import MessageModal from "@/utils/modal/message-modal";
import SuccessMessageModal from "@/utils/modal/success-modal";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { useGetBNBBalance } from "@/web3/hooks/use.get.balances";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { useWallet } from "@/web3/hooks/use.wallet";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import AuctionBidModal from "@/pages/marketplace/_components/auction.bid.modal";

import AuctionCountdownRenderer from "@/pages/marketplace/_components/auction-countdown.renderer";
import { ConnectWalletComp } from "@/components/connect.wallet";

interface AuctionNFTBuyerDescriptionProps {
  data: INFTDetailData | undefined;
  setNftData: () => void;
}

enum ModalType {
  proceedFuncModal = "proceedFuncModal",
  successFuncModal = "successFuncModal",
  endAuctionFuncModal = "endAuctionFuncModal",
}

export const AuctionNFTBuyerDescription = ({
  data,
  setNftData,
}: AuctionNFTBuyerDescriptionProps) => {
  const { getSigner, connectedAddress, connectWallet, disconnectWallet } =
    useWallet();
  const bnbBalance = useGetBNBBalance(connectedAddress);
  const bnbPrice = useBNBPrice();
  const price =
    Number(data?.auctionInfo.highestBidPrice) === 0
      ? data?.auctionInfo.startPrice
      : data?.auctionInfo.highestBidPrice;
  const [nowTime, setNowTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [BidModal, setBidModal] = useState(false);
  const [isUserWinner, SetIsUserWinner] = useState(false);
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });

  useEffect(() => {
    if (data) {
      var endtime = new Date(data?.auctionInfo.endTime * 1000);
      var now = new Date();
      setNowTime(now);
      setEndTime(endtime);
      if (
        connectedAddress?.toLowerCase() ==
        data?.auctionInfo.highestBidAddress?.toLowerCase()
      ) {
        SetIsUserWinner(true);
      }
    }
  }, [connectedAddress, data]);

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

  const SuccessFunc = (txStatus: boolean, msg: string) => {
    try {
      modal.dismissModal();
      modal.createModal(ModalType.successFuncModal, { txStatus, msg });
    } catch (err: any) {
      !txStatus && toastError("Something went wrong, please try again later.");
    }
  };

  const ProceedFunc = () => {
    modal.dismissModal();
    modal.createModal(ModalType.proceedFuncModal);
  };

  const onSubmit = async (bidPriceVal: any) => {
    validateProvider();
    let response = { success: false, message: "" };
    if (Number(bidPriceVal) <= formatEther2Number(price)) {
      toast.error(
        `Bid price must be greater than ${formatEther2Number(price)}.`
      );
      return;
    }
    if (bnbBalance < Number(bidPriceVal)) {
      toast.error("Insufficient BNB Balance in your wallet.");
      return;
    }

    setBidModal(false);
    ProceedFunc();
    try {
      const signer = getSigner();
      if (signer && data) {
        const result = await BlockchainWrite.callBidOnAuction(
          signer,
          data.collection,
          data.nftId,
          bidPriceVal
        );

        if (!!result?.length) {
          setNftData();
          response.success = true;
          response.message = "Bid placed successfully on auctioned on ";
        } else throw new Error();
      }
    } catch (error) {
      response.success = false;
      response.message = "Something went wrong, auction failed";
    } finally {
      SuccessFunc(response.success, response.message);
    }
  };

  const handleEndAuction = async () => {
    let response = { success: false, message: "" };
    ProceedFunc();
    try {
      const result = await BlockchainWrite.callEndAuction(
        getSigner()!,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId
      );
      if (result?.length) {
        setNftData();
        response.success = true;
        response.message = "Auction has ended for ";
      } else throw new Error();
    } catch (err: any) {
      response.success = false;
      response.message = "Something went wrong";
    } finally {
      SuccessFunc(response.success, response.message);
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    proceedFuncModal: {
      title: "Transaction in progress",
      visibility: true,
      content: () => <TrxInProgressModal />,
    },
    successFuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: ({ txStatus, msg }: IModalProps) => (
        <SuccessMessageModal
          heading={
            <h2 className="text-18px mt-2 font-semibold text-white">
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
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              {msg} <span className="word-break text-white">{data?.name} </span>{" "}
              NFT on <b> Centher </b>
              platform.
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
      title: "Collect NFT",
      visibility: true,
      content: () => (
        <MessageModal
          heading="Click Proceed to collect your NFT!"
          subHeading={`${formatAddress(data?.owner)} receives
        ${formatEther2Number(data?.auctionInfo.highestBidPrice)} BNB and you
        will receive the NFT`}
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={handleEndAuction}
        />
      ),
    },
  };

  const endAuctionFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.endAuctionFuncModal);
    } catch (err: any) {
      toastError(err);
    }
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
            {`${normalizeValue(formatEther2Number(price))} BNB`}
          </h5>
          <h6 className={greyTxt}> =${formatBNB2USD(price, bnbPrice)}</h6>
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
      {!getSigner() ? (
        <ConnectWalletComp
          connectWallet={connectWallet}
          connectedAddress={connectedAddress}
          disconnectWallet={disconnectWallet}
          className="w-full rounded-[14px]"
        />
      ) : (
        <div className="buttonContainer flex items-center">
          {nowTime < endTime && (
            <Button
              title={"Place bid"}
              variant={"primary"}
              className="w-full rounded-[14px]"
              onClick={() => {
                if (!getSigner) {
                  toast.error("Connect your wallet");
                  return;
                }
                if (getSigner()) {
                  setBidModal(true);
                }
              }}
            />
          )}
          {nowTime > endTime && isUserWinner && (
            <Button
              title={"Claim NFT"}
              variant={"primary"}
              className="w-full rounded-[14px]"
              onClick={endAuctionFunc}
            />
          )}
          {nowTime > endTime && !isUserWinner && (
            <div className={infoBox}>
              <p className={desTitle}>
                This NFT no longer available for bidding
              </p>
            </div>
          )}
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

      {BidModal && (
        <AuctionBidModal
          onSubmit={onSubmit}
          onClose={() => {
            setBidModal(false);
          }}
        />
      )}
    </div>
  );
};

// styling
const BnBNum = `text-base font-bold text-white`;
const desTitle = `text-sm font-semibold text-white`;
const footerBtnContainer = `flex items-center gap-4`;
const greyTxt = `text-sm font-normal text-gray-shade-7`;
const nftDescriptionContainer = `w-full flex flex-col gap-5`;
const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6`;
const modalBodyWrapper1 = `flex flex-col gap-4 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 items-center`;
const infoBox = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6 items-center w-full`;
