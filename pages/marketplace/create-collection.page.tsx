import React, { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CustomModal } from "@/components/modal/custom.modal";
import Button from "@/components/button";
import useUser from "@/hooks/use.user";
import { LoaderIcon } from "@/assets/svgs";
import { CollectionUploader } from "@/utils/upload.tools/collection.uploader.util";
// import { useRecaptcha } from "@/utils/google.recaptcha/google-recaptcha";
import { ModalManager, IModalHandler, TemplateCollection } from "@/utils/modal";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { BlockchainWrite } from "@/web3/blockchain";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { AppRoutes } from "@/constants/app.routes";
import { ICollectionData } from "./_components/create.collection.form";
import { UploadNFTCollection, CreateNFTCollectionForm } from "./_components";
import { useWallet } from "@/web3/hooks/use.wallet";
// import GoogleReCaptchaWrapper from "./google-re-captcha-wrapper";

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
  // const { submitRecaptcha } = useRecaptcha();
  const [profile, setProfile] = useState<Blob | undefined>(undefined);
  const [cover, setCover] = useState<Blob | undefined>(undefined);
  const [clearForm, setClearForm] = useState(false);

  const router = useRouter();

  const { connectedAddress, getSigner } = useWallet();

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
    // const success = await submitRecaptcha();
    // if (!success) {
    //   toastError("Please verify you are a human!");
    //   return;
    // }
    ProceedFunc();
    let collectionCreated = false;
    try {
      collectionData = collectionData as ICollectionData;
      const collectionUploader = new CollectionUploader(
        collectionsRemoteBasePath
      );

      const uploadDto = {
        path: collectionUploader._uploader.makePath(),
        content: profile,
      };

      const profilePath = await collectionUploader._uploader.upload(uploadDto);
      const collectionMetaDataPath = await collectionUploader.uploadCollection(
        cover,
        collectionData,
        profilePath
      );

      const { name, symbol, category, totalsupply } = collectionData;

      await BlockchainWrite.callCreateCollection(
        getSigner(),
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
    if (!connectedAddress || !getSigner()) {
      toastError("Please connect your wallet for creating collection!");
      return;
    }
    if (!user) {
      toastError("Please login for creating collection!");
      return;
    }
    if (user._id.toLowerCase() !== connectedAddress.toLowerCase()) {
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

    if (!getSigner()) {
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
          <h2 className="word-break text-base font-semibold text-white f2xl:text-lg">
            {collectionData?.name}
          </h2>
          <h3 className="text-sm font-normal text-white">
            {`Marketplace fee ${normalizeValue(
              BlockchainConfig.fee.createCollectionFee
            )} BNB`}
          </h3>
          <div className={footerBtnContainer}>
            <Button
              title={"Checkout"}
              variant="primary"
              onClick={() => handleCreateCollection(collectionData)}
              className="w-full rounded-[14px]"
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
          <h2 className="text-base font-semibold text-white f2xl:text-lg">
            {txStatus ? "Collection Created Successfully" : "Failed!"}
          </h2>
          {txStatus && (
            <p className="text-sm font-normal leading-6 text-gray-shade-2">
              Congratulations! You have successfully created{" "}
              <span className="word-break text-white">
                {collectionData?.name}
              </span>{" "}
              Collection on <b> Centher </b> platform, Click view on profile to
              view your collection.
            </p>
          )}
          {!txStatus && (
            <p className="text-sm font-normal leading-6 text-gray-shade-2">
              Transaction Failed.
            </p>
          )}
          <div className={footerBtnContainer}>
            {!txStatus && (
              <Button
                title={"Try Again"}
                variant="secondary"
                onClick={() => {
                  modal.dismissModal();
                  setClearForm(true);
                }}
                className="w-full rounded-[14px]"
              />
            )}

            {txStatus && (
              <Button
                title={"View Collection"}
                variant="primary"
                onClick={() => {
                  modal.dismissModal();
                  setClearForm(true);
                  router.push({
                    pathname: AppRoutes.profile.collection,
                    query: { user_id: connectedAddress },
                  });
                }}
                className="w-full"
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
        <div className={modalBodyWrapper}>
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
          signer={getSigner()}
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
          disable={ModalModel.title === "Transaction in progress" ? "yes" : ""}
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
        {/* <GoogleReCaptchaWrapper
          reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_SITE_KEY!}
        > */}
        <div className={feedContainer}>{page}</div>
        {/* </GoogleReCaptchaWrapper> */}
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
const title = `textGradient font-semibold leading-[42px] pb-6 lg:text-[34px] sm:text-2xl`;
const feedContainer = `flex flex-col lg:flex-row gap-5 lg:items-start`;
