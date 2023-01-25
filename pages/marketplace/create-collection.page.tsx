// React, Next, NPM Packages
import { useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import Image from "next/image";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

// App imports
import { useWeb3React } from "@web3-react/core";
import { callCreateCollection } from "@/web3/utils/call.helpers";
import Button from "@/components/button";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CustomModal } from "@/components/modal/custom.modal";
import { FEE } from "@/web3/constants/common";
import { LoaderIcon } from "@/assets/svgs";
import { CollectionUploader } from "@/utils/upload.tools/collection.uploader.util";
import { readFileAsync } from "@/utils/file.reader.util";

import { UploadNFTCollection, CreateNFTCollectionForm } from "./_components";
import { ICollectionData } from "./_components/create.collection.form";

const collectionsRemoteBasePath = "ipfs:/";

const CreateNFTCollection: NextPageWithLayout = () => {
  const [loadingState, setLoadingState] = useState(false);
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalDisable, setModalDisable] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const [profile, setProfile] = useState<Blob | undefined>(undefined);
  const [cover, setCover] = useState<Blob | undefined>(undefined);
  const [clearForm, setClearForm] = useState(false);

  const router = useRouter();

  // const [collectionData, setCollectionData] = useState<ICollectionData>()

  const { account, library } = useWeb3React();

  // creating modals
  const buyNFTStep1Func = (collectionData: any) => {
    setModalTitle("Complete Checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <Image
          className={ImgStyling}
          src={URL.createObjectURL(profile as Blob)}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px text-white font-semibold">
          {collectionData?.name}
        </h2>
        <h3 className="text-white text-14px font-normal">{`Marketplace fee ${FEE.createCollectionFee} BNB`}</h3>
        {/* <h6 className="text-white text-14px font-bold flex items-center gap-2 justify-center">
          <span>Price:</span>
          <BNBIcon />
          {collectionData?.price} BNB <span className="text-gray-shade-2 "> =${formatBNB2USD(collectionData?.price)}</span>
        </h6> */}
        <div className={footerBtnContainer}>
          <Button
            title={"Checkout"}
            variant="v1"
            className="py-4"
            onClick={() => handleCreateCollection(collectionData)}
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const buyNFTStep2Func = () => {
    setModalTitle("Complete Checkout");
    setModalDisable("yes");
    setModalContent(
      <div className={modalBodyWrapper}>
        <LoaderIcon className="mx-auto animate-spin" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Transaction in progress
        </h3>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Your transaction is in progress, Please wait.
        </p>
        {/* <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Transaction Hash
          <span className="text-yellow-theme ml-2">0x1204...23b350</span>
        </p> */}
        {/* <div className={footerBtnContainer}>
          <Button
            title={"Cancel"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
        </div> */}
      </div>
    );
    setModal(true);
  };
  const buyNFTSuccessFunc = (txStatus: boolean, collectionData: any) => {
    setClearForm(false);
    setModalTitle("Complete Checkout");
    setModalDisable("");
    setModalContent(
      <div className={modalBodyWrapper}>
        <Image
          className={ImgStyling}
          src={URL.createObjectURL(profile as Blob)}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px text-white font-semibold">
          {txStatus ? "Success!" : "Failed!"}
        </h2>
        {txStatus && (
          <p className="text-gray-shade-2 text-14px font-normal leading-6">
            Congratulations! You have successfully created{" "}
            <span className="text-white">{collectionData?.name}</span>{" "}
            Collection on <b>Centher</b> platform, Click view on profile to view
            your collection.
          </p>
        )}
        {!txStatus && (
          <p className="text-gray-shade-2 text-14px font-normal leading-6">
            Transaction Failed.
          </p>
        )}
        <div className={footerBtnContainer}>
          <Button
            title={txStatus ? "Go Back" : "Try Again"}
            variant="v4"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalDisable("");
              setModalContent(null);
              setClearForm(true);
            }}
          />

          {txStatus && (
            <Button
              title={"View on Profile"}
              variant="v1"
              className="py-4"
              onClick={() => {
                setModal(false);
                setModalTitle("");
                setModalContent(null);
                setClearForm(true);
                router.push(`/profile/${account}/collections`);
              }}
            />
          )}
        </div>
      </div>
    );
    setModal(true);
  };
  const handleCreateCollection = async (collectionData: any) => {
    buyNFTStep2Func();
    let collectionCreated = false;
    try {
      collectionData = collectionData as ICollectionData;
      const collectionUploader = new CollectionUploader(
        collectionsRemoteBasePath
      );

      const assetBuffer = await readFileAsync(profile);
      const uploadDto = {
        path: collectionUploader._uploader.makePath(
          profile as any as { name: string }
        ),
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
      const result = await callCreateCollection(
        library,
        name,
        symbol,
        category,
        collectionsRemoteBasePath + collectionMetaDataPath,
        totalsupply,
        FEE.createCollectionFee
      );
      collectionCreated = result.success;
    } catch (error) {
      console.error(error);
      toast.error(
        "Something went wrong while create a collection. Please try again."
      );
    } finally {
      buyNFTSuccessFunc(collectionCreated, collectionData);
    }
  };
  const createCollection = (values: ICollectionData) => {
    if (profile === undefined) {
      toast.error("Choose profile image.");
      return;
    }
    if (cover === undefined) {
      toast.error("Choose banner image.");
      return;
    }

    if (!library) {
      toast.error("Confirm your Wallet Connection.");
      return;
    }
    // setCollectionData(values)
    buyNFTStep1Func(values);
  };

  // useEffect(() => {
  //   if(collectionData as ICollectionData && library) {
  //     buyNFTStep1Func()
  //   }
  // }, [collectionData, library])

  return (
    <div className="w-full pb-16">
      <h1 className={title}>Create New Collection</h1>
      <div className="flex gap-9 items-start [@media(max-width:1279px)]:flex-col">
        <UploadNFTCollection
          profile={profile}
          setProfile={setProfile}
          cover={cover}
          setCover={setCover}
          clearForm={clearForm}
        />
        <CreateNFTCollectionForm
          createCollection={createCollection}
          clearForm={clearForm}
        />
      </div>

      {Modal && (
        <CustomModal
          onClose={() => {
            setModal(false);
          }}
          title={ModalTitle}
          disable={ModalDisable}
        >
          {ModalContent}
        </CustomModal>
      )}
    </div>
  );
};

CreateNFTCollection.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Create Collection">
      <div className={dashboardContentContainer}>
        <div className={feedContainer}>{page}</div>
      </div>
    </AllPagesWrapper>
  );
};

export default CreateNFTCollection;

// styling
const modalBodyWrapper = ctl(`
flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center
`);
const footerBtnContainer = ctl(`
w-full mt-3 flex items-center gap-3
`);
const ImgStyling = ctl(`
w-[64px] h-[64px]  rounded-2xl object-contain mx-auto
`);
const dashboardContentContainer = ctl(`
 bg-black-shade-3 w-full h-full font-monto [@media(max-width:1279px)]:max-w-[544px] max-w-[1160px] mx-auto relative 
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading lg:text-[34px] sm:text-2xl
`);
const feedContainer = ctl(`
flex flex-col lg:flex-row  gap-5 lg:items-start 
`);
