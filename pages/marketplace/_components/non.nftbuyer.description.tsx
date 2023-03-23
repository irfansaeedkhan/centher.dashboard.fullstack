// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";
import clsx from "clsx";

// App imports
import Button from "@/components/button";
import { BNBIcon, LoaderIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";

interface NonNFTBuyerDescriptionProps {
  data: INFTDetailData | undefined;
  setNftData: () => void;
}
enum ModalType {
  buyNFTStep1FuncModal = "buyNFTStep1FuncModal",
  proceedFuncModal = "proceedFuncModal",
  successFuncModal = "successFuncModal",
}

export const NonNFTBuyerDescription = ({
  data,
  setNftData,
}: NonNFTBuyerDescriptionProps) => {
  const { library } = useWeb3React();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const bnbPrice = useBNBPrice();

  const buyNFTStep1Func = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.buyNFTStep1FuncModal);
    } catch (err: any) {
      toastError(err);
    }
  };
  const handleBuyNFT = async () => {
    ProceedFunc();
    let success = false;
    try {
      if (!library || !data) throw new Error("invalid dependencies");
      const result = await BlockchainWrite.callBuyListedItem(
        library,
        data.collection,
        data.nftId,
        data.listInfo.price
      );

      if (result?.length) {
        setNftData();
        success = true;
      }
    } catch (error) {
      toastError(error);
      SuccessFunc(false);
    } finally {
      SuccessFunc(success);
    }
  };
  const ProceedFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.proceedFuncModal);
    } catch (err: any) {
      toastError(err);
    }
  };
  const SuccessFunc = (txStatus: boolean) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.successFuncModal, txStatus);
    } catch (err: any) {
      toastError(err);
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    buyNFTStep1FuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: () => (
        <div className={modalBodyWrapper}>
          <Image
            className={ImgStyling}
            src={"/images/nftAsset.png"}
            alt="image"
            height={64}
            width={64}
          />
          <h2 className="text-18px font-semibold text-white">Maradona sport</h2>
          <h3 className="text-14px font-normal text-white">Gas fee 10%</h3>
          <h6 className="text-14px flex items-center justify-center gap-2 font-bold text-white">
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
      ),
    },
    proceedFuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: () => (
        <div className={modalBodyWrapper}>
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
              Congratulations! You have successfully placed bid on{" "}
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
          {/* <Link href={{
              pathname: AppRoutes.marketplace.nft,
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
                modal.dismissModal();
              }}
            />
            {/* </Link> */}
          </div>
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
        <p
          className={clsx(greyTxt, `word-break whitespace-pre-wrap leading-6`)}
        >
          {data?.description}
        </p>
      </div>
      <div className="buttonContainer flex items-center">
        <Button
          title={"Buy Now"}
          variant={data?.saleState === "NON" ? "v2" : "v1"}
          className="py-4"
          disabled={data?.saleState === "NON"}
          onClick={buyNFTStep1Func}
        />
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
