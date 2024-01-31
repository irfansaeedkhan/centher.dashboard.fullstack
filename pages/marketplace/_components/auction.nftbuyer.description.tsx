import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";
import toast from "react-hot-toast";
import { IModalProps } from "@/components/modal/standard.modal";
import Button from "@/components/button";
import { BNBIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import {
  formatAddress,
  formatBNB2USD,
  formatEther2Number,
} from "@/utils/format.address";
import TrxInProgressModal from "@/utils/modal/trx-modal";
import MessageModal from "@/utils/modal/message-modal";
import SuccessMessageModal from "@/utils/modal/success-modal";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { useGetBNBBalance } from "@/web3/hooks/use.get.balances";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { useWallet } from "@/web3/hooks/use.wallet";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import AuctionBidModal from "@/pages/marketplace/_components/auction.bid.modal";
import AuctionCountdownRenderer from "@/pages/marketplace/_components/auction-countdown.renderer";
import { ConnectWalletComp } from "@/components/connect.wallet";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";

enum ModalType {
  proceedFuncModal = "proceedFuncModal",
  successFuncModal = "successFuncModal",
  endAuctionFuncModal = "endAuctionFuncModal",
}

interface Props {
  nft: CFSNFTForPage;
  refetchNFT: () => void;
}

export const AuctionNFTBuyerDescription: React.FC<Props> = ({
  nft,
  refetchNFT,
}) => {
  const { getSigner, connectedAddress, connectWallet } = useWallet();
  const bnbBalance = useGetBNBBalance(connectedAddress);
  const bnbPrice = useBNBPrice();
  const price =
    Number(nft.auctionInfo.highestBidPrice) === 0
      ? nft.auctionInfo.startPrice
      : nft.auctionInfo.highestBidPrice;
  const nowTime = new Date();
  const endTime = new Date(+nft.auctionInfo.endTime * 1000);
  const [bidModal, setBidModal] = useState(false);
  const [isUserWinner, SetIsUserWinner] = useState(false);
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });

  useEffect(() => {
    if (
      connectedAddress?.toLowerCase() ==
      nft.auctionInfo.highestBidAddress?.toLowerCase()
    ) {
      SetIsUserWinner(true);
    }
  }, [connectedAddress, nft]);

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

  const SuccessFunc = (txStatus: boolean, msg: string) => {
    try {
      modal.dismissModal();
      modal.createModal(ModalType.successFuncModal, { txStatus, msg });
    } catch (err: any) {
      !txStatus && toast.error("Something went wrong, please try again later.");
    }
  };

  const ProceedFunc = () => {
    modal.dismissModal();
    modal.createModal(ModalType.proceedFuncModal);
  };

  const onSubmit = async (bidPriceVal: any) => {
    if (Number(bidPriceVal) <= formatEther2Number(price)) {
      toast.error(
        `Bid price must be greater than ${formatEther2Number(price)}.`
      );
      return;
    }
    if (bnbBalance < Number(bidPriceVal)) {
      toast.error("Insufficient BNB Balance in your wallet.");
      return;
    }

    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }

    const response = { success: false, message: "" };
    setBidModal(false);
    ProceedFunc();

    try {
      const result = await BlockchainWrite.callBidOnAuction(
        signer,
        nft.collection,
        +nft.tokenId,
        bidPriceVal
      );

      if (!!result?.length) {
        refetchNFT();
        response.success = true;
        response.message = "Bid placed successfully on auctioned on ";
      } else throw new Error();
    } catch (error) {
      response.success = false;
      response.message = "Something went wrong, auction failed";
    } finally {
      SuccessFunc(response.success, response.message);
    }
  };

  const handleEndAuction = async () => {
    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }

    const response = { success: false, message: "" };
    ProceedFunc();

    try {
      const result = await BlockchainWrite.callEndAuction(
        signer,
        nft.collection,
        +nft.tokenId
      );
      if (result?.length) {
        refetchNFT();
        response.success = true;
        response.message = "Auction has ended for ";
      } else throw new Error();
    } catch (err: any) {
      response.success = false;
      response.message = "Something went wrong";
    } finally {
      SuccessFunc(response.success, response.message);
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
      toast.error("Could not end auction");
    }
  };

  const modalTemplateCollection: TemplateCollection = {
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
            <h2 className="text-18px mt-2 font-semibold text-white">
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
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              {msg}{" "}
              <span className="word-break text-white">
                {nft.ipfs_metadata.name}{" "}
              </span>{" "}
              NFT on <b> Centher </b>
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
    endAuctionFuncModal: {
      title: "Collect NFT",
      visibility: true,
      content: () => (
        <MessageModal
          heading="Click Proceed to collect your NFT!"
          subHeading={`${formatAddress(nft.owner)} receives
        ${formatEther2Number(nft.auctionInfo.highestBidPrice)} BNB and you
        will receive the NFT`}
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={handleEndAuction}
        />
      ),
    },
  };

  const modal = new ModalManager(setModalModel, modalTemplateCollection);

  return (
    <div className={`flex w-full flex-col gap-5`}>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Minimum Bid</h4>
        <div className="flex items-center  gap-3">
          <BNBIcon className="[&>*]:fill-[#E35259]" />
          <h5 className={`text-base font-bold text-white`}>
            {`${normalizeValue(formatEther2Number(price))} BNB`}
          </h5>
          <h6 className={greyTxt}> =${formatBNB2USD(price, bnbPrice)}</h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
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
      {!getSigner() ? (
        <ConnectWalletComp
          authType="login"
          connectWallet={connectWallet}
          className="w-full rounded-[14px]"
        />
      ) : (
        <div className="buttonContainer flex items-center">
          {nowTime < endTime && (
            <Button
              title={"Place bid"}
              variant={"primary"}
              className="w-full rounded-[14px]"
              onClick={() => {
                if (!getSigner()) {
                  toast.error("Connect your wallet");
                  return;
                }
                setBidModal(true);
              }}
            />
          )}
          {nowTime > endTime && isUserWinner && (
            <Button
              title={"Claim NFT"}
              variant={"primary"}
              className="w-full rounded-[14px]"
              onClick={endAuctionFunc}
            />
          )}
          {nowTime > endTime && !isUserWinner && (
            <div
              className={`flex w-full flex-col items-center gap-2 rounded-10px bg-background-shade-3 p-6`}
            >
              <p className={desTitle}>
                This NFT no longer available for bidding
              </p>
            </div>
          )}
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

      {bidModal && (
        <AuctionBidModal
          onSubmit={onSubmit}
          onClose={() => {
            setBidModal(false);
          }}
        />
      )}
    </div>
  );
};

const desTitle = `text-sm font-semibold text-white`;
const greyTxt = `text-sm font-normal text-gray-shade-7`;
const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6`;
