// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

// App imports
import { useWeb3React } from "@web3-react/core";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CustomModal } from "@/components/modal/custom.modal";
import useUser from "@/hooks/use.user";
import { LoaderIcon } from "@/assets/svgs";
import { CollectionUploader } from "@/utils/upload.tools/collection.uploader.util";
import { readFileAsync } from "@/utils/file.reader.util";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { UploadNFTCollection, CreateNFTCollectionForm } from "./_components";
import { ICollectionData } from "./_components/create.collection.form";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { BlockchainWrite } from "@/web3/blockchain";
import { BlockchainConfig } from "@/web3/blockchain/config";
import NewButton from "@/components/button/new.button";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const collectionsRemoteBasePath = "ipfs:/";
enum ModalType {
  buyNFTStep1FuncModal = "buyNFTStep1FuncModal",
  buyNFTSuccessFuncModal = "buyNFTSuccessFuncModal",
  proceedFuncModal = "proceedFuncModal",
}

const CreateNFTCollection: NextPageWithLayout = () => {
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const [profile, setProfile] = useState<Blob | undefined>(undefined);
  const [cover, setCover] = useState<Blob | undefined>(undefined);
  const [clearForm, setClearForm] = useState(false);

  const router = useRouter();

  const { account, library } = useWeb3React();
  const { user } = useUser();
  // creating modals
  const buyNFTStep1Func = (collectionData: any) => {
    try {
      validateProvider();
      modal.dismissModal();
      modal.createModal(ModalType.buyNFTStep1FuncModal, collectionData);
    } catch (err: any) {
      toastError("something went wrong");
    }
  };
  const buyNFTSuccessFunc = (txStatus: boolean, collectionData: any) => {
    try {
      validateProvider();
      setClearForm(false);
      modal.dismissModal();
      modal.createModal(ModalType.buyNFTSuccessFuncModal, {
        txStatus,
        collectionData,
      });
    } catch (err: any) {
      toastError("something went wrong");
    }
  };
  const handleCreateCollection = async (collectionData: any) => {
    ProceedFunc();
    let collectionCreated = false;
    try {
      collectionData = collectionData as ICollectionData;
      const collectionUploader = new CollectionUploader(
        collectionsRemoteBasePath
      );

      const assetBuffer = await readFileAsync(profile);
      const uploadDto = {
        path: collectionUploader._uploader.makePath(),
        content: assetBuffer.toString("base64"),
      };

      const profilePath = await collectionUploader._uploader.upload(uploadDto);
      const coverBuffer = await readFileAsync(cover);
      const collectionMetaDataPath = await collectionUploader.uploadCollection(
        coverBuffer,
        collectionData,
        profilePath
      );

      const { name, symbol, category, totalsupply } = collectionData;

      await BlockchainWrite.callCreateCollection(
        library,
        name,
        symbol,
        category,
        collectionsRemoteBasePath + collectionMetaDataPath,
        totalsupply,
        BlockchainConfig.fee.createCollectionFee
      );
      collectionCreated = true;
    } catch (error) {
      toastError(
        `Something went wrong during the process, please check your data again and make sure you have enough gas fee for the transaction and try again in a few moments.`
      );
    } finally {
      buyNFTSuccessFunc(collectionCreated, collectionData);
    }
  };
  const createCollection = (values: ICollectionData) => {
    if (!account || !library) {
      toastError("Please connect your wallet for creating collection!");
      return;
    }
    if (!user) {
      toastError("Please login for creating collection!");
      return;
    }
    if (user.account_address.toLowerCase() !== account.toLowerCase()) {
      toastError("Please connect your wallet to correct account!");
      return;
    }
    if (profile === undefined) {
      toastError("Choose profile image.");
      return;
    }
    if (cover === undefined) {
      toastError("Choose banner image.");
      return;
    }

    if (!library) {
      toastError("Connect your wallet");
      return;
    }
    // setCollectionData(values)
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
      content: (collectionData: any) => (
        <div className={modalBodyWrapper}>
          <Image
            className={ImgStyling}
            src={URL.createObjectURL(profile as Blob)}
            alt="image"
            height={64}
            width={64}
          />
          <h2 className="text-18px word-break font-semibold text-white">
            {collectionData?.name}
          </h2>
          <h3 className="text-14px font-normal text-white">
            {`Marketplace fee ${normalizeValue(
              BlockchainConfig.fee.createCollectionFee
            )} BNB`}
          </h3>
          <div className={footerBtnContainer}>
            <NewButton
              title={"Checkout"}
              variant="v1"
              onClick={() => handleCreateCollection(collectionData)}
            />
          </div>
        </div>
      ),
    },
    buyNFTSuccessFuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: ({ txStatus, collectionData }: any) => (
        <div className={modalBodyWrapper}>
          <Image
            className={ImgStyling}
            src={URL.createObjectURL(profile as Blob)}
            alt="image"
            height={64}
            width={64}
          />
          <h2 className="text-18px font-semibold text-white">
            {txStatus ? "Success!" : "Failed!"}
          </h2>
          {txStatus && (
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              Congratulations! You have successfully created{" "}
              <span className="word-break text-white">
                {collectionData?.name}
              </span>{" "}
              Collection on <b> Centher </b> platform, Click view on profile to
              view your collection.
            </p>
          )}
          {!txStatus && (
            <p className="text-14px font-normal leading-6 text-gray-shade-2">
              Transaction Failed.
            </p>
          )}
          <div className={footerBtnContainer}>
            <NewButton
              title={txStatus ? "Go Back" : "Try Again"}
              variant="v4"
              onClick={() => {
                modal.dismissModal();
                setClearForm(true);
              }}
            />

            {txStatus && (
              <NewButton
                title={"View on Profile"}
                variant="v1"
                onClick={() => {
                  modal.dismissModal();
                  setClearForm(true);
                  router.push(`/profile/${account}/nfts/collection`);
                }}
              />
            )}
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
      <h1 className={title}>Create New Collection</h1>
      <div className="flex items-start gap-9 [@media(max-width:1279px)]:flex-col">
        <UploadNFTCollection
          profile={profile}
          setProfile={setProfile}
          cover={cover}
          setCover={setCover}
          clearForm={clearForm}
        />
        <CreateNFTCollectionForm
          createCollection={createCollection}
          library={library}
          clearForm={clearForm}
          profile={profile}
          cover={cover}
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

CreateNFTCollection.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Create Collection">
      <div className={dashboardContentContainer}>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.GOOGLE_SITE_KEY!}
          scriptProps={{
            async: false,
            defer: false,
            appendTo: "head",
            nonce: undefined,
          }}
        >
          <div className={feedContainer}>{page}</div>
        </GoogleReCaptchaProvider>
      </div>
    </AllPagesWrapper>
  );
};

export default CreateNFTCollection;

// styling
const modalBodyWrapper = `flex flex-col gap-4 w-full fmd:px-4 px-2 fmd:pt-4 pt-2 text-center`;
const footerBtnContainer = `w-full mt-3 flex items-center gap-3`;
const ImgStyling = `w-[64px] h-[64px] rounded-2xl object-contain mx-auto`;
const dashboardContentContainer = `bg-black-shade-3 w-full h-full font-monto [@media(max-width:1279px)]:max-w-[544px] max-w-[1160px] mx-auto relative`;
const title = `textGradient font-semibold leading-[42px] pb-6 animationTextHeading lg:text-[34px] sm:text-2xl`;
const feedContainer = `flex flex-col lg:flex-row gap-5 lg:items-start`;
