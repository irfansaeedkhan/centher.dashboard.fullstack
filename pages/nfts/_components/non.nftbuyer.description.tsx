// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";
import { ShareBigIcon, BNBIcon, WarningIcon, LoaderIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { callBuyListedItem } from "@/web3/utils/call.helpers";
import { useWeb3React } from "@web3-react/core";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import toast from "react-hot-toast";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";

interface NonNFTBuyerDescriptionProps {
  data: INFTDetailData | undefined;
  reload?: boolean;
  setReload?: any;
}
export const NonNFTBuyerDescription = ({
  data,
  reload,
  setReload,
}: NonNFTBuyerDescriptionProps) => {
  const { library } = useWeb3React();
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const bnbPrice = useBNBPrice();

  const buyNFTStep1Func = () => {
    if (!library) {
      toast.error("Confirm your Wallet Connection.");
      return;
    }
    setModalTitle("Complete Checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <Image
          className={ImgStyling}
          src={"/images/nftAsset.png"}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px text-white font-semibold">Maradona sport</h2>
        <h3 className="text-white text-14px font-normal">Gas fee 10%</h3>
        <h6 className="text-white text-14px font-bold flex items-center gap-2 justify-center">
          <span>Price:</span>
          <BNBIcon />
          89.08 BNB <span className="text-gray-shade-2 "> =$24190.19</span>
        </h6>
        <div className={footerBtnContainer}>
          <Button
            title={"Checkout"}
            variant="v1"
            className="py-4"
            onClick={handleBuyNFT}
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
    setModalTitle("Complete Checkout");
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

  const handleBuyNFT = async () => {
    ProceedFunc();
    if (library && data) {
      const result = await callBuyListedItem(
        library,
        data.collection,
        data.nftId,
        data.listInfo.price
      );
      SuccessFunc(result.success);
    } else {
      SuccessFunc(false);
    }
  };

  return (
    <div className={nftDescriptionContainer}>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Current Price</h4>
        <div className="flex gap-3  items-center">
          <BNBIcon />
          <h5 className={BnBNum}>
            {formatEther2Number(data?.listInfo.price)} BNB
          </h5>
          <h6 className={greyTxt}>
            {" "}
            =${formatBNB2USD(data?.listInfo.price, bnbPrice)}
          </h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p className={`${greyTxt} leading-6 whitespace-pre-wrap break-all`}>
          {data?.description}
        </p>
      </div>
      <div className="buttonContainer flex items-center">
        <Button
          title={"Buy NFT"}
          variant={data?.saleState === "NON" ? "v2" : "v1"}
          className="py-4"
          disabled={data?.saleState === "NON"}
          onClick={buyNFTStep1Func}
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
flex items-center gap-4 mt-3
`);
const ImgStyling = ctl(`
w-[64px] h-[64px]  rounded-2xl object-contain mx-auto
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
