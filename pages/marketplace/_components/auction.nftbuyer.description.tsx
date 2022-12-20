// React, Next, NPM Packages
import React, { useState, useEffect, useCallback } from "react";
import ctl from "@netlify/classnames-template-literals";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";

// App imports
import Button from "@/components/button";
import { ShareBigIcon, BNBIcon, AuctionIcon, LoaderIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import { callBidOnAuction } from "@/web3/utils/call.helpers";
import toast from "react-hot-toast";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { useGetBNBBalance } from "@/web3/hooks/use.get.balances";

// same directory
import AuctionBidModal from "./auction.bid.modal";
interface AuctionNFTBuyerDescriptionProps {
  data: INFTDetailData | undefined;
  reload?: boolean;
  setReload?: any;
}
export const AuctionNFTBuyerDescription = ({
  data,
  reload,
  setReload,
}: AuctionNFTBuyerDescriptionProps) => {
  const [Modal, setModal] = useState(false);
  const [BidModal, setBidModalModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

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
  // const [bidPrice, setBidPrice] = useState<any>(null);
  // const [bidPriceErr, setBidPriceErr] = useState(true);
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
  interface bidForm {
    bidPrice: number;
  }
  // const handleBidValue = (e: any) => {
  //   setBidPrice(e.target.value);

  //   if (!!e.target.value) {
  //     setBidPriceErr(false);
  //   } else {
  //     setBidPriceErr(true);
  //   }
  // };

  const SuccessFunc = useCallback(
    (txStatus: boolean) => {
      setModalTitle("Complete Checkout");
      setModalContent(
        <div className={modalBodyWrapper1}>
          <Image
            className={ImgStyling}
            src={data ? data.image : ""}
            alt="image"
            height={64}
            width={64}
          />
          <h2 className="text-18px text-white font-semibold">
            {txStatus ? "Success!" : "Failed!"}
          </h2>
          {txStatus && (
            <p className="text-gray-shade-2 text-14px font-normal leading-6">
              Congratulations! You have successfully placed bid on{" "}
              <span className="text-white">{data?.name}</span> NFT on{" "}
              <b>Centher</b>
              platform.
            </p>
          )}
          {!txStatus && (
            <p className="text-gray-shade-2 text-14px font-normal leading-6">
              Transaction Failed.
            </p>
          )}
          <Button
            title={"Ok"}
            variant="v1"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
        </div>
      );
      setModal(true);
    },
    [data]
  );
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
      setModal(false);
      ProceedFunc();
      if (library && data) {
        const result = await callBidOnAuction(
          library,
          data.collection,
          data.nftId,
          bidPriceVal
        );
        SuccessFunc(result.success);
      } else {
        SuccessFunc(false);
      }
    },
    [SuccessFunc, bnbBalance, data, library, price]
  );
  // const bidNFTModalFunc = useCallback(() => {
  //   if (!library) {
  //     toast.error("Confirm your Wallet Connection.");
  //     return;
  //   }
  //   setModalTitle("Place a bid");
  //   setModalContent(
  //     <div className={modalBodyWrapper}>
  //       <div className={fieldWrapper}>
  //         <label className={fieldTitle}>Blockchain</label>
  //         <div className={`${inputFieldModal} flex items-center gap-3 !ring-0`}>
  //           <BNBIcon />{" "}
  //           <h6 className="text-14px font-semibold text-white">BNB</h6>
  //         </div>
  //       </div>
  //       <div className={fieldWrapper}>
  //         <label className={fieldTitle}>Price</label>
  //         <div
  //           className={`${inputFieldModal} flex items-center justify-between gap-3 !p-0 !px-3 !ring-0`}
  //         >
  //           <input
  //             type="text"
  //             onKeyPress={(event) => {
  //               if (!/[0-9.]/.test(event.key)) {
  //                 event.preventDefault();
  //               }
  //             }}
  //             pattern="[0-9.]*"
  //             id="bidPrice"
  //             autoComplete="off"
  //             name="bidPrice"
  //             onChange={handleBidValue}
  //             value={bidPrice}
  //             placeholder="0.00"
  //             className={
  //               "w-full h-full !border-0 !ring-0 bg-transparent text-white"
  //             }
  //           />
  //           <h6 className="text-14px font-semibold text-gray-shade-7">
  //             =$0000
  //           </h6>
  //         </div>
  //         {bidPriceErr && (
  //           <p className={`text-red-500 ${errMessage}`}>
  //             Kindly fill the form using numbers
  //           </p>
  //         )}
  //       </div>
  //       <Button
  //         title={"Place bid "}
  //         variant={bidPriceErr ? "v2" : "v1"}
  //         disabled={bidPriceErr}
  //         onClick={() => {
  //           onSubmit(bidPrice);
  //         }}
  //         className="py-4 mt-2"
  //       />
  //     </div>
  //   );
  // }, [bidPrice, bidPriceErr, library, onSubmit]);

  const ProceedFunc = () => {
    setModalTitle("Complete Checkout");
    setModalContent(
      <div className={modalBodyWrapper1}>
        <LoaderIcon className="mx-auto animate-spin" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Transaction in progress
        </h3>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Your transaction is in progress, Please wait.
        </p>
      </div>
    );
    setModal(true);
  };

  return (
    <div className={nftDescriptionContainer}>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Minimum Bid</h4>
        <div className="flex gap-3  items-center">
          <BNBIcon className="[&>*]:fill-[#E35259]" />
          <h5 className={BnBNum}>{formatEther2Number(price)} BNB</h5>
          <h6 className={greyTxt}> =${formatBNB2USD(price, bnbPrice)}</h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p className={`${greyTxt} leading-6`}>{data?.description}</p>

        <div className="auctionTimerBox flex flex-row [@media(max-width:600px)]:!flex-col gap-3 rounded-10px relative overflow-hidden border-2 border-gray-shade-3">
          <div className="iconBox bg-background-shade-2 flex flex-col items-center gap-3 text-center p-6 min-w-[170px]">
            <AuctionIcon />
            <h4 className="text-14px font-normal text-white">
              Auction ends in
            </h4>
          </div>
          <div className="flex w-full justify-center p-4">
            <div className="timerBox flex items-center gap-5">
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">{days}</h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Days
                </h6>
              </div>
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">{hours}</h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Hours
                </h6>
              </div>
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">
                  {minutes}
                </h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Minutes
                </h6>
              </div>
              <div className="dateBix flex flex-col items-center gap-2">
                <h5 className="text-white text-20px font-semibold">
                  {seconds}
                </h5>
                <h6 className="text-gray-shade-7 text-12px font-normal">
                  Seconds
                </h6>
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
                toast.error("Confirm your Wallet Connection.");
                return;
              }
              if (library) {
                // bidNFTModalFunc();
                setBidModalModal(true);
                // setModal(true);
              }
            }}
          />
        )}
      </div>

      {Modal && (
        <CustomModal
          onClose={() => {
            setModal(false);
          }}
          title={ModalTitle}
        >
          {ModalContent}
        </CustomModal>
      )}
      {BidModal && <AuctionBidModal onSubmit={onSubmit} />}
    </div>
  );
};
// styling
const modalBodyWrapper1 = ctl(`
flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 items-center
`);
const modalBodyWrapper = ctl(`
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 
`);
const errMessage = ctl(`
pb-2 text-12px font-medium
`);
const fieldWrapper = ctl(`
  flex gap-2 flex-col w-full
`);
const fieldTitle = ctl(`
  text-14px  font-normal text-white
`);
const inputFieldModal = ctl(`
  w-full py-3 px-5 h-[48px]  !bg-black-shade-2  text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none ring-black-shade-7 ring-2 focus:!ring-yellow-theme active:!ring-yellow-theme
`);
const nftDescriptionContainer = ctl(`
w-full flex flex-col gap-5
`);
const titleContainer = ctl(`
flex items-center justify-between 
`);
const desNameContainer = ctl(`
flex gap-6 [@media(max-width:600px)]:flex-wrap
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  animationTextHeading text-34px
`);
const nameBox = ctl(`
flex items-start gap-3
`);
const nameBoxTitle = ctl(`
text-12px font-normal text-gray-shade-2
`);
const nameBoxZValue = ctl(`
text-14px font-semibold text-white
`);
const greyBoxContainer = ctl(`
bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6
`);
const greyTxt = ctl(`
text-14px font-normal text-gray-shade-7
`);
const desTitle = ctl(`
text-14px font-semibold text-white
`);
const BnBNum = ctl(`
text-16px font-bold text-white
`);

const ImgStyling = ctl(`
w-[64px] h-[64px]  rounded-2xl object-contain mx-auto
`);

const footerBtnContainer = ctl(`
flex items-center gap-4
`);
