import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/router";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import clsx from "clsx";
import FinalButton from "@/components/button/final.button";
import { IModalProps } from "@/components/modal/standard.modal";
import { BNBIcon, LoaderIcon, MetamaskIcon2 } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import useUser from "@/hooks/use.user";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { CustomNewModal } from "@/components/modal/custom.new.modal";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";

interface FixedPriceNFTBuyerDescriptionProps {
  data: INFTDetailData | undefined;
  setNftData: () => void;
}

enum ModalType {
  buyNFTStep1FuncModal = "buyNFTStep1FuncModal",
  proceedFuncModal = "proceedFuncModal",
  successFuncModal = "successFuncModal",
}

export const FixedPriceNFTBuyerDescription = ({
  data,
  setNftData,
}: FixedPriceNFTBuyerDescriptionProps) => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { connectWallet } = useConnectWallet();
  const { library, deactivate } = useWeb3React();
  const [Modal, setModal] = useState(false);
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [isMigrated, setIsMigrated] = useState(false);
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });

  useEffect(() => {
    const CheckStatus = async () => {
      if (data?.saleState === "List") {
        const Status = await BlockchainRead.isCurrentMarketplaceOwner(
          library,
          data.collection,
          data.nftId
        );
        setIsMigrated(Status);
      }
    };

    CheckStatus();
  }, [data, library]);

  const bnbPrice = useBNBPrice();

  const buyNFTStep1Func = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.buyNFTStep1FuncModal);
    } catch (err: any) {
      toastError("Something went wrong. Please try again later.");
    }
  };
  const ProceedFunc = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.proceedFuncModal);
    } catch (err: any) {
      toastError("Something went wrong. Please try again later.");
    }
  };
  const SuccessFunc = (txStatus: boolean, msg: string) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.successFuncModal, { txStatus, msg });
    } catch (err: any) {
      toastError("Something went wrong. Please try again later.");
    }
  };
  const handleBuyNFT = async () => {
    let success = false;

    try {
      ProceedFunc();
      if (!data || !loggedInUser || !library) return;

      const balance = await library.getBalance(loggedInUser._id);

      if (balance && balance.lt(`${data.listInfo.price}`)) {
        return toast.error("Insufficient balance");
      }
      const result = await BlockchainWrite.callBuyListedItem(
        library,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId,
        (data as INFTDetailData).listInfo.price
      );

      if (result?.length) {
        setNftData();
        success = true;
      }
    } catch (error) {
      toastError("something went wrong");
      SuccessFunc(false, "Something went wrong. Unable to buy ");
    } finally {
      SuccessFunc(success, "Congratulations! You have successfully bought ");
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
          <h2 className="fmd:text-18px word-break text-base font-semibold text-white">
            {data?.name}
          </h2>
          <h3 className="text-xs font-normal text-white fmd:text-sm">
            Marketplace Fee {BlockchainConfig.fee.buyItemFeeForMarketplace}%
          </h3>
          <h3 className="text-xs font-normal text-white fmd:text-sm">
            Collection Fee {BlockchainConfig.fee.buyItemFeeForCreator}%
          </h3>
          <h3 className="text-xs font-normal text-white fmd:text-sm">
            Multilevel Fee {BlockchainConfig.fee.buyItemFeeForMultilevel}%
          </h3>
          <h6 className="flex items-center justify-center gap-2 text-xs font-bold text-white fmd:text-sm">
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
            <FinalButton
              title={"Checkout"}
              variant="primary"
              className="hover:scale- w-full rounded-[14px] hover:scale-95"
              onClick={handleBuyNFT}
            />
          </div>
        </div>
      ),
    },
    proceedFuncModal: {
      title: "Transaction in progress",
      visibility: true,
      content: () => (
        <div className={modalBodyWrapper}>
          <LoaderIcon className="mx-auto animate-spin" />
          <h3 className="fmd:text-18px text-base font-semibold leading-6 text-white">
            Transaction in progress
          </h3>
          <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
            Your transaction is in progress, Please wait.
          </p>
        </div>
      ),
    },
    successFuncModal: {
      title: "Your purchase is successful",
      visibility: true,
      content: ({ txStatus, msg }: IModalProps) => (
        <div className={modalBodyWrapper}>
          <Image
            className={ImgStyling}
            src={data ? data.image : ""}
            alt="image"
            height={64}
            width={64}
          />
          <h2 className="fmd:text-18px text-base font-semibold text-white">
            {txStatus ? "Purchased" : "Failed!"}
          </h2>
          {txStatus && (
            <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
              {msg}
              <span className="word-break text-white">{data?.name}</span> NFT on{" "}
              <b>Centher</b>
              platform.
            </p>
          )}
          {!txStatus && (
            <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
              {msg ?? "Transaction Failed."}
            </p>
          )}

          <div className={footerBtnContainer}>
            <FinalButton
              title={"View item"}
              variant="secondary"
              onClick={() => {
                modal.dismissModal();
              }}
              className="w-full rounded-[14px] hover:scale-95"
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
          className={clsx(greyTxt, `word-break whitespace-pre-wrap leading-6 `)}
        >
          {data?.description}
        </p>
      </div>
      <div className="buttonContainer flex items-center">
        {library ? (
          <FinalButton
            title={"Buy Now"}
            disabled={!isMigrated}
            variant={isMigrated ? "primary" : "primary"}
            onClick={async () => {
              if (!loggedInUser) {
                toast.error("Please login to buy this nft");
                return;
              }
              buyNFTStep1Func();
            }}
            className="w-full rounded-[14px] hover:scale-95"
          />
        ) : (
          <FinalButton
            title={"Connect Wallet"}
            variant="primary"
            onClick={() => {
              setConnectWalletModal(true);
            }}
            className="w-full rounded-[14px] hover:scale-95"
          />
        )}
      </div>
      {ModalModel.visibility && (
        <CustomModal
          onClose={() => {
            modal.dismissModal();
          }}
          title={ModalModel.title as string}
          disable={ModalModel.title === "Transaction in progress" ? "yes" : ""}
        >
          {ModalModel.content}
        </CustomModal>
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
const modalBodyWrapper = `
  flex flex-col gap-4 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 text-center
`;
const footerBtnContainer = `
flex items-center gap-4 
`;
const ImgStyling = `
w-[64px] h-[64px]  rounded-2xl object-cover mx-auto
`;
const nftDescriptionContainer = `
w-full flex flex-col gap-5
`;
const greyBoxContainer = `
bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6
`;
const greyTxt = `
text-14px font-normal text-gray-shade-7
`;
const desTitle = `
text-14px font-semibold text-white
`;
const BnBNum = `
text-16px font-bold text-white
`;
