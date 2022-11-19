// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";
import { useWeb3React } from "@web3-react/core";

// App imports
import Button from "@/components/button";
import {
  ShareBigIcon,
  BNBIcon,
  AuctionIcon,
  WarningIcon,
  LoaderIcon,
} from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { callCancelAuction, callEndAuction } from "@/web3/utils/call.helpers";
import {
  formatAddress,
  formatBNB2USD,
  formatEther2Number,
} from "@/utils/format.address";
import toast from "react-hot-toast";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";

interface AuctionNftDescriptionProps {
  data: INFTDetailData | undefined;
  reload?: boolean;
  setReload?: any;
}
export const AuctionNftDescription = ({
  data,
  reload,
  setReload,
}: AuctionNftDescriptionProps) => {
  const { library } = useWeb3React();
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const [end, setEnd] = useState(true);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const bnbPrice = useBNBPrice();

  useEffect(() => {
    if (data) {
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

  const cancelAuctionFunc = () => {
    if (!library) {
      toast.error("Confirm your Wallet Connection.");
      return;
    }
    setModalTitle("Cancel Auction");
    setModalContent(
      <div className={modalBodyWrapper}>
        <WarningIcon className="mx-auto" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Are you sure you want to cancel your Auction?
        </h3>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Canceling your auction will unpublish this sale from market and You
          will be asked to confirm the transaction through your wallet.
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"Go back"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModalTitle("");
              setModalContent(null);
              setModal(false);
            }}
          />
          <Button
            title={"Proceed"}
            onClick={handleCancelAuction}
            variant="v1"
            className="py-4"
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const endAuctionFunc = () => {
    if (!library) {
      toast.error("Confirm your Wallet Connection.");
      return;
    }
    setModalTitle("End Auction");
    setModalContent(
      <div className={modalBodyWrapper}>
        <WarningIcon className="mx-auto" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Are you sure you want to end your Auction Price?
        </h3>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Your NFT will go to{" "}
          {formatAddress(data?.auctionInfo.highestBidAddress)} and you will
          receive {formatEther2Number(data?.auctionInfo.highestBidPrice)} BNB
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"Go back"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModalTitle("");
              setModalContent(null);
              setModal(false);
            }}
          />
          <Button
            title={"Proceed"}
            onClick={handleEndAuction}
            variant="v1"
            className="py-4"
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const ProceedFunc = () => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <LoaderIcon className="mx-auto animate-spin" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Transaction in progress
        </h3>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Your transaction is in progress, Please wait.
        </p>
        {/* <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Transaction Hash
          <span className="text-yellow-theme ml-2">0x1204...23b350</span>
        </p> */}
        {/* <div className={footerBtnContainer}>
          <Button
            title={"Cancel"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
        </div> */}
      </div>
    );
    setModal(true);
  };
  const SuccessFunc = (txStatus: boolean) => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
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
            Congratulations! You have successfully created{" "}
            <span className="text-white">{data?.name}</span> NFT on Nether NFT
            platform.
          </p>
        )}
        {!txStatus && (
          <p className="text-gray-shade-2 text-14px font-normal leading-6">
            Transaction Failed.
          </p>
        )}
        {/* <Link href={{
              pathname: AppRoutes.nfts.nft,
              query: {
                collection: nftData?.collection,
                nftId: 2,
              }}} 
          className={footerBtnContainer}
        > */}
        <div className={footerBtnContainer}>
          <Button
            title={"Ok"}
            variant="v4"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
          {/* </Link> */}
        </div>
      </div>
    );
    setModal(true);
  };

  const handleEndAuction = async () => {
    ProceedFunc();
    const result = await callEndAuction(
      library,
      (data as INFTDetailData).collection,
      (data as INFTDetailData).nftId
    );
    SuccessFunc(result.success);
  };
  const handleCancelAuction = async () => {
    ProceedFunc();
    const result = await callCancelAuction(
      library,
      (data as INFTDetailData).collection,
      (data as INFTDetailData).nftId
    );
    SuccessFunc(result.success);
  };
  return (
    <div className={nftDescriptionContainer}>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Minimum Bid</h4>
        <div className="flex gap-3  items-center">
          <BNBIcon className="[&>*]:fill-[#E35259]" />
          <h5 className={BnBNum}>
            {formatEther2Number(data?.auctionInfo.highestBidPrice)} BNB
          </h5>
          <h6 className={greyTxt}>
            {" "}
            =${formatBNB2USD(data?.auctionInfo.highestBidPrice, bnbPrice)}
          </h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p className={`${greyTxt} leading-6`}>
          This NFT is a &quot;bismuth edition&quot; version of Paracelsus. It is
          a tribute to the great Alchemist Paracelsus as Bismuth is one of the
          minerals with which the Philosopher&apos;s Stone can be made.
        </p>

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
      <div className="buttonContainer flex items-center gap-4">
        <Button
          title={"Cancel Auction"}
          variant="v1"
          className="py-4"
          onClick={cancelAuctionFunc}
        />
        <Button
          title={"End Auction"}
          disabled={!end}
          onClick={endAuctionFunc}
          variant="v4"
          className="py-4"
        />
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
    </div>
  );
};
// styling
const modalBodyWrapper = ctl(`
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center
`);
const footerBtnContainer = ctl(`
flex items-center gap-4
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
