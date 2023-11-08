import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import clsx from "clsx";
import Button from "@/components/button";
import { IModalProps } from "@/components/modal/standard.modal";
import { BNBIcon, MetamaskIcon2 } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import TrxInProgressModal from "@/utils/modal/trx-modal";
import SuccessMessageModal from "@/utils/modal/success-modal";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import useUser from "@/hooks/use.user";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { useWallet } from "@/web3/hooks/use.wallet";
import { ConnectWalletComp } from "@/components/connect.wallet";

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
  const { user: loggedInUser } = useUser();
  const { getSigner } = useWallet();
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
          getSigner()!,
          data.collection,
          data.nftId
        );
        setIsMigrated(Status);
      }
    };

    CheckStatus();
  }, [data, getSigner]);

  const bnbPrice = useBNBPrice();

  const buyNFTStep1Func = () => {
    validateProvider();
    modal.dismissModal();
    modal.createModal(ModalType.buyNFTStep1FuncModal);
  };
  const ProceedFunc = () => {
    modal.dismissModal();
    modal.createModal(ModalType.proceedFuncModal);
  };
  const SuccessFunc = (txStatus: boolean, msg: string) => {
    try {
      modal.dismissModal();
      modal.createModal(ModalType.successFuncModal, { txStatus, msg });
    } catch (err: any) {
      !txStatus && toastError("Something went wrong. Please try again later.");
    }
  };
  const handleBuyNFT = async () => {
    ProceedFunc();
    let response = { success: false, message: "" };
    try {
      ProceedFunc();
      const signer = getSigner();
      if (!data || !loggedInUser || !signer) return;

      const balance = await signer!.getBalance();
      if (balance && balance.lt(`${data.listInfo.price}`)) {
        response.success = false;
        response.message = "Insufficient balance";
        return;
      }

      const result = await BlockchainWrite.callBuyListedItem(
        signer!,
        (data as INFTDetailData).collection,
        (data as INFTDetailData).nftId,
        (data as INFTDetailData).listInfo.price
      );

      if (!!result) {
        setNftData();
        response.success = true;
        response.message = "Congratulations! You have successfully bought ";
      } else throw new Error();
    } catch (error) {
      response.success = false;
      response.message = "Something went wrong. Unable to buy ";
    } finally {
      SuccessFunc(response.success, response.message);
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    buyNFTStep1FuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: () => (
        <div
          className={`flex w-full flex-col gap-4 px-2 pt-2 text-center fmd:px-4 fmd:pt-4`}
        >
          {data && (
            <Image
              className={`mx-auto h-[64px] w-[64px] rounded-2xl object-cover`}
              src={
                data.type.includes("audio")
                  ? "/images/default-music.png"
                  : data.type.includes("video")
                  ? data.videoThumbnail || "/images/default-music.png"
                  : data.image
              }
              alt="image"
              height={64}
              width={64}
            />
          )}
          <h2 className="word-break text-base font-semibold text-white fmd:text-lg">
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
          <div className={`flex items-center gap-4`}>
            <Button
              title={"Checkout"}
              variant="primary"
              className="w-full rounded-[14px]"
              onClick={handleBuyNFT}
            />
          </div>
        </div>
      ),
    },
    proceedFuncModal: {
      title: "Transaction in progress",
      visibility: true,
      content: () => <TrxInProgressModal />,
    },
    successFuncModal: {
      title: "Checkout",
      visibility: true,
      content: ({ txStatus, msg }: IModalProps) => (
        <SuccessMessageModal
          heading={
            <h2 className="text-base font-semibold text-white fmd:text-lg">
              {txStatus ? "Purchased" : "Failed!"}
            </h2>
          }
          subHeading={
            <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
              {msg}
              <span className="word-break text-white">{data?.name}</span> NFT on{" "}
              <b>Centher</b>
              platform.
            </p>
          }
          txStatus={txStatus}
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={() => {
            modal.dismissModal();
          }}
        />
      ),
    },
  };

  const modal = new ModalManager(setModalModel, modalTemplateCollection);

  function validateProvider(): void {
    if (!getSigner()) {
      throw new Error("Connect your wallet");
    }
  }
  function toastError(err: any): void {
    toast.error(err?.message ? err.message : err);
  }

  useEffect(() => {
    if (ModalModel.visibility) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [ModalModel.visibility]);

  return (
    <div className={`flex w-full flex-col gap-5`}>
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
        <h4 className={`text-sm font-semibold text-white`}>Description</h4>
        <p
          className={clsx(greyTxt, `word-break whitespace-pre-wrap leading-6 `)}
        >
          {data?.description}
        </p>
      </div>
      <div className="buttonContainer flex items-center">
        {getSigner() ? (
          <Button
            title={"Buy Now"}
            disabled={!isMigrated}
            variant={isMigrated ? "primary" : "secondary"}
            onClick={async () => {
              if (!loggedInUser) {
                toast.error("Please login to buy this nft");
                return;
              }
              buyNFTStep1Func();
            }}
            className="w-full rounded-[14px]"
          />
        ) : (
          <ConnectWalletComp className="w-full rounded-[14px]" />
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
    </div>
  );
};

// styling
const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6`;
const greyTxt = `text-sm font-normal text-gray-shade-7`;
const BnBNum = `text-base font-bold text-white`;
