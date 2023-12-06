import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import Button from "@/components/button";
import { IModalProps } from "@/components/modal/standard.modal";
import { CustomModal } from "@/components/modal/custom.modal";
import { BNBIcon, AuctionIcon, GreenTick, CircularClose } from "@/assets/svgs";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import SuccessMessageModal from "@/utils/modal/success-modal";
import TrxInProgressModal from "@/utils/modal/trx-modal";
import MessageModal from "@/utils/modal/message-modal";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { useGetApprovedForAll } from "@/web3/hooks/use.contracts.functions";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { BlockchainWrite } from "@/web3/blockchain";
import { TransferableTokenBlackList } from "@/web3/blockchain/helpers/blacklist.helper";
import { useWallet } from "@/web3/hooks/use.wallet";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";
import { LoggedInUser } from "@/models/user";
import ChangePriceListModal from "./change.price.list.modal";
import CreateNFTAuctionModal from "./create.nft.auction.modal";
import SendNFTModal from "./send.nft.modal";

enum ModalType {
  auctionModal = "auctionModal",
  saleWithAuction = "saleWithAuction",
  cancelAuction = "cancelAuction",
  proceedFuncModal = "proceedFuncModal",
  listingFuncModal = "listingFuncModal",
  saleWithListingModal = "saleWithListingModal",
  successFuncModal = "successFuncModal",
  successSendFuncModal = "successSendFuncModal",
}

interface Props {
  nft: CFSNFTForPage;
  loggedInUser: LoggedInUser;
  refetchNFT: () => void;
}

export const NonNFTDescription: React.FC<Props> = ({
  nft,
  loggedInUser,
  refetchNFT,
}) => {
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
  const [sendNftModal, setSendNftModal] = useState(false);
  const [transferable, setTransferable] = useState(false);
  const bnbPrice = useBNBPrice();
  const isApproved = useGetApprovedForAll(loggedInUser._id, nft.collection);

  useEffect(() => {
    if (nft) {
      setTransferable(
        !TransferableTokenBlackList.isBlocked(nft.collection, +nft.tokenId)
      );

      // TODO: Use react-countdown package
      var updateTime = setInterval(() => {
        var now = new Date().getTime();

        var difference = +nft.unlock * 1000 - now;

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
  }, [nft]);

  const handleListNFT = async (bidPrice: any) => {
    if (bidPrice) {
      modal.dismissModal();
      saleWithListing(bidPrice);
    } else {
      toast.error("Provide accurate bid price");
    }
  };

  const saleWithListing = (listingPrice: any) => {
    if (listingPrice) {
      modal.dismissModal();
      modal.createModal(ModalType.saleWithListingModal, listingPrice);
    } else {
      toast.error("Provide accurate listing price");
    }
  };

  const listingFunc = () => {
    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }
    modal.dismissModal();
    modal.createModal(ModalType.listingFuncModal);
  };

  const handleListing = async (listingPrice: any) => {
    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }

    ProceedFunc();

    let response = { success: false, message: "" };
    try {
      if (!isApproved) {
        const approveResult = await BlockchainWrite.callApproveNFTToMarketplace(
          signer,
          nft.collection
        );

        if (!approveResult?.length) {
          throw new Error();
        }
      }
      const result = await BlockchainWrite.callListItemForSale(
        signer,
        nft.collection,
        +nft.tokenId,
        listingPrice
      );

      if (result?.length) {
        refetchNFT();
        response.success = true;
        response.message = "Congratulations! You have successfully listed ";
      } else {
        throw new Error();
      }
    } catch (error) {
      response.success = false;
      response.message = "Could not list NFT for sale";
    } finally {
      SuccessFunc(response.success, response.message);
    }
  };

  const handleAuction = async (data: any) => {
    try {
      modal.dismissModal();
      modal.createModal(ModalType.saleWithAuction, data);
    } catch (err: any) {
      !data && toast.error("failed to auction");
    }
  };

  const handleAuctionProc = async (auctionPrice: any, auctionDate: any) => {
    const signer = getSigner();
    if (!signer) {
      toast.error("connect your wallet");
      return;
    }

    ProceedFunc();

    const endTime = Math.floor(auctionDate * 24 * 60 * 60);
    let response = { success: false, message: "" };
    try {
      if (!isApproved) {
        const approveResult = await BlockchainWrite.callApproveNFTToMarketplace(
          signer,
          nft.collection
        );

        if (!approveResult?.length) {
          throw new Error("something went wrong");
        }
      }

      const result = await BlockchainWrite.callCreateAuction(
        signer,
        nft.collection,
        +nft.tokenId,
        Number(auctionPrice),
        endTime
      );
      if (!!result) {
        refetchNFT();
        response.success = true;
        response.message = "Congratulations! You have successfully auctioned";
      }
    } catch (err) {
      response.success = false;
      response.message = "something went wrong with auction";
    } finally {
      SuccessFunc(response.success, response.message);
    }
  };

  const handleSendNFT = async (input: {
    ReceiverAddress: string;
    LockEndTime: number;
  }) => {
    const signer = getSigner();
    if (!signer) {
      toast.error("connect your wallet");
      return;
    }

    ProceedFunc();

    const response = { success: false, message: "" };

    try {
      if (!isApproved) {
        const approveResult = await BlockchainWrite.callApproveNFTToMarketplace(
          signer,
          nft.collection
        );

        if (!approveResult?.length) {
          throw new Error("something went wrong");
        }
      }

      const result = await BlockchainWrite.transferNftWithLock(
        signer,
        nft.collection,
        +nft.tokenId,
        input.ReceiverAddress,
        input.LockEndTime
      );

      if (!!result) {
        refetchNFT();
        response.success = true;
        response.message = "Congratulations! You have successfully sent ";
      } else {
        setSendNftModal(false);
        throw new Error();
      }
    } catch (error) {
      response.success = false;
      response.message = "failed to send nft";
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
      !txStatus && toast.error("Something went wrong");
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    auctionModal: {
      title: "Auction",
      visibility: true,
      content: () => <CreateNFTAuctionModal handleAuction={handleAuction} />,
    },
    saleWithAuction: {
      title: "Auction",
      visibility: true,
      content: ({ StartingNFTPrice, AuctionEndTime }: any) => (
        <MessageModal
          heading="Are you sure you want to setup auction?"
          subHeading={`It will be available for auction on market and You will be asked to
        confirm the transaction through your wallet.`}
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={() =>
            handleAuctionProc(StartingNFTPrice, AuctionEndTime)
          }
        />
      ),
    },
    cancelAuction: {
      title: "Cancel listing",
      visibility: true,
      content: ({ StartingNFTPrice, AuctionEndTime }: any) => (
        <MessageModal
          heading="Are you sure you want to cancel your Listing?"
          subHeading={`Canceling your listing will unpublish this sale from market and You
        will be asked to confirm the transaction through your wallet.`}
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={() =>
            handleAuctionProc(StartingNFTPrice, AuctionEndTime)
          }
        />
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
            <h2 className="text-base font-semibold text-white f2xl:text-lg">
              {txStatus ? (
                <span>
                  {msg.includes("updated")
                    ? "Listing updated successfully"
                    : msg.includes("canceled")
                    ? "Listing successfully canceled"
                    : msg.includes("sent")
                    ? "NFT sent successfully"
                    : "Listing NFT successfully"}
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
                {nft.ipfs_metadata.name}
              </span>{" "}
              NFT on <b>Centher </b>
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
    listingFuncModal: {
      title: "List for sale",
      visibility: true,
      content: () => (
        <ChangePriceListModal
          nft={nft}
          handleListNFT={handleListNFT}
          handleAuction={handleAuction}
        />
      ),
    },
    saleWithListingModal: {
      title: "List for sale",
      visibility: true,
      content: (listingPrice: any) => (
        <MessageModal
          heading="Are you sure you want to List your NFT to sell?"
          subHeading={`Listing Price will be  ${normalizeValue(
            Number(listingPrice)
          )} BNB.`}
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={() => handleListing(listingPrice)}
        />
      ),
    },
    successSendFuncModal: {
      title: "Send NFT",
      visibility: true,
      content: ({ txStatus, msg }: IModalProps) => (
        <div
          className={`flex w-full flex-col gap-2 px-2 pt-2 text-center fmd:px-4 fmd:pt-4`}
        >
          <div className="flex flex-col items-center justify-center">
            {txStatus ? <GreenTick /> : <CircularClose />}
            <h2 className="text-base font-semibold text-white f2xl:text-lg">
              {txStatus ? <span>NFT Send Successfully!</span> : "Failed!"}
            </h2>
          </div>
          {txStatus && (
            <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
              {msg}
            </p>
          )}
          {!txStatus && (
            <p className="text-xs font-normal leading-6 text-gray-shade-2 fmd:text-sm">
              {msg ?? "Transaction Failed."}
            </p>
          )}
          <div className={`mt-2 flex items-center gap-4`}>
            <Button
              title={"View item"}
              variant="primary"
              onClick={() => {
                modal.dismissModal();
                window.location.reload();
              }}
              className="w-full"
            />
          </div>
        </div>
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
        <h4 className={greyTxt}>Current Price</h4>
        <div className="flex items-center gap-3">
          <BNBIcon />
          <h5 className={`text-base font-bold text-white`}>
            {`${normalizeValue(formatEther2Number(nft.listInfo.price))} BNB`}
          </h5>
          <h6 className={greyTxt}>
            {" "}
            =${formatBNB2USD(nft.listInfo.price, bnbPrice)}
          </h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={`text-sm font-semibold text-white`}>Description</h4>
        <p
          className={clsx(greyTxt, `word-break whitespace-pre-wrap leading-6`)}
        >
          {nft.ipfs_metadata.description}
        </p>
      </div>
      {+nft.unlock < +new Date() / 1000 ? (
        <div className="buttonContainer flex items-center gap-4">
          <Button
            title="Sell"
            onClick={listingFunc}
            variant="primary"
            className="h-11 w-full"
            borderRounded="14px"
          />
          {transferable && (
            <Button
              title={"Send"}
              onClick={() => setSendNftModal(true)}
              variant="secondary"
              className="h-11 w-full rounded-[14px]"
            />
          )}
        </div>
      ) : (
        <div className={greyBoxContainer}>
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
      {sendNftModal && (
        <SendNFTModal
          nft={nft}
          handleSend={handleSendNFT}
          onClose={() => {
            setSendNftModal(false);
          }}
        />
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

const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6`;
const greyTxt = `text-sm font-normal text-gray-shade-7`;
