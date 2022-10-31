// React, Next, NPM Packages
import { useCallback, useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { create as ipfsCreate, IPFSHTTPClient } from "ipfs-http-client";
import Image from "next/image";
import toast from "react-hot-toast";

// App imports
import { useWeb3React } from "@web3-react/core";
import { callCreateCollection } from "@/web3/utils/call.helpers";
import Button from "@/components/button";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CustomModal } from "@/components/modal/custom.modal";
import { formatBNB2USD } from "@/utils/format.address";
import {
  FEE,
  NEXT_PUBLIC_API_Secret,
  NEXT_PUBLIC_IPFS_HOST,
  NEXT_PUBLIC_IPFS_URL,
  NEXT_PUBLIC_Project_ID,
} from "@/web3/constants/common";
import { LoaderIcon, BNBIcon } from "@/assets/svgs";

import { UploadNFTCollection, CreateNFTCollectionForm } from "./_components";
import { ICollectionData } from "./_components/create.collection.form";

const CreateNFTCollection: NextPageWithLayout = () => {
  const [loadingState, setLoadingState] = useState(false);
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const [profile, setProfile] = useState<Blob | undefined>(undefined);
  const [cover, setCover] = useState<Blob | undefined>(undefined);

  // const [collectionData, setCollectionData] = useState<ICollectionData>()

  const { account, library } = useWeb3React();

  // creating modals
  const buyNFTStep1Func = (collectionData: any) => {
    setModalTitle("Complete checkout");
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
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <LoaderIcon className="mx-auto" />
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
    setModalTitle("Complete checkout");
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
            <span className="text-white">{collectionData?.name}</span> NFT on
            Nether NFT platform.
          </p>
        )}
        {!txStatus && (
          <p className="text-gray-shade-2 text-14px font-normal leading-6">
            Transaction Failed.
          </p>
        )}
        {/* <Link href={{
              pathname: AppRoutes.nfts.nft,
              query: {
                collection: nftData?.collection,
                nftId: 2,
              }}} 
          className={footerBtnContainer}
        > */}
        <div className={footerBtnContainer}>
          <Button
            title={"Ok"}
            variant="v4"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
          {/* </Link> */}
        </div>
      </div>
    );
    setModal(true);
  };

  const handleCreateCollection = (collectionData: any) => {
    buyNFTStep2Func();
    try {
      const auth =
        "Basic " +
        Buffer.from(
          NEXT_PUBLIC_Project_ID + ":" + NEXT_PUBLIC_API_Secret
        ).toString("base64");

      const ipfs: IPFSHTTPClient | undefined = ipfsCreate({
        host: NEXT_PUBLIC_IPFS_HOST,
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth,
        },
      });

      const profileReader = new window.FileReader();

      profileReader.onloadend = async () => {
        try {
          let profileFileBuffer = Buffer.from(
            profileReader.result as ArrayBuffer
          );
          console.log("sniper: profileFileBuffer: ", profileFileBuffer);

          const profileAdded = await (ipfs as IPFSHTTPClient).add(
            profileFileBuffer
          );
          console.log("sniper: profileAdded: ", profileAdded);
          const hash = profileAdded.path;
          const profileIPFSHash = NEXT_PUBLIC_IPFS_URL + "/ipfs/" + hash;
          console.log("sniper: profileIPFSHash: ", profileIPFSHash);

          const coverReader = new window.FileReader();
          coverReader.onloadend = async () => {
            try {
              let fileBuffer = Buffer.from(coverReader.result as ArrayBuffer);
              console.log("sniper: fileBuffer: ", fileBuffer);

              const coverfileAdded = await (ipfs as IPFSHTTPClient).add(
                fileBuffer
              );
              console.log("sniper: coverfileAdded: ", coverfileAdded);
              const hash = coverfileAdded.path;
              const coverIPFSHash = NEXT_PUBLIC_IPFS_URL + "/ipfs/" + hash;
              console.log("sniper: coverIPFSHash: ", coverIPFSHash);

              const cd = collectionData as ICollectionData;
              const metadata = {
                name: cd.name,
                Symbol: cd.symbol,
                description: cd.description,
                totalsupply: cd.totalsupply,
                url: cd.url,
                category: cd.category,
                yoursite: cd.yoursite,
                facebook: cd.facebook,
                twitter: cd.twitter,
                profileIPFSHash: profileIPFSHash,
                coverIPFSHash: coverIPFSHash,
              };
              const jsonFileAdded = await ipfs.add(JSON.stringify(metadata));
              const jsonHash = jsonFileAdded.path;
              const jsonIPFShash = NEXT_PUBLIC_IPFS_URL + "/ipfs/" + jsonHash;
              console.log("sniper: jsonIPFShash: ", jsonIPFShash);

              console.log("sniper: metadata: ", metadata);
              const result = await callCreateCollection(
                library,
                cd.name,
                cd.symbol,
                jsonIPFShash,
                cd.totalsupply,
                FEE.createCollectionFee
              );
              buyNFTSuccessFunc(result.success, collectionData);
            } catch (error) {
              console.error(error);
            }
          };
          coverReader.readAsArrayBuffer(cover as Blob);
        } catch (error) {
          console.error(error);
        }
      };
      profileReader.readAsArrayBuffer(profile as Blob);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create a collection.");
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
        />
        <CreateNFTCollectionForm createCollection={createCollection} />
      </div>

      {Modal && (
        <CustomModal
          onClose={() => {
            setModal(false);
          }}
          title={ModalTitle}
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
flex items-center gap-4 mt-3
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
