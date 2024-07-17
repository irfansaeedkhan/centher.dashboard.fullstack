import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Countdown from "react-countdown";
import Button from "@/components/button";
import { IModalProps } from "@/components/modal/standard.modal";
import { BNBIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import {
  formatAddress,
  formatBNB2USD,
  formatEther2Number,
} from "@/utils/format.address";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import MessageModal from "@/utils/modal/message-modal";
import TrxInProgressModal from "@/utils/modal/trx-modal";
import SuccessMessageModal from "@/utils/modal/success-modal";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { useWallet } from "@/web3/hooks/use.wallet";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";
import AuctionCountdownRenderer from "./auction-countdown.renderer";

enum ModalType {
  cancelAuctionFuncModal = "cancelAuctionFuncModal",
  proceedFuncModal = "proceedFuncModal",
  successFuncModal = "successFuncModal",
  endAuctionFuncModal = "endAuctionFuncModal",
}

interface Props {
  nft: CFSNFTForPage;
  refetchNFT: () => void;
}

export const AuctionNftDescription: React.FC<Props> = ({ nft, refetchNFT }) => {
  const { getSigner } = useWallet();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const bnbPrice = useBNBPrice();
  const hasBid = nft.auctionInfo.bids.length > 0;
  const nowTime = new Date();
  const endTime = new Date(+nft.auctionInfo.endTime * 1000);

  const cancelAuctionFunc = () => {
    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }
    try {
      modal.dismissModal();
      modal.createModal(ModalType.cancelAuctionFuncModal);
    } catch (err: any) {
      toast.error("something went wrong");
    }
  };

  const endAuctionFunc = () => {
    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }
    try {
      modal.dismissModal();
      modal.createModal(ModalType.endAuctionFuncModal);
    } catch (err: any) {
      toast.error("something went wrong");
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
      !txStatus && toast.error("Something went wrong");
    }
  };

  const handleEndAuction = async () => {
    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }

    ProceedFunc();
    const response = { success: false, message: "" };

    try {
      const result = await BlockchainWrite.callEndAuction(
        signer,
        nft.collection,
        +nft.tokenId
      );
      if (result?.length) {
        refetchNFT();
        response.success = true;
        response.message =
          "Congratulations! You have successfully ended the auction of ";
      } else throw new Error();
    } catch (err: any) {
      response.success = false;
      response.message = "something went wrong";
    } finally {
      SuccessFunc(response.success, response.message);
    }
  };

  const handleCancelAuction = async () => {
    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }

    ProceedFunc();
    const response = { success: false, message: "" };

    try {
      const result = await BlockchainWrite.callCancelAuction(
        signer,
        nft.collection,
        +nft.tokenId
      );

      if (!!result) {
        refetchNFT();
        response.success = true;
        response.message =
          "Congratulations! You have successfully canceled auction of ";
      }
    } catch (error) {
      response.success = false;
      response.message = "Failed to cancel auction";
    } finally {
      SuccessFunc(response.success, response.message);
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    cancelAuctionFuncModal: {
      title: "Cancel Auction",
      visibility: true,
      content: () => (
        <MessageModal
          heading="Are you sure you want to cancel your Auction?"
          subHeading="Canceling your auction will unpublish this sale from market and You
        will be asked to confirm the transaction through your wallet."
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={handleCancelAuction}
        />
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
            <h2 className="mt-2 text-base font-semibold text-white f2xl:text-lg">
              {txStatus ? (
                <span>
                  {msg.includes("updated")
                    ? "Auction successfully updated"
                    : msg.includes("canceled")
                    ? "Auction successfully canceled"
                    : "Auction successfully created"}
                </span>
              ) : (
                "Failed!"
              )}
            </h2>
          }
          subHeading={
            <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
              {msg}
              <span className="word-break text-white">
                {nft.ipfs_metadata.name}{" "}
              </span>{" "}
              NFT on <b> 369x </b> platform.
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
    endAuctionFuncModal: {
      title: "Announce Winner",
      visibility: true,
      content: () => (
        <MessageModal
          heading="Click Proceed to announce winner of your NFT!"
          subHeading={`Your NFT will go to{" "}
          ${formatAddress(nft.auctionInfo.highestBidAddress)} and you will
          receive ${formatEther2Number(nft.auctionInfo.highestBidPrice)} BNB`}
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={handleEndAuction}
        />
      ),
    },
  };

  const modal = new ModalManager(setModalModel, modalTemplateCollection);

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
        <h4 className={greyTxt}>Minimum Bid</h4>
        <div className="flex items-center  gap-3">
          <BNBIcon className="[&>*]:fill-[#E35259]" />
          <h5 className={`text-base font-bold text-white`}>
            {`${normalizeValue(
              formatEther2Number(nft.auctionInfo.highestBidPrice)
            )} BNB`}
          </h5>
          <h6 className={greyTxt}>
            {" "}
            =${formatBNB2USD(nft.auctionInfo.highestBidPrice, bnbPrice)}
          </h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={`text-sm font-semibold text-white`}>Description</h4>
        <p className={`${greyTxt} word-break leading-6`}>
          {nft.ipfs_metadata.description}
        </p>
        {nft.auctionInfo.endTime && (
          <Countdown
            date={new Date(+nft.auctionInfo.endTime * 1000)}
            renderer={AuctionCountdownRenderer}
          />
        )}
      </div>
      <div className="buttonContainer flex items-center gap-4">
        {nowTime < endTime && (
          <Button
            title={"Cancel Auction"}
            variant="primary"
            onClick={cancelAuctionFunc}
            className="w-full rounded-[14px]"
          />
        )}
        {nowTime > endTime && (
          <Button
            title={hasBid ? "Announce Winner" : "End Auction"}
            variant="primary"
            onClick={hasBid ? endAuctionFunc : cancelAuctionFunc}
            className="w-full rounded-[14px]"
            disabled={nowTime > new Date(+nft.auctionInfo.endTime * 1000)}
          />
        )}
      </div>
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

const greyTxt = `text-sm font-normal text-gray-shade-7`;
const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6`;
