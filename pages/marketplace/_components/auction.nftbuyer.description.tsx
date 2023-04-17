// React, Next, NPM Packages
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";

// App imports
import Button from "@/components/button";
import { BNBIcon, LoaderIcon, HammerIconBG } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { useGetBNBBalance } from "@/web3/hooks/use.get.balances";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";

// same directory
import AuctionBidModal from "./auction.bid.modal";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
interface AuctionNFTBuyerDescriptionProps {
  data: INFTDetailData | undefined;
  setNftData: () => void;
}

enum ModalType {
  proceedFuncModal = "proceedFuncModal",
  successFuncModal = "successFuncModal",
}
export const AuctionNFTBuyerDescription = ({
  data,
  setNftData,
}: AuctionNFTBuyerDescriptionProps) => {
  const [BidModal, setBidModal] = useState(false);
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
        } else {
          setEnd(false);
        }
      });
    }

    return () => {
      clearInterval(updateTime);
    };
  }, [data]);

  const SuccessFunc = useCallback((txStatus: boolean) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.successFuncModal, txStatus);
    } catch (err: any) {
      toastError(err);
    }
  }, []);
  const ProceedFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.proceedFuncModal);
    } catch (err: any) {
      toastError(err);
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
      let success = false;
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
            success = true;
          }
        }
      } catch (error) {
        toast.error("something went wrong, please try again later.");
      } finally {
        SuccessFunc(success);
      }
    },
    [SuccessFunc, bnbBalance, data, library, price]
  );
  const modalTemplateCollection: TemplateCollection = {
    proceedFuncModal: {
      title: "Complete Checkout",
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
      content: (txStatus: any) => (
        <div className={modalBodyWrapper1}>
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
              Congratulations! You have successfully placed bid on{" "}
              <span className="text-white">{data?.name} </span> NFT on{" "}
              <b> Centher </b>
              platform.
            </p>
          )}
          {!txStatus && (
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              Transaction Failed.
            </p>
          )}
          <Button
            title={"Ok"}
            variant="v1"
            className="py-4"
            onClick={() => {
              modal.dismissModal();
            }}
          />
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
      <div className="buttonContainer flex items-center">
        {nowTime <= endTime && (
          <Button
            title={"Place bid"}
            variant={end ? "v2" : "v1"}
            disabled={end}
            className="py-4"
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
const modalBodyWrapper1 = `flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 items-center`;
const nftDescriptionContainer = `w-full flex flex-col gap-5`;
const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6`;
const greyTxt = `text-14px font-normal text-gray-shade-7`;
const desTitle = `text-14px font-semibold text-white`;
const BnBNum = `text-16px font-bold text-white`;
const ImgStyling = `w-[64px] h-[64px]  rounded-2xl object-contain mx-auto`;
