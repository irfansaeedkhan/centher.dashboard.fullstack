// React, Next, NPM Packages
import { useState } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Button from "@/components/button";
import { callCreateNFT } from "@/web3/utils/call.helpers";
import { CustomModal } from "@/components/modal/custom.modal";
import { BNBIcon, LoaderIcon } from "@/assets/svgs";
import { FEE } from "@/web3/constants/common";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import { NFTUploader } from "@/utils/upload.tools/nft.upload.util";
import { safeNameType } from "@/utils/upload.tools/interfaces/safe.file.wrapper.interface";
import { readFileAsync } from "@/utils/file.reader.util";

// Current page imports
import { INFTData } from "./_components/create.nft.form";
import { UploadNFT, CreateNFTForm } from "./_components";

const nftRemoteBasePath = "ipfs:/";

const CreateNFT: NextPageWithLayout = () => {
  const router = useRouter();
  const [clearForm, setClearForm] = useState(false);
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [btnDisabled, setBtnDisabled] = useState<"yes" | "no">("no");
  const [ModalContent, setModalContent] = useState<any>();

  const [asset, setAsset] = useState<Blob | undefined>(undefined);
  const [assetTab, setAssetTab] = useState("Image");

  const bnbPrice = useBNBPrice();

  // const [nftData, setNFTData] = useState<INFTData>()

  const { account, library } = useWeb3React();
  // creating modals
  const buyNFTStep1Func = (nftData: any) => {
    setModalTitle("Complete Checkout");
    setModalContent(
      <div className={modalBodyWrapper2}>
        <h2 className="text-18px text-white font-semibold">{nftData?.name}</h2>
        <h3 className="text-white text-14px font-normal">{`Marketplace fee ${FEE.createItemFeeForMarketplace} BNB`}</h3>
        {/* <h3 className="text-white text-14px font-normal">{`Collection fee ${FEE.createItemFeeForCreator} BNB`}</h3> */}
        <h6 className="text-white text-14px font-bold flex items-center gap-2 justify-center">
          <span>Price:</span>
          <BNBIcon />
          {nftData?.price} BNB{" "}
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
    );
    setModal(true);
  };

  const buyNFTStep2Func = () => {
    setModalTitle("Transaction in progress");
    setBtnDisabled("yes");
    setModalContent(
      <div className={modalBodyWrapper2}>
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

  const buyNFTSuccessFunc = (txStatus: boolean, nftData: any) => {
    setClearForm(false);
    setModalTitle("Complete Checkout");
    setModalContent(
      <div className={modalBodyWrapper2}>
        <h2 className="text-18px text-white font-semibold">
          {txStatus ? "Success!" : "Failed!"}
        </h2>
        {txStatus && (
          <p className="text-gray-shade-2 text-14px font-normal leading-6">
            Congratulations! You have successfully created{" "}
            <span className="text-white">{nftData?.name}</span> NFT on{" "}
            <b>Centher</b>
            NFT platform, Click view on profile to view your NFT.
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
                router.push(`/profile/${account}/nfts`);
              }}
            />
          )}
        </div>
      </div>
    );
    setModal(true);
  };

  const handleCreateCollection = async (nftData: any) => {
    buyNFTStep2Func();
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

      const result = await callCreateNFT(
        library,
        castedNftData.collection,
        castedNftData.category,
        "ipfs:/" + nftMetadataPath,
        castedNftData.supply,
        castedNftData.isAuction,
        castedNftData.price,
        castedNftData.period,
        (FEE.createItemFeeForCreator + FEE.createItemFeeForMarketplace) *
          castedNftData.supply
      );
      nfdCreated = result.success;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while create a nft. Please try again.");
    } finally {
      buyNFTSuccessFunc(nfdCreated, nftData);
    }
  };

  const createNFT = (values: INFTData) => {
    if (asset === undefined) {
      toast.error("Choose file.");
      return;
    }
    // setNFTData(values)
    if (!library) {
      toast.error("Confirm your Wallet Connection.");
      return;
    }
    buyNFTStep1Func(values);
  };

  return (
    <div className="w-full pb-16">
      <h1 className={title}>Create an NFT</h1>
      <div className="flex gap-9 items-start [@media(max-width:1279px)]:flex-col">
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

      {Modal && (
        <CustomModal
          onClose={() => {
            setModal(false);
          }}
          disable={btnDisabled}
          title={ModalTitle}
        >
          {ModalContent}
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
const modalBodyWrapper2 = ctl(`
flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center
`);
const footerBtnContainer = ctl(`
mt-3 flex flex-col-reverse fsm:flex-row gap-2 
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
