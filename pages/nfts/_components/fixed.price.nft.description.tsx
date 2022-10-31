// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";
import { ethers } from "ethers";
import Joi from "joi";
import { useWeb3React } from "@web3-react/core";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

// App imports
import Button from "@/components/button";
import { CustomModal } from "@/components/modal/custom.modal";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import {
  formatAddress,
  formatBNB2USD,
  formatEther2Number,
} from "@/utils/format.address";
import {
  callCancelItemForSale,
  callEditItemForSale,
} from "@/web3/utils/call.helpers";
import { ShareBigIcon, BNBIcon, WarningIcon, LoaderIcon } from "@/assets/svgs";

const schema = Joi.object({
  bidPrice: Joi.number().required().label("bidPrice").messages({
    "string.empty": `bid Price Required`,
    "any.required": `Required Field`,
  }),
});
interface FixedPriceNFTDescriptionProps {
  data: INFTDetailData | undefined;
  reload?: boolean;
  setReload?: any;
}
export const FixedPriceNFTDescription = ({
  data,
  reload,
  setReload,
}: FixedPriceNFTDescriptionProps) => {
  const { library, account } = useWeb3React();
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  const { handleSubmit, register, setError, formState, reset } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const cancelListingFunc = () => {
    setModalTitle("Cancel listing");
    setModalContent(
      <div className={modalBodyWrapper}>
        <WarningIcon className="mx-auto" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Are you sure you want to cancel your Listing?
        </h3>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Canceling your listing will unpublish this sale from market and You
          will be asked to confirm the transaction through your wallet.
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"Go back"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModalTitle("");
              setModalContent(null);
              setModal(false);
            }}
          />
          <Button
            title={"Proceed"}
            onClick={handleCancelListing}
            variant="v1"
            className="py-4"
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const bidNFTModalFunc = () => {
    setModalTitle("Change Price");
    setModalContent(
      <div className={modalBodyWrapper}>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Blockchain</label>
          <div className={`${inputFieldModal} flex items-center gap-3 !ring-0`}>
            <BNBIcon />{" "}
            <h6 className="text-14px font-semibold text-white">BNB</h6>
          </div>
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Price</label>
          <div
            className={`${inputFieldModal} flex items-center justify-between gap-3 !p-0 !px-3 !ring-0`}
          >
            <input
              type="text"
              id="bidPrice"
              autoComplete="off"
              {...register("bidPrice")}
              placeholder="0.00"
              className={
                "w-full h-full !border-0 !ring-0 bg-transparent text-white"
              }
            />
            <h6 className="text-14px font-semibold text-gray-shade-7">
              =$0000
            </h6>
          </div>
          {formState.errors.bidPrice && (
            <p className={`text-red-500 ${errMessage}`}>
              {/* {formState.errors.bidPrice.message} */}
            </p>
          )}
        </div>
        <Button
          title={"Next"}
          variant={formState.isValid ? "v1" : "v2"}
          disabled={!formState.isValid}
          onClick={handleSubmit(onSubmit)}
          className="py-4 mt-2"
        />
      </div>
    );
  };
  const onSubmit = async (form: any) => {
    setModal(false);
    editListingFunc(form.bidPrice);
  };
  const editListingFunc = (newPrice: any) => {
    setModalTitle("Edit listing");
    setModalContent(
      <div className={modalBodyWrapper}>
        <WarningIcon className="mx-auto" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Are you sure you want to edit your Listing Price?
        </h3>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Listing Price will be changed.
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"Go back"}
            variant="v2"
            className="py-4"
            onClick={() => {
              setModalTitle("");
              setModalContent(null);
              setModal(false);
            }}
          />
          <Button
            title={"Proceed"}
            onClick={() => handleEditPrice(newPrice)}
            variant="v1"
            className="py-4"
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const ProceedFunc = () => {
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
  const SuccessFunc = (txStatus: boolean) => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper}>
        <Image
          className={ImgStyling}
          src={data ? data.image : ""}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px text-white font-semibold">
          {txStatus ? "Success!" : "Failed!"}
        </h2>
        {txStatus && (
          <p className="text-gray-shade-2 text-14px font-normal leading-6">
            Congratulations! You have successfully changed{" "}
            <span className="text-white">{data?.name}</span> NFT price on Nether
            NFT platform.
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

  const handleCancelListing = async () => {
    ProceedFunc();
    const result = await callCancelItemForSale(
      library,
      (data as INFTDetailData).collection,
      (data as INFTDetailData).nftId
    );
    SuccessFunc(result.success);
  };
  const handleEditPrice = async (newPrice: any) => {
    ProceedFunc();
    if (library && data) {
      const result = await callEditItemForSale(
        library,
        data.collection,
        data.nftId,
        newPrice
      );
      SuccessFunc(result.success);
    } else {
      SuccessFunc(false);
    }
  };

  useEffect(() => {
    bidNFTModalFunc();
  }, [!formState.isValid]);

  return (
    <div className={nftDescriptionContainer}>
      <div className={greyBoxContainer}>
        <h4 className={greyTxt}>Current Price</h4>
        <div className="flex gap-3  items-center">
          <BNBIcon />
          <h5 className={BnBNum}>
            {formatEther2Number(data?.listInfo.price)} BNB
          </h5>
          <h6 className={greyTxt}> =${formatBNB2USD(data?.listInfo.price)}</h6>
        </div>
      </div>
      <div className={greyBoxContainer}>
        <h4 className={desTitle}>Description</h4>
        <p className={`${greyTxt} leading-6`}>{data?.description}</p>
      </div>
      <div className="buttonContainer flex items-center gap-4">
        <Button
          title={"Cancel Listing"}
          variant="v1"
          className="py-4"
          onClick={cancelListingFunc}
        />
        <Button
          title={"Edit"}
          onClick={() => {
            bidNFTModalFunc();
            setModal(true);
          }}
          variant="v4"
          className="py-4"
        />
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
// styling
const modalBodyWrapper = ctl(`
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center
`);
const footerBtnContainer = ctl(`
flex items-center gap-4
`);

const nftDescriptionContainer = ctl(`
w-full flex flex-col gap-5
`);

const greyBoxContainer = ctl(`
bg-background-shade-3 rounded-10px flex flex-col gap-2 p-6
`);
const greyTxt = ctl(`
text-14px font-normal text-gray-shade-7
`);
const desTitle = ctl(`
text-14px font-semibold text-white
`);
const BnBNum = ctl(`
text-16px font-bold text-white
`);
const ImgStyling = ctl(`
w-[64px] h-[64px]  rounded-2xl object-contain mx-auto
`);

const errMessage = ctl(`
pb-2 text-12px font-medium
`);
const fieldWrapper = ctl(`
  flex gap-2 flex-col w-full
`);
const fieldTitle = ctl(`
  text-14px  font-normal text-white
`);
const inputFieldModal = ctl(`
  w-full py-3 px-5 h-[48px]  !bg-black-shade-2  text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none ring-black-shade-7 ring-2 focus:!ring-yellow-theme active:!ring-yellow-theme
`);
