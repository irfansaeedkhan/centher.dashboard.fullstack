import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Image from "next/image";
import { NextPageWithLayout } from "@/pages/_app.page";
import Button from "@/components/button";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CustomModal } from "@/components/modal/custom.modal";
import { BNBIcon, LoaderIcon, GreenTick, CircularClose } from "@/assets/svgs";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import useUser from "@/hooks/use.user";
import { NFTUploader } from "@/utils/upload.tools/nft.upload.util";
import { safeNameType } from "@/utils/upload.tools/interfaces/safe.file.wrapper.interface";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { BlockchainWrite } from "@/web3/blockchain";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { INFTData } from "./_components/create.nft.form";
import { UploadNFT, CreateNFTForm } from "./_components";
import { customLog } from "@/utils/custom.log";
import { useWallet } from "@/web3/hooks/use.wallet";

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

  const { connectedAddress, getSigner } = useWallet();
  const { user } = useUser();
  // creating modals
  const buyNFTStep1Func = (nftData: any) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.buyNFTStep1FuncModal, nftData);
    } catch (err: any) {
      toastError("something went wrong");
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
      toastError("something went wrong");
    }
  };
  const handleCreateCollection = async (nftData: any) => {
    // const success = await submitRecaptcha();
    // if (!success) {
    //   toastError("Please verify you are not a robot");
    //   return;
    // }

    ProceedFunc();
    let nfdCreated = false;
    try {
      const nftUploader = new NFTUploader(nftRemoteBasePath);
      const castedNftData = nftData as INFTData;
      const nftMetadataPath = await nftUploader.uploadNFT(
        asset,
        castedNftData,
        asset as any as safeNameType
      );

      const result = await BlockchainWrite.callCreateNFT(
        getSigner(),
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
    } catch (error: any) {
      customLog(["development", "staging"], error);
      toastError(
        `Something went wrong during the process, please check your data again and make sure you have enough gas fee for the transaction and try again in a few moments.`
      );
    } finally {
      buyNFTSuccessFunc(nfdCreated, nftData);
    }
  };

  const createNFT = (values: INFTData) => {
    if (!connectedAddress || !getSigner()) {
      toastError("Please connect your wallet for creating NFT!");
      return;
    }
    if (!user) {
      toastError("Please login for creating NFT!");
      return;
    }
    if (user._id.toLowerCase() !== connectedAddress.toLowerCase()) {
      toastError("Please connect your wallet to correct account!");
      return;
    }
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
      toastError("something went wrong");
    }
  };

  const modalTemplateCollection: TemplateCollection = {
    buyNFTStep1FuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: (nftData: any) => {
        const src = asset ? URL.createObjectURL(asset) : "";
        return (
          <div className={modalBodyWrapper2}>
            <div className="mb-4 flex w-full justify-center">
              <Image
                src={src}
                alt="nft"
                width={64}
                height={64}
                className="h-16 w-16 rounded-xl object-cover"
              />
            </div>
            <h2 className="word-break text-base font-semibold text-white f2xl:text-lg">
              {nftData?.name}
            </h2>
            <h3 className="text-sm font-normal text-white">
              {`Marketplace fee ${normalizeValue(
                BlockchainConfig.fee.createItemFeeForMarketplace
              )} BNB`}
            </h3>
            <h6 className="mt-2 flex items-center justify-center gap-2 text-sm font-bold text-white">
              <span>Price:</span>
              <BNBIcon />
              {normalizeValue(nftData?.price)} BNB{" "}
              <span className="text-gray-shade-2 ">
                {" "}
                =
                <span className="font-normal">
                  ${Number((nftData?.price * bnbPrice).toFixed(5))}
                </span>
              </span>
            </h6>
            <div className={footerBtnContainer}>
              <Button
                title={"Checkout"}
                variant="primary"
                className="w-full"
                onClick={() => handleCreateCollection(nftData)}
              />
            </div>
          </div>
        );
      },
    },
    buyNFTSuccessFuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: ({ txStatus, nftData }: any) => (
        <div className={modalBodyWrapper2}>
          <div className="flex flex-col items-center justify-center">
            {txStatus ? <GreenTick /> : <CircularClose />}
            <h2 className="mt-2 text-base font-semibold text-white f2xl:text-lg">
              {txStatus ? "NFT Created Successfully" : "Failed!"}
            </h2>
          </div>
          {txStatus && (
            <p className="mt-2 text-sm font-normal leading-6 text-gray-shade-2">
              Congratulations! You have successfully created{" "}
              <span className="word-break text-white">{nftData?.name} </span>{" "}
              NFT on <b> Centher </b> NFT platform, Click view on profile to
              view your NFT.
            </p>
          )}
          {!txStatus && (
            <p className="text-sm font-normal leading-6 text-gray-shade-2">
              Transaction Failed.
            </p>
          )}
          <div className={footerBtnContainer}>
            {txStatus ? (
              <Button
                title={"View on Profile"}
                variant="primary"
                className="w-full"
                onClick={() => {
                  modal.dismissModal();
                  setClearForm(true);
                  router.push(`/profile/${connectedAddress}/nfts/created`);
                }}
              />
            ) : (
              <Button
                title={"Try Again"}
                variant="secondary"
                className="w-full"
                onClick={() => {
                  modal.dismissModal();
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
          <h3 className="text-base font-semibold leading-6 text-white f2xl:text-lg">
            Transaction in progress
          </h3>
          <p className="text-sm font-normal leading-6 text-gray-shade-2">
            Your transaction is in progress, Please wait.
          </p>
        </div>
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
          library={getSigner()}
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
          title={ModalModel.title as string}
          disable={ModalModel.title === "Transaction in progress" ? "yes" : ""}
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
        {/* <GoogleReCaptchaWrapper
          reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_SITE_KEY!}
        > */}
        <div className={feedContainer}>{page}</div>
        {/* </GoogleReCaptchaWrapper> */}
      </div>
    </AllPagesWrapper>
  );
};

export default CreateNFT;

// styling
const modalBodyWrapper2 = `flex flex-col gap-2 w-full mt-8 text-center`;
const footerBtnContainer = `mt-4 flex flex-col-reverse fsm:flex-row gap-2`;
const dashboardContentContainer = `bg-black-shade-3 w-full h-full font-monto [@media(max-width:1279px)]:max-w-[544px] max-w-[1160px] mx-auto relative`;
const title = `textGradient font-semibold leading-[42px] pb-6 lg:text-[34px] sm:text-2xl`;
const feedContainer = `flex flex-col lg:flex-row gap-5 lg:items-start`;
