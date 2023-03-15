// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";
import { BNBIcon, LoaderIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { useGetNFTOwner } from "@/web3/hooks/use.contracts.functions";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import toast from "react-hot-toast";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { useRouter } from "next/router";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { BlockchainWrite } from "@/web3/blockchain";
import { BlockchainConfig } from "@/web3/blockchain/config";

interface FixedPriceNFTBuyerDescriptionProps {
  data: INFTDetailData | undefined;
  reload?: boolean;
  setReload?: any;
}
export const FixedPriceNFTBuyerDescription = ({
  data,
}: FixedPriceNFTBuyerDescriptionProps) => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { library } = useWeb3React();
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const nftOwnerAddress = useGetNFTOwner(
    data?.collection,
    data?.nftId,
    data?.owner
  );

  const { user: nftOwner } = useGetUser(nftOwnerAddress);

  const bnbPrice = useBNBPrice();

  const buyNFTStep1Func = () => {
    if (!library) {
      toast.error("Connect your Wallet.");
      return;
    }
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
        <h2 className="text-18px font-semibold text-white">{data?.name}</h2>
        <h3 className="text-14px font-normal text-white">
          Marketplace Fee {BlockchainConfig.fee.buyItemFeeForMarketplace}%
        </h3>
        <h3 className="text-14px font-normal text-white">
          Collection Fee {BlockchainConfig.fee.buyItemFeeForCreator}%
        </h3>
        <h3 className="text-14px font-normal text-white">
          Multilevel Fee {BlockchainConfig.fee.buyItemFeeForMultilevel}%
        </h3>
        <h6 className="text-14px flex items-center justify-center gap-2 font-bold text-white">
          <span>Price:</span>
          <BNBIcon />
          {`${normalizeValue(
            formatEther2Number(data?.listInfo.price)
          )} BNB`}{" "}
          <span className="text-gray-shade-2 ">
            {" "}
            =${formatBNB2USD(data?.listInfo.price, bnbPrice)}
          </span>
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
  const buyNFTStep2Func = () => {
    setModalTitle("Complete Checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <LoaderIcon className="mx-auto animate-spin" />
        <h3 className="text-18px font-semibold leading-6 text-white">
          Transaction in progress
        </h3>
        <p className="text-14px font-normal leading-6 text-gray-shade-2">
          Your transaction is in progress, Please wait.
        </p>
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
        <h2 className="text-18px font-semibold text-white">
          {txStatus ? "Success!" : "Failed!"}
        </h2>
        {txStatus && (
          <p className="text-14px font-normal leading-6 text-gray-shade-2">
            Congratulations! You have successfully bought{" "}
            <span className="text-white">{data?.name}</span> NFT on{" "}
            <b>Centher</b>
            platform.
          </p>
        )}
        {!txStatus && (
          <p className="text-14px font-normal leading-6 text-gray-shade-2">
            Transaction Failed.
          </p>
        )}

        <div className={footerBtnContainer}>
          <Button
            title={"Ok"}
            variant="v4"
            className="py-4"
            onClick={() => {
              router.reload();
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const handleBuyNFT = async () => {
    try {
      buyNFTStep2Func();
      const result = await BlockchainWrite.callBuyListedItem(
        library,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId,
        (data as INFTDetailData).listInfo.price
      );
      SuccessFunc(!!result);
    } catch (error) {
      toast.error("something went wrong, please try again later.");
      SuccessFunc(false);
    }
  };
  return (
    <div className={nftDescriptionContainer}>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Current Price</h4>
        <div className="flex items-center  gap-3">
          <BNBIcon />
          <h5 className={BnBNum}>
            {`${normalizeValue(formatEther2Number(data?.listInfo.price))} BNB`}
          </h5>
          <h6 className={greyTxt}>
            {" "}
            =${formatBNB2USD(data?.listInfo.price, bnbPrice)}
          </h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p className={`${greyTxt} whitespace-pre-wrap break-all leading-6`}>
          {data?.description}
        </p>
      </div>
      <div className="buttonContainer flex items-center">
        {library && (
          <Button
            title={"Buy Now"}
            variant="v1"
            className="py-4"
            onClick={async () => {
              if (!loggedInUser) {
                toast.error("Please login to buy this nft");
                return;
              }
              buyNFTStep1Func();
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
