import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";
import toast from "react-hot-toast";
import { IModalProps } from "@/components/modal/standard.modal";
import Button from "@/components/button";
import {
  BNBIcon,
  LoaderIcon,
  WarningIcon,
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
import { useGetBNBBalance } from "@/web3/hooks/use.get.balances";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import useUser from "@/hooks/use.user";
import { useWallet } from "@/web3/hooks/use.wallet";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import AuctionBidModal from "./auction.bid.modal";
import ConnectWalletModal from "./connect-wallet-modal";
import AuctionCountdownRenderer from "./auction-countdown.renderer";

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
  const { user: loggedInUser } = useUser();
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
  const [connectWalletModal, setConnectWalletModal] = useState(false);
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

  const SuccessFunc = (txStatus: boolean, msg: string) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.successFuncModal, { txStatus, msg });
    } catch (err: any) {
      toastError("Something went wrong, please try again later.");
    }
  };

  const ProceedFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.proceedFuncModal);
    } catch (err: any) {
      toastError("Something went wrong, please try again later.");
    }
  };

  const onSubmit = async (bidPriceVal: any) => {
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
        if (result?.length) {
          setNftData();
          SuccessFunc(true, "Bid placed successfully on auctioned on");
        } else throw new Error();
      }
    } catch (error) {
      SuccessFunc(false, "Something went wrong, auction failed");
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
        SuccessFunc(true, "Auction has ended for ");
      } else throw new Error();
    } catch (err: any) {
      SuccessFunc(false, "Something went wrong ");
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    proceedFuncModal: {
      title: "Transaction in progress",
      visibility: true,
      content: () => (
        <div className={modalBodyWrapper1}>
          <LoaderIcon className="mx-auto animate-spin" />
          <h3 className="text-base font-semibold leading-6 text-white f2xl:text-lg">
            Transaction in progress
          </h3>
          <p className="text-sm font-normal leading-6 text-gray-shade-2">
            Your transaction is in progress, Please wait.
          </p>
        </div>
      ),
    },
    successFuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: ({ txStatus, msg }: IModalProps) => (
        <div className={modalBodyWrapper1}>
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
            <p className="text-sm font-normal leading-6 text-gray-shade-2">
              {msg} <span className="word-break text-white">{data?.name} </span>{" "}
              NFT on <b> Centher </b>
              platform.
            </p>
          )}
          {!txStatus && (
            <p className="text-sm font-normal leading-6 text-gray-shade-2">
              {msg ?? "Transaction Failed."}
            </p>
          )}
          <Button
            title={"View item"}
            variant="primary"
            onClick={() => {
              modal.dismissModal();
            }}
            className="w-full rounded-[14px]"
          />
        </div>
      ),
    },
    endAuctionFuncModal: {
      title: "Collect NFT",
      visibility: true,
      content: () => (
        <div className={modalBodyWrapper1}>
          <WarningIcon className="mx-auto" />
          <h3 className="text-base font-semibold leading-6 text-white f2xl:text-lg">
            Click Proceed to collect your NFT!
          </h3>
          <p className="text-sm font-normal leading-6 text-gray-shade-2">
            {formatAddress(data?.owner)} receives
            {formatEther2Number(data?.auctionInfo.highestBidPrice)} BNB and you
            will receive the NFT
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
    if (!getSigner) {
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
        <Button
          title={"Connect Wallet"}
          variant="primary"
          onClick={() => {
            setConnectWalletModal(true);
          }}
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

      {connectWalletModal && (
        <ConnectWalletModal
          connectWallet={connectWallet}
          deactivate={disconnectWallet}
          loggedInUser={loggedInUser}
          setConnectWalletModal={setConnectWalletModal}
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
