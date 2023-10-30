import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useWeb3React } from "@web3-react/core";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CustomModal } from "@/components/modal/custom.modal";
import Button from "@/components/button";
import useUser from "@/hooks/use.user";
import { CollectionUploader } from "@/utils/upload.tools/collection.uploader.util";
// import { useRecaptcha } from "@/utils/google.recaptcha/google-recaptcha";
import SuccessMessageModal from "@/utils/modal/success-modal";
import TrxInProgressModal from "@/utils/modal/trx-modal";
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
      modal.dismissModal();
      modal.createModal(ModalType.buyNFTStep1FuncModal, collectionData);
    } catch (err: any) {
      toastError("something went wrong");
    }
  };
  const buyNFTSuccessFunc = (txStatus: boolean, collectionData: any) => {
    try {
      setClearForm(false);
      modal.dismissModal();
      modal.createModal(ModalType.buyNFTSuccessFuncModal, {
        txStatus,
        collectionData,
      });
    } catch (err: any) {
      !txStatus && toastError("something went wrong");
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
        getSigner()!,
        name,
        symbol,
        category,
        collectionsRemoteBasePath + collectionMetaDataPath,
        totalsupply,
        BlockchainConfig.fee.createCollectionFee
      );
      collectionCreated = true;
    } catch (error) {
      !collectionCreated &&
        toastError(
          `Something went wrong during the process, please check your data again and make sure you have enough gas fee for the transaction and try again in a few moments.`
        );
    } finally {
      buyNFTSuccessFunc(
        collectionCreated,
        `${
          collectionCreated
            ? collectionData
            : "Something went wrong, please try again"
        }`
      );
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
    validateProvider();
    modal.dismissModal();
    modal.createModal(ModalType.proceedFuncModal);
  };
  const modalTemplateCollection: TemplateCollection = {
    buyNFTStep1FuncModal: {
      title: "Complete Checkout",
      visibility: true,
      content: (collectionData: any) => (
        <div className="flex w-full flex-col px-2 pt-2 text-center fmd:px-4 fmd:pt-4">
          <Image
            className="mx-auto mb-7 mt-7 min-h-[64px] min-w-[64px] rounded-2xl object-contain"
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
        <SuccessMessageModal
          heading={
            <h2 className="text-base font-semibold text-white f2xl:text-lg">
              {txStatus ? "Collection Created Successfully" : "Failed!"}
            </h2>
          }
          subHeading={
            <p className="text-sm font-normal leading-6 text-gray-shade-2">
              Congratulations! You have successfully created{" "}
              <span className="word-break text-white">
                {collectionData?.name}
              </span>{" "}
              Collection on <b> Centher </b> platform, Click view on profile to
              view your collection.
            </p>
          }
          txStatus={txStatus}
          dismissModal={() => {
            modal.dismissModal();
            setClearForm(true);
          }}
          proceedFunc={() => {
            modal.dismissModal();
            setClearForm(true);
            router.push({
              pathname: AppRoutes.profile.collection,
              query: { user_id: connectedAddress },
            });
          }}
        />
      ),
    },
    proceedFuncModal: {
      title: "Transaction in progress",
      visibility: true,
      content: () => <TrxInProgressModal />,
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
          signer={getSigner()!}
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
const footerBtnContainer = `w-full mt-3 flex items-center gap-3`;
const dashboardContentContainer = `bg-black-shade-3 w-full h-full font-monto [@media(max-width:1279px)]:max-w-[544px] max-w-[1160px] mx-auto relative`;
const title = `textGradient font-semibold leading-[42px] pb-6 lg:text-[34px] text-2xl`;
const feedContainer = `flex flex-col lg:flex-row gap-5 lg:items-start`;
