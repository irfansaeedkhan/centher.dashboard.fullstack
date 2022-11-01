// React, Next, NPM Packages
import React, { useState, useEffect } from "react";
import ctl from "@netlify/classnames-template-literals";
import Image from "next/image";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { useWeb3React } from "@web3-react/core";

// App imports
import Button from "@/components/button";
import { ShareBigIcon, BNBIcon, AuctionIcon, LoaderIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import { callBidOnAuction } from "@/web3/utils/call.helpers";

const schema = Joi.object({
  bidPrice: Joi.number().required().label("bidPrice").messages({
    "string.empty": `bid Price Required`,
    "any.required": `Required Field`,
  }),
});
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
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const { library } = useWeb3React();

  const price =
    Number(data?.auctionInfo.highestBidPrice) === 0
      ? data?.auctionInfo.startPrice
      : data?.auctionInfo.highestBidPrice;

  const [newTime, setNewTime] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

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
        }
      });
    }

    return () => {
      clearInterval(updateTime);
    };
  }, [data]);

  const { handleSubmit, register, setError, formState, reset } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const bidNFTModalFunc = () => {
    setModalTitle("Place a bid");
    setModalContent(
      <div className={modalBodyWrapper}>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Blockchain</label>
          <div className={`${inputFieldModal} flex items-center gap-3 !ring-0`}>
            <BNBIcon />{" "}
            <h6 className="text-14px font-semibold text-white">BNB</h6>
          </div>
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Price</label>
          <div
            className={`${inputFieldModal} flex items-center justify-between gap-3 !p-0 !px-3 !ring-0`}
          >
            <input
              type="text"
              id="bidPrice"
              autoComplete="off"
              {...register("bidPrice")}
              placeholder="0.00"
              className={
                "w-full h-full !border-0 !ring-0 bg-transparent text-white"
              }
            />
            <h6 className="text-14px font-semibold text-gray-shade-7">
              =$0000
            </h6>
          </div>
          {formState.errors.bidPrice && (
            <p className={`text-red-500 ${errMessage}`}>
              {/* {formState.errors.bidPrice.message} */}
            </p>
          )}
        </div>
        <Button
          title={"Place bid "}
          variant={formState.isValid ? "v1" : "v2"}
          disabled={!formState.isValid}
          onClick={handleSubmit(onSubmit)}
          className="py-4 mt-2"
        />
      </div>
    );
  };
  const ProceedFunc = () => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper1}>
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
            Congratulations! You have successfully bidded{" "}
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
  const onSubmit = async (event: any) => {
    setModal(false);
    ProceedFunc();
    if (library && data) {
      const result = await callBidOnAuction(
        library,
        data.collection,
        data.nftId,
        event.bidPrice
      );
      SuccessFunc(result.success);
    } else {
      SuccessFunc(false);
    }
  };

  useEffect(() => {
    bidNFTModalFunc();
  }, [!formState.isValid]);
  return (
    <div className={nftDescriptionContainer}>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Minimum Bid</h4>
        <div className="flex gap-3  items-center">
          <BNBIcon className="[&>*]:fill-[#E35259]" />
          <h5 className={BnBNum}>{formatEther2Number(price)} BNB</h5>
          <h6 className={greyTxt}> =${formatBNB2USD(price)}</h6>
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
        <Button
          title={"Place bid"}
          variant="v1"
          className="py-4"
          onClick={() => {
            bidNFTModalFunc();
            setModal(true);
          }}
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
