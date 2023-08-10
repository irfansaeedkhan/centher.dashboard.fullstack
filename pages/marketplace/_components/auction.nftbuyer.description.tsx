import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useWeb3React } from "@web3-react/core";
import { FiArrowRight } from "react-icons/fi";
import { IModalProps } from "@/components/modal/standard.modal";
import FinalButton from "@/components/button/final.button";
import {
  BNBIcon,
  LoaderIcon,
  HammerIconBG,
  WarningIcon,
  MetamaskIcon2,
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
import { CustomNewModal } from "@/components/modal/custom.new.modal";
import useUser from "@/hooks/use.user";
import { BlockchainWrite } from "@/web3/blockchain";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import AuctionBidModal from "./auction.bid.modal";

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
  const { connectWallet } = useConnectWallet();
  const { deactivate } = useWeb3React();
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [BidModal, setBidModal] = useState(false);
  const [isUserWinner, SetIsUserWinner] = useState(false);
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const { library, account } = useWeb3React();

  const bnbBalance = useGetBNBBalance(account);

  const price =
    Number(data?.auctionInfo.highestBidPrice) === 0
      ? data?.auctionInfo.startPrice
      : data?.auctionInfo.highestBidPrice;

  const [end, setEnd] = useState(true);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [nowTime, setNowTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const bnbPrice = useBNBPrice();

  useEffect(() => {
    if (data) {
      var endtime = new Date(data?.auctionInfo.endTime * 1000);
      var now = new Date();
      setNowTime(now);
      setEndTime(endtime);

      if (
        account?.toLowerCase() ==
        data?.auctionInfo.highestBidAddress?.toLowerCase()
      ) {
        SetIsUserWinner(true);
      }

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
      });
    }

    return () => {
      clearInterval(updateTime);
    };
  }, [data]);

  const SuccessFunc = useCallback((txStatus: boolean, msg: string) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.successFuncModal, { txStatus, msg });
    } catch (err: any) {
      toastError("Something went wrong, please try again later.");
    }
  }, []);

  const ProceedFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.proceedFuncModal);
    } catch (err: any) {
      toastError("Something went wrong, please try again later.");
    }
  };
  const onSubmit = useCallback(
    async (bidPriceVal: any) => {
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
        if (library && data) {
          const result = await BlockchainWrite.callBidOnAuction(
            library,
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
    },
    [SuccessFunc, bnbBalance, data, library, price]
  );
  const handleEndAuction = async () => {
    ProceedFunc();
    try {
      const result = await BlockchainWrite.callEndAuction(
        library,
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
      content: ({ txStatus, msg }: IModalProps) => (
        <div className={modalBodyWrapper1}>
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
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              {msg} <span className="word-break text-white">{data?.name} </span>{" "}
              NFT on <b> Centher </b>
              platform.
            </p>
          )}
          {!txStatus && (
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              {msg ?? "Transaction Failed."}
            </p>
          )}
          <FinalButton
            title={"View item"}
            variant="primary"
            onClick={() => {
              modal.dismissModal();
            }}
            className="w-full rounded-[14px] hover:scale-95"
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
          <h3 className="text-18px font-semibold leading-6 text-white">
            Click Proceed to collect your NFT!
          </h3>
          <p className="text-14px font-normal leading-6 text-gray-shade-2">
            {formatAddress(data?.owner)} receives
            {formatEther2Number(data?.auctionInfo.highestBidPrice)} BNB and you
            will receive the NFT
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
            {`${normalizeValue(formatEther2Number(price))} BNB`}
          </h5>
          <h6 className={greyTxt}> =${formatBNB2USD(price, bnbPrice)}</h6>
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
      {!library ? (
        <FinalButton
          title={"Connect Wallet"}
          variant="primary"
          onClick={() => {
            setConnectWalletModal(true);
          }}
          className="w-full rounded-[14px] hover:scale-95"
        />
      ) : (
        <div className="buttonContainer flex items-center">
          {nowTime < endTime && (
            <FinalButton
              title={"Place bid"}
              variant={end ? "primary" : "primary"}
              disabled={end}
              className="w-full rounded-[14px]"
              onClick={() => {
                if (!library) {
                  toast.error("Connect your wallet");
                  return;
                }
                if (library) {
                  setBidModal(true);
                }
              }}
            />
          )}
          {nowTime > endTime && isUserWinner && (
            <FinalButton
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
        <CustomNewModal
          onClose={() => {
            setConnectWalletModal(false);
          }}
          title={"Connect to wallet"}
        >
          <div className="mb-8 flex w-full justify-center px-5 md:px-10">
            <p className="mt-2 w-full max-w-[366px] text-center text-xs text-gray-shade-14">
              Please Connect your wallet to continue, the system support
              following wallet.
            </p>
          </div>
          <div className="flex w-full justify-center px-5 md:px-10">
            <div className="flex w-full max-w-[400px] items-center justify-between gap-10 rounded-xl border border-brand-primary px-5 py-3">
              <div className="flex items-center gap-3 fsm:gap-6">
                <MetamaskIcon2 />
                <h3 className="text-sm font-semibold text-white fmd:text-base">
                  Metamask
                </h3>
              </div>
              <button
                onClick={async () => {
                  if (!loggedInUser) {
                    toast.error("Please login to buy this nft");
                    setConnectWalletModal(false);
                    return;
                  }
                  const _account = await connectWallet();
                  if (
                    loggedInUser._id.toLowerCase() !== _account?.toLowerCase()
                  ) {
                    toast.error("Please connect to correct account");
                    deactivate();
                  }
                  setConnectWalletModal(false);
                }}
              >
                <FiArrowRight className="h-6 w-6 text-brand-primary fsm:h-8 fsm:w-8" />
              </button>
            </div>
          </div>
        </CustomNewModal>
      )}
    </div>
  );
};
// styling
const modalBodyWrapper1 = `flex flex-col gap-4 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 items-center`;
const nftDescriptionContainer = `w-full flex flex-col gap-5`;
const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6`;
const greyTxt = `text-14px font-normal text-gray-shade-7`;
const desTitle = `text-14px font-semibold text-white`;
const BnBNum = `text-16px font-bold text-white`;
const ImgStyling = `w-[64px] h-[64px]  rounded-2xl object-contain mx-auto`;
const footerBtnContainer = `flex items-center gap-4`;
const infoBox = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6 items-center w-full`;
