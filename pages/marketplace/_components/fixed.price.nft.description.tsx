import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import Button from "@/components/button";
import { IModalProps } from "@/components/modal/standard.modal";
import { CustomModal } from "@/components/modal/custom.modal";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { formatBNB2USD, formatEther2Number } from "@/utils/format.address";
import TrxInProgressModal from "@/utils/modal/trx-modal";
import MessageModal from "@/utils/modal/message-modal";
import SuccessMessageModal from "@/utils/modal/success-modal";
import { BNBIcon } from "@/assets/svgs";
import { BlockchainWrite } from "@/web3/blockchain";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { useWallet } from "@/web3/hooks/use.wallet";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";
import ChangePriceBidModal from "./change.price.bid.modal";

enum ModalType {
  cancelPrice = "cancelPrice",
  bidNft = "bidNft",
  editListing = "editListing",
  inProgress = "inProgress",
  success = "success",
  migrate = "migrate",
}

interface Props {
  nft: CFSNFTForPage;
  refetchNFT: () => void;
}

export const FixedPriceNFTDescription: React.FC<Props> = ({
  nft,
  refetchNFT,
}) => {
  const { getSigner } = useWallet();
  const bnbPrice = useBNBPrice();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });

  // Marketplace-grill Q10/Q11: this panel renders again now that the
  // saleState vocabulary is aligned, but the legacy chain actions must
  // NOT come back with it. The old mount effect auto-opened a "Migrate
  // NFT" modal (backed by a chain read with a possibly-null signer and
  // a uuid as contract address) for every owner of a listed NFT — it is
  // removed entirely. Edit/cancel below call the legacy contracts too;
  // listing management has no DB endpoints yet (grill Q8, a pending
  // product decision), so both actions are visibly disabled with the
  // reason stated, and their modals can never open.

  const setupCancelItemPriceModal = () => {
    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }
    try {
      modal.createModal(ModalType.cancelPrice);
    } catch (err: any) {
      toast.error("something went wrong, please try again later");
    }
  };

  const setupBidNftModal = () => {
    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }
    try {
      modal.createModal(ModalType.bidNft);
    } catch (err: any) {
      toast.error("something went wrong, please try again later");
    }
  };

  const setupEditListingItemPriceModal = (bidPrice: number) => {
    try {
      modal.dismissModal();
      modal.createModal(ModalType.editListing, bidPrice);
    } catch (err: any) {
      toast.error("something went wrong, please try again later");
    }
  };

  const setupWaitingModal = () => {
    modal.createModal(ModalType.inProgress);
  };

  const setupSuccessModal = (txStatus: boolean, msg: string) => {
    try {
      modal.createModal(ModalType.success, { txStatus, msg });
    } catch (err: any) {
      toast.error("something went wrong, please try again later");
    }
  };

  const handleCancelListing = async () => {
    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }

    setupWaitingModal();
    const response = { success: false, message: "" };

    try {
      const result = await BlockchainWrite.callCancelItemForSale(
        signer,
        nft.collection,
        +nft.tokenId
      );

      if (!!result) {
        refetchNFT();
        response.success = true;
        response.message =
          "Congratulations! You have successfully canceled your listing of NFT ";
      } else throw new Error();
    } catch (error) {
      response.success = false;
      response.message =
        "Something went wrong. canceling your listing failed. please refresh the page or try later.";
    } finally {
      setupSuccessModal(response.success, response.message);
    }
  };

  const handleEditPrice = async (newPrice: any) => {
    if (!newPrice) {
      toast.error("Please enter a valid price");
      return;
    }

    const signer = getSigner();
    if (!signer) {
      toast.error("Connect your wallet");
      return;
    }

    let result;
    const response = { success: false, message: "" };
    setupWaitingModal();

    try {
      result = await BlockchainWrite.callEditItemForSale(
        signer,
        nft.collection,
        +nft.tokenId,
        newPrice
      );

      if (!!result) {
        refetchNFT();
        response.success = true;
        response.message =
          "Congratulations! You have successfully updated price of your NFT ";
      } else {
        throw new Error();
      }
    } catch (err) {
      response.success = false;
      response.message =
        "Something went wrong. please refresh the page or try later.";
    } finally {
      setupSuccessModal(response.success, response.message);
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    cancelPrice: {
      title: "Cancel listing",
      visibility: true,
      content: () => (
        <MessageModal
          heading="Are you sure you want to cancel your Listing?"
          subHeading={`Canceling your listing will unpublish this sale from market and You
        will be asked to confirm the transaction through your wallet.`}
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={handleCancelListing}
        />
      ),
    },
    bidNft: {
      title: "Edit listing",
      visibility: true,
      content: () => (
        <ChangePriceBidModal
          nft={nft}
          setupEditListingItemPriceModal={setupEditListingItemPriceModal}
        />
      ),
    },
    editListing: {
      title: "Edit listing",
      visibility: true,
      content: (newPrice: any) => (
        <MessageModal
          heading="Are you sure you want to edit your Listing Price?"
          subHeading={`Listing Price will be changed.`}
          dismissModal={() => {
            modal.dismissModal();
          }}
          proceedFunc={() => handleEditPrice(newPrice)}
        />
      ),
    },
    inProgress: {
      title: "Transaction in progress",
      visibility: true,
      content: () => <TrxInProgressModal />,
    },
    success: {
      title: "Complete Checkout",
      visibility: true,
      content: ({ txStatus, msg }: IModalProps) => (
        <SuccessMessageModal
          heading={
            <h2 className="text-18px mt-2 font-semibold text-white">
              {txStatus ? (
                <span>
                  {msg.includes("updated")
                    ? "Listing updated successfully"
                    : msg.includes("canceled")
                    ? "Listing successfully canceled"
                    : "Listing NFT successfully"}
                </span>
              ) : (
                "Failed!"
              )}
            </h2>
          }
          subHeading={
            <p className="text-sm font-normal leading-6 text-gray-shade-2">
              {msg}{" "}
              <span className="word-break text-white">
                {nft.ipfs_metadata.name}
              </span>{" "}
              on
              <b> {process.env.NEXT_PUBLIC_BRAND_NAME} </b> NFT platform.
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
        <div className="flex flex-col items-start gap-3 fsm:flex-row  fsm:items-center">
          <div className="flex items-center gap-2">
            <BNBIcon />
            <h5 className={`text-base font-bold text-white`}>
              {`${normalizeValue(formatEther2Number(nft.listInfo.price))} BNB`}
            </h5>
          </div>
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
      <div className="buttonContainer flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Button
            title={"Cancel Listing"}
            variant="secondary"
            disabled
            onClick={setupCancelItemPriceModal}
            className="w-full rounded-[14px]"
          />
          <Button
            title={"Edit"}
            disabled
            onClick={() => {
              setupBidNftModal();
            }}
            variant="primary"
            className="w-full"
          />
        </div>
        <p className={greyTxt}>
          Editing or canceling a listing isn&apos;t available for marketplace
          items yet.
        </p>
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

const greyBoxContainer = `bg-background-shade-3 rounded-10px flex flex-col gap-2 p-3 fsm:p-6`;
const greyTxt = `text-sm font-normal text-gray-shade-7`;
