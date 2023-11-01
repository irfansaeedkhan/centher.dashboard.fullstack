import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import clsx from "clsx";
import { IModalProps } from "@/components/modal/standard.modal";
import { AuctionIcon, BNBIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import SuccessMessageModal from "@/utils/modal/success-modal";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";

import Button from "@/components/button";
import { useWallet } from "@/web3/hooks/use.wallet";
import TrxInProgressModal from "@/utils/modal/trx-modal";

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
  const { getSigner } = useWallet();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [nowTime, setNowTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isMigrated, setIsMigrated] = useState(false);
  const [end, setEnd] = useState(true);
  const bnbPrice = useBNBPrice();

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

    if (data) {
      var endtime = new Date(data?.unlock * 1000);
      var now = new Date();
      setNowTime(now);
      setEndTime(endtime);

      var updateTime = setInterval(() => {
        var now = new Date().getTime();

        var difference = data.unlock * 1000 - now;

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
  }, [getSigner, data]);

  const buyNFTStep1Func = () => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.buyNFTStep1FuncModal);
    } catch (err: any) {
      toastError("Something went wrong");
    }
  };
  const handleBuyNFT = async () => {
    ProceedFunc();
    let response = { success: false, message: "" };
    try {
      const signer = getSigner();
      if (!signer || !data) throw new Error("invalid dependencies");
      const result = await BlockchainWrite.callBuyListedItem(
        signer!,
        data.collection,
        data.nftId,
        data.listInfo.price
      );

      if (!!result) {
        setNftData();
        response.success = true;
        response.message = "Congratulations! You have successfully bought the ";
      } else throw new Error();
    } catch (error) {
      response.success = false;
      response.message = "Unable to buy NFT";
    } finally {
      SuccessFunc(response.success, response.message);
    }
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
      !txStatus && toastError("Something went wrong");
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
          <h2 className="text-base font-semibold text-white f2xl:text-lg">
            Maradona sport
          </h2>
          <h3 className="text-sm font-normal text-white">Gas fee 10%</h3>
          <h6 className="flex items-center justify-center gap-2 text-sm font-bold text-white">
            <span>Price:</span>
            <BNBIcon />
            89.08 BNB <span className="text-gray-shade-2 "> =$24190.19</span>
          </h6>
          <div className={footerBtnContainer}>
            <Button
              title={"Checkout"}
              variant="primary"
              onClick={handleBuyNFT}
              className="w-full rounded-[14px]"
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
      title: "Complete Checkout",
      visibility: true,
      content: ({ txStatus, msg }: IModalProps) => (
        <SuccessMessageModal
          heading={
            <h2 className="mt-2 text-base font-semibold text-white f2xl:text-lg">
              {txStatus ? "Success!" : "Failed!"}
            </h2>
          }
          subHeading={
            <p className="text-sm font-normal leading-6 text-gray-shade-2">
              {msg} <span className="word-break text-white">{data?.name}</span>{" "}
              NFT on <b>Centher</b>
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

      {data!.unlock < +new Date() / 1000 ? (
        <div className="buttonContainer flex items-center">
          <Button
            title={"Buy Now"}
            variant={data?.saleState === "NON" ? "primary" : "secondary"}
            disabled={data?.saleState === "NON" || isMigrated}
            onClick={buyNFTStep1Func}
            className="w-full"
          />
        </div>
      ) : (
        <div className={greyBoxContainer}>
          <h4 className={desTitle}>Description</h4>
          <p className={`${greyTxt} leading-6`}>{data?.description}</p>

          <div className="auctionTimerBox relative flex flex-row gap-3 overflow-hidden rounded-10px border-2 border-gray-shade-3 [@media(max-width:600px)]:!flex-col">
            <div className="iconBox flex min-w-[170px] flex-col items-center gap-3 bg-background-shade-2 p-6 text-center">
              <AuctionIcon />
              <h4 className="text-sm font-normal text-white">
                This NFT will unlock in
              </h4>
            </div>
            <div className="flex w-full justify-center p-4">
              <div className="timerBox flex items-center gap-5">
                <div className="dateBix flex flex-col items-center gap-2">
                  <h5 className="text-base font-semibold text-white f2xl:text-xl">
                    {days}
                  </h5>
                  <h6 className="text-xs font-normal text-gray-shade-7">
                    Days
                  </h6>
                </div>
                <div className="dateBix flex flex-col items-center gap-2">
                  <h5 className="text-base font-semibold text-white f2xl:text-xl">
                    {hours}
                  </h5>
                  <h6 className="text-xs font-normal text-gray-shade-7">
                    Hours
                  </h6>
                </div>
                <div className="dateBix flex flex-col items-center gap-2">
                  <h5 className="text-base font-semibold text-white f2xl:text-xl">
                    {minutes}
                  </h5>
                  <h6 className="text-xs font-normal text-gray-shade-7">
                    Minutes
                  </h6>
                </div>
                <div className="dateBix flex flex-col items-center gap-2">
                  <h5 className="text-base font-semibold text-white f2xl:text-xl">
                    {seconds}
                  </h5>
                  <h6 className="text-xs font-normal text-gray-shade-7">
                    Seconds
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {ModalModel.visibility && (
        <CustomModal
          onClose={() => {
            modal.dismissModal();
          }}
          title={ModalModel.title as any}
          disable={ModalModel.title === "Transaction in progress" ? "yes" : ""}
        >
          {ModalModel.content}
        </CustomModal>
      )}
    </div>
  );
};
// styling
const modalBodyWrapper = `
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center
`;
const footerBtnContainer = `
flex items-center gap-4 mt-3
`;
const ImgStyling = `
w-[64px] h-[64px]  rounded-2xl object-contain mx-auto
`;
const nftDescriptionContainer = `
w-full flex flex-col gap-5
`;

const greyBoxContainer = `
bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6
`;
const greyTxt = `
text-sm font-normal text-gray-shade-7
`;
const desTitle = `
text-sm font-semibold text-white
`;
const BnBNum = `
text-base font-bold text-white
`;
