// React, Next, NPM Packages
import { useState } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";

// App imports
import Button from "@/components/button";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CustomModal } from "@/components/modal/custom.modal";
import { BNBIcon, LoaderIcon } from "@/assets/svgs";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { NFTUploader } from "@/utils/upload.tools/nft.upload.util";
import { safeNameType } from "@/utils/upload.tools/interfaces/safe.file.wrapper.interface";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { readFileAsync } from "@/utils/file.reader.util";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { BlockchainWrite } from "@/web3/blockchain";
import { BlockchainConfig } from "@/web3/blockchain/config";

// Current page imports
import { INFTData } from "./_components/create.nft.form";
import { UploadNFT, CreateNFTForm } from "./_components";

const nftRemoteBasePath = "ipfs:/";

enum ModalType {
  buyNFTStep1FuncModal = "buyNFTStep1FuncModal",
  buyNFTSuccessFuncModal = "buyNFTSuccessFuncModal",
  proceedFuncModal = "proceedFuncModal",
}

const CreateNFT: NextPageWithLayout = () => {
  const router = useRouter();
  const [clearForm, setClearForm] = useState(false);
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const [asset, setAsset] = useState<Blob | undefined>(undefined);
  const [assetTab, setAssetTab] = useState("Image");

  const bnbPrice = useBNBPrice();

  const { account, library } = useWeb3React();
  // creating modals
  const buyNFTStep1Func = (nftData: any) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.buyNFTStep1FuncModal, nftData);
    } catch (err: any) {
      toastError(err);
    }
  };
  const buyNFTSuccessFunc = (txStatus: boolean, nftData: any) => {
    try {
      validateProvider();
      setClearForm(false);
      modal.dismissModal();
      modal.createModal(ModalType.buyNFTSuccessFuncModal, {
        txStatus,
        nftData,
      });
    } catch (err: any) {
      toastError(err);
    }
  };
  const handleCreateCollection = async (nftData: any) => {
    ProceedFunc();
    let nfdCreated = false;
    try {
      const nftUploader = new NFTUploader(nftRemoteBasePath);
      const file = await readFileAsync(asset);
      const castedNftData = nftData as INFTData;
      const nftMetadataPath = await nftUploader.uploadNFT(
        file,
        castedNftData,
        asset as any as safeNameType
      );

      const result = await BlockchainWrite.callCreateNFT(
        library,
        castedNftData.collection,
        "ipfs:/" + nftMetadataPath,
        castedNftData.supply,
        castedNftData.isAuction,
        castedNftData.price,
        castedNftData.period,
        (BlockchainConfig.fee.createItemFeeForCreator +
          BlockchainConfig.fee.createItemFeeForMarketplace) *
          castedNftData.supply
      );
      nfdCreated = !!result;
    } catch (error) {
      toastError(
        `Something went wrong during the process, please check your data again and make sure you have enough gas fee for the transaction and try again in a few moments.`
      );
    } finally {
      buyNFTSuccessFunc(nfdCreated, nftData);
    }
  };

  const createNFT = (values: INFTData) => {
    if (asset === undefined) {
      toastError("Choose file.");
      return;
    }

    validateProvider();
    buyNFTStep1Func(values);
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

  const modalTemplateCollection: TemplateCollection = {
    buyNFTStep1FuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: (nftData: any) => (
        <div className={modalBodyWrapper2}>
          <h2 className="text-18px font-semibold text-white">
            {nftData?.name}
          </h2>
          <h3 className="text-14px font-normal text-white">
            {`Marketplace fee ${normalizeValue(
              BlockchainConfig.fee.createItemFeeForMarketplace
            )} BNB`}
          </h3>
          <h6 className="text-14px flex items-center justify-center gap-2 font-bold text-white">
            <span>Price:</span>
            <BNBIcon />
            {normalizeValue(nftData?.price)} BNB{" "}
            <span className="text-gray-shade-2 ">
              {" "}
              =${Number((nftData?.price * bnbPrice).toFixed(5))}
            </span>
          </h6>
          <div className={footerBtnContainer}>
            <Button
              title={"Checkout"}
              variant="v1"
              className="py-4"
              onClick={() => handleCreateCollection(nftData)}
            />
          </div>
        </div>
      ),
    },
    buyNFTSuccessFuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: ({ txStatus, nftData }: any) => (
        <div className={modalBodyWrapper2}>
          <h2 className="text-18px font-semibold text-white">
            {txStatus ? "Success!" : "Failed!"}
          </h2>
          {txStatus && (
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              Congratulations! You have successfully created{" "}
              <span className="text-white">{nftData?.name} </span> NFT on{" "}
              <b> Centher </b> NFT platform, Click view on profile to view your
              NFT.
            </p>
          )}
          {!txStatus && (
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              Transaction Failed.
            </p>
          )}
          <div className={footerBtnContainer}>
            {txStatus ? (
              <Button
                title={"Go Back"}
                variant="v4"
                className="py-4"
                onClick={() => {
                  modal.dismissModal();
                  setClearForm(true);
                }}
              />
            ) : (
              <Button
                title={"Try Again"}
                variant="v4"
                className="py-4"
                onClick={() => {
                  modal.dismissModal();
                }}
              />
            )}

            {txStatus && (
              <Button
                title={"View on Profile"}
                variant="v1"
                className="py-4"
                onClick={() => {
                  modal.dismissModal();
                  setClearForm(true);
                  router.push(`/profile/${account}/nfts/created`);
                }}
              />
            )}
          </div>
        </div>
      ),
    },
    proceedFuncModal: {
      title: "Transaction in progress",
      visibility: true,
      content: () => (
        <div className={modalBodyWrapper2}>
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
    <div className="w-full pb-16">
      <h1 className={title}>Create an NFT</h1>
      <div className="flex items-start gap-9 [@media(max-width:1279px)]:flex-col">
        <UploadNFT
          asset={asset}
          setAsset={setAsset}
          assetTab={assetTab}
          setAssetTab={setAssetTab}
          clearForm={clearForm}
        />
        <CreateNFTForm
          createNFT={createNFT}
          clearForm={clearForm}
          asset={asset}
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

CreateNFT.getLayout = (page: any) => {
  return (
    <AllPagesWrapper pageTitle="Create NFT">
      <div className={dashboardContentContainer}>
        <div className={feedContainer}>{page}</div>
      </div>
    </AllPagesWrapper>
  );
};

export default CreateNFT;

// styling
const modalBodyWrapper2 = `flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center`;
const footerBtnContainer = `mt-3 flex flex-col-reverse fsm:flex-row gap-2`;
const dashboardContentContainer = `bg-black-shade-3 w-full h-full font-monto [@media(max-width:1279px)]:max-w-[544px] max-w-[1160px] mx-auto relative`;
const title = `textGradient font-semibold leading-[42px] pb-6 animationTextHeading lg:text-[34px] sm:text-2xl`;
const feedContainer = `flex flex-col lg:flex-row gap-5 lg:items-start`;
