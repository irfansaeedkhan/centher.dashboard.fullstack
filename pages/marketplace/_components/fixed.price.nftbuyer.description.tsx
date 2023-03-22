// React, Next, NPM Packages
import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/router";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import ctl from "@netlify/classnames-template-literals";
import clsx from "clsx";

// App imports
import NewButton from "@/components/button/new.button";
import { BNBIcon, LoaderIcon, MetamaskIcon2 } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { useGetNFTOwner } from "@/web3/hooks/use.contracts.functions";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import toast from "react-hot-toast";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { BlockchainWrite } from "@/web3/blockchain";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { CustomNewModal } from "@/components/modal/custom.new.modal";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import Button from "@/components/button";

interface FixedPriceNFTBuyerDescriptionProps {
  data: INFTDetailData | undefined;
  reload?: boolean;
  setReload?: any;
}

enum ModalType {
  buyNFTStep1FuncModal = "buyNFTStep1FuncModal",
  proceedFuncModal = "proceedFuncModal",
  successFuncModal = "successFuncModal",
}

export const FixedPriceNFTBuyerDescription = ({
  data,
}: FixedPriceNFTBuyerDescriptionProps) => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { connectWallet } = useConnectWallet();
  const { library, deactivate } = useWeb3React();
  const [Modal, setModal] = useState(false);
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const nftOwnerAddress = useGetNFTOwner(
    data?.collection,
    data?.nftId,
    data?.owner
  );

  const { user: nftOwner } = useGetUser(nftOwnerAddress);

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
  const handleBuyNFT = async () => {
    try {
      ProceedFunc();
      const result = await BlockchainWrite.callBuyListedItem(
        library,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId,
        (data as INFTDetailData).listInfo.price
      );
      SuccessFunc(!!result);
    } catch (error) {
      toastError(error);
      SuccessFunc(false);
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
            <NewButton title={"Checkout"} variant="v1" onClick={handleBuyNFT} />
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
            <NewButton
              title={"Ok"}
              variant="v4"
              onClick={() => {
                modal.dismissModal();
              }}
            />
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
        {library ? (
          <NewButton
            title={"Buy Now"}
            variant="v1"
            onClick={async () => {
              if (!loggedInUser) {
                toast.error("Please login to buy this nft");
                return;
              }
              buyNFTStep1Func();
            }}
          />
        ) : (
          <NewButton
            title={"Connect Wallet"}
            variant="v9"
            onClick={() => {
              setConnectWalletModal(true);
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
      {connectWalletModal && (
        <CustomNewModal
          onClose={() => {
            setModal(false);
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
            <div className="flex w-full max-w-[400px] items-center justify-between gap-10 rounded-xl border border-brand-primary py-3 px-5">
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
                    loggedInUser.account_address.toLowerCase() !==
                    _account?.toLowerCase()
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
