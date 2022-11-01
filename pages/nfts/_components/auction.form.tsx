// React, Next, NPM Packages
import React, { useState } from "react";
import Image from "next/image";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";
import { QuestionIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import { AddIcon, CrossFullIcon, LoaderIcon, BNBIcon } from "@/assets/svgs";

// form validations
const schema = Joi.object({
  NFTName: Joi.string().required().max(150).label("NFT Name").messages({
    "string.empty": `NFT Name Required`,
    "any.required": `Required Field`,
  }),
  Description: Joi.string().required().max(550).label("Description").messages({
    "string.empty": `Description Required`,
    "any.required": `Required Field`,
  }),
  NFTSymbol: Joi.string().required().max(50).label("NFT Symbol").messages({
    "string.empty": `NFTSymbol Required`,
    "any.required": `Required Field`,
  }),
  NFTAmount: Joi.number().required().label("NFT Amount").messages({
    "string.empty": `NFTAmount Required`,
    "any.required": `Required Field`,
  }),
  AuctionEndTime: Joi.date().required().label("Auction End Time").messages({
    "string.empty": `AuctionEndTime Required`,
    "any.required": `Required Field`,
  }),
  StartingNFTPrice: Joi.number().required().label("NFT Price").messages({
    "string.empty": `StartingNFTPrice Required`,
    "any.required": `Required Field`,
  }),
  Category: Joi.string().required().max(150).label("Category").messages({
    "string.empty": `Category Required`,
    "any.required": `Required Field`,
  }),
  Collection: Joi.string().required().max(150).label("Collection").messages({
    "string.empty": `Collection Required`,
    "any.required": `Required Field`,
  }),
});

interface AuctionFormFields {
  NFTName: string;
  Description: string;
  NFTSymbol: string;
  NFTAmount: number;
  AuctionEndTime: string;
  StartingNFTPrice: number;
  Category: string;
  Collection: string;
}
const AuctionForm = () => {
  const [loadingState, setLoadingState] = useState(false);
  const [propertyModal, setPropertyModal] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<any>([]);
  const [propertyList, setPropertyList] = useState<any>([]);
  const [propertyErr, setPropertyErr] = useState<null | string>(null);

  // modal states
  const [Modal, setModal] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [ModalContent, setModalContent] = useState<any>();

  // creating modals
  const buyNFTStep1Func = () => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper2}>
        <Image
          className={ImgStyling}
          src={"/images/nftAsset.png"}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px text-white font-semibold">Maradona sport</h2>
        <h3 className="text-white text-14px font-normal">Gas fee 10%</h3>
        <h6 className="text-white text-14px font-bold flex items-center gap-2 justify-center">
          <span>Price:</span>
          <BNBIcon />
          89.08 BNB <span className="text-gray-shade-2 "> =$24190.19</span>
        </h6>
        <div className={footerBtnContainer}>
          <Button
            title={"Checkout"}
            variant="v1"
            className="py-4"
            onClick={buyNFTStep2Func}
          />
        </div>
      </div>
    );
    setModal(true);
  };
  const buyNFTStep2Func = () => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper2}>
        <LoaderIcon className="mx-auto" />
        <h3 className="text-white text-18px font-semibold leading-6">
          Transaction in progress
        </h3>
        {/* <p className="text-gray-shade-2 text-14px font-normal leading-6">
              Your transaction is in progress, Please wait.
            </p> */}
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Transaction Hash
          <span className="text-yellow-theme ml-2">0x1204...23b350</span>
        </p>
        <div className={footerBtnContainer}>
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
        </div>
      </div>
    );
    setModal(true);
  };
  const buyNFTSuccessFunc = () => {
    setModalTitle("Complete checkout");
    setModalContent(
      <div className={modalBodyWrapper2}>
        <Image
          className={ImgStyling}
          src={"/images/nftAsset.png"}
          alt="image"
          height={64}
          width={64}
        />
        <h2 className="text-18px text-white font-semibold">Purchased</h2>
        <p className="text-gray-shade-2 text-14px font-normal leading-6">
          Congratulations! You have successfully bought{" "}
          <span className="text-white">Maradona sport</span> NFT on Nether NFT
          platform.
        </p>
        <div className={footerBtnContainer}>
          <Button
            title={"View item"}
            variant="v4"
            className="py-4"
            onClick={() => {
              setModal(false);
              setModalTitle("");
              setModalContent(null);
            }}
          />
        </div>
      </div>
    );
    setModal(true);
  };

  const { handleSubmit, register, setError, formState, reset } =
    useForm<AuctionFormFields>({
      mode: "onChange",
      resolver: joiResolver(schema),
    });

  // function to add/remove dynamic property
  const handlePropertyChange = (e: any) => {
    setPropertyDetails((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const addNewPropertyFunc = () => {
    if (
      propertyDetails?.Type === null ||
      propertyDetails?.Type?.match(/^ *$/) !== null
    ) {
      setPropertyErr("Type/Name value missing");
      return;
    } else if (
      propertyDetails?.PropertyName === null ||
      propertyDetails?.PropertyName?.match(/^ *$/) !== null
    ) {
      setPropertyErr("Type/Name value missing");
      return;
    }
    setPropertyErr("");
    setPropertyList((current: any) => [...current, propertyDetails]);
    setPropertyModal(false);
    setPropertyDetails([]);
  };
  const handlePropertyRemove = (prop: any) => {
    setPropertyList(
      propertyList.filter((item: any) => item?.PropertyName != prop)
    );
  };

  // handle submit
  const onSubmit = async (data: any) => {
    console.log(data);
    let finalizedData = {
      NFTName: data.NFTName,
      Description: data.Description,
      NFTSymbol: data.NFTSymbol,
      NFTAmount: data.NFTAmount,
      AuctionEndTime: data.AuctionEndTime,
      StartingNFTPrice: data.StartingNFTPrice,
      Category: data.Category,
      Collection: data.Collection,
      PropertiesList: propertyList,
    };
    console.log(finalizedData);
    buyNFTStep1Func();
  };
  return (
    <div className={formContainer}>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Name your NFT</label>
        <input
          type="text"
          id="NFTName"
          autoComplete="off"
          {...register("NFTName")}
          placeholder="eg. &#34;big skull&#34;"
          className={!formState.errors.NFTName ? inputField : inputFieldError}
        />
        {formState.errors.NFTName && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.NFTName.message}
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Description</label>
        <textarea
          id="Description"
          autoComplete="off"
          {...register("Description")}
          placeholder="Write some details about your NFTs"
          className={
            !formState.errors.Description ? inputField : inputFieldError
          }
          cols={20}
          rows={3}
        ></textarea>
        {formState.errors.Description && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.Description.message}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <div className={fieldWrapper}>
          <label className={fieldTitle}>NFT Symbol</label>
          <input
            type="text"
            id="NFTSymbol"
            autoComplete="off"
            {...register("NFTSymbol")}
            placeholder="Enter NFT symbol"
            className={
              !formState.errors.NFTSymbol ? inputField : inputFieldError
            }
          />
          {formState.errors.NFTSymbol && (
            <p className={`text-red-500 ${errMessage}`}>
              {formState.errors.NFTSymbol.message}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>NFT Amount</label>
          <input
            type="text"
            id="NFTAmount"
            autoComplete="off"
            {...register("NFTAmount")}
            placeholder="0"
            className={
              !formState.errors.NFTAmount ? inputField : inputFieldError
            }
          />
          {formState.errors.NFTAmount && (
            <p className={`text-red-500 ${errMessage}`}>
              {formState.errors.NFTAmount.message}
            </p>
          )}
        </div>
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Set Auction End Time</label>
        <input
          type="datetime-local"
          id="AuctionEndTime"
          autoComplete="off"
          {...register("AuctionEndTime")}
          placeholder="Enter NFT Price"
          className={`${
            !formState.errors.AuctionEndTime ? inputField : inputFieldError
          } dateInput`}
        />
        {formState.errors.AuctionEndTime && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.AuctionEndTime.message}
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Starting price for NFT</label>
        <input
          type="text"
          id="StartingNFTPrice"
          autoComplete="off"
          {...register("StartingNFTPrice")}
          placeholder="Enter NFT Price"
          className={
            !formState.errors.StartingNFTPrice ? inputField : inputFieldError
          }
        />
        {formState.errors.StartingNFTPrice && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.StartingNFTPrice.message}
          </p>
        )}
        <div className={serviceFee}>
          <div className={serviceFeeTitle}>
            <span className={serviceFeeName}>Service fee</span>
            <QuestionIcon />
          </div>
          <span className={serviceFeeNumber}>0.0370 BNB</span>
        </div>
      </div>
      <div className={fieldWrapper}>
        <label htmlFor="textarea" className={fieldTitle}>
          Category
        </label>
        <select
          id="Category"
          {...register("Category")}
          className={!formState.errors.Category ? inputField : inputFieldError}
        >
          <option value="">Select</option>
          <option value="Category1">Category1</option>
          <option value="Category2">Category2</option>
        </select>
        {formState.errors.Category && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.Category.message}
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label htmlFor="textarea" className={fieldTitle}>
          Collection
        </label>
        <select
          id="Collection"
          {...register("Collection")}
          className={
            !formState.errors.Collection ? inputField : inputFieldError
          }
        >
          <option value="">Select</option>
          <option value="Collection1">Collection1</option>
          <option value="Collection2">Collection2</option>
        </select>
        {formState.errors.Collection && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.Collection.message}
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Properties</label>
        <div className={addPropertyBtn}>
          <span>Add new properties</span>
          <button
            onClick={() => {
              setPropertyModal(true);
            }}
          >
            <AddIcon />
          </button>
        </div>
      </div>
      <div className={propetiesListContainer}>
        {propertyList?.length > 0 &&
          propertyList.map((item: any, index: number) => {
            return (
              <div key={index} className={properyCard}>
                <button
                  className="absolute -top-2 -right-2"
                  onClick={() => {
                    handlePropertyRemove(item.PropertyName);
                  }}
                >
                  <CrossFullIcon />
                </button>
                <h5 className={PropertyName}>{item.PropertyName}</h5>
                <h6 className={Type}>{item.Type}</h6>
              </div>
            );
          })}
      </div>
      <Button
        title={"Create NFT"}
        variant={formState.isValid ? "v1" : "v2"}
        disabled={!formState.isValid}
        onClick={handleSubmit(onSubmit)}
        className="py-4 mt-2"
      />
      {propertyModal && (
        <CustomModal
          onClose={() => {
            setPropertyModal(false);
          }}
          title={"Add new properties"}
        >
          <div className={modalBodyWrapper}>
            <div className={fieldWrapper}>
              <label className={fieldTitle}>Type</label>
              <input
                type="text"
                name="Type"
                id="Type"
                autoComplete="off"
                placeholder="Character"
                className={inputFieldModal}
                onChange={handlePropertyChange}
              />
            </div>
            <div className={fieldWrapper}>
              <label className={fieldTitle}>Name</label>
              <input
                type="text"
                name="PropertyName"
                id="PropertyName"
                autoComplete="off"
                placeholder="Male"
                className={inputFieldModal}
                onChange={handlePropertyChange}
              />
            </div>
            {propertyErr && (
              <p className={`text-red-500 ${errMessage}`}>{propertyErr}</p>
            )}
            <Button
              title={"Save"}
              variant="v2"
              onClick={addNewPropertyFunc}
              className="py-4 mt-2"
            />
          </div>
        </CustomModal>
      )}
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

export default AuctionForm;

// styling
const modalBodyWrapper2 = ctl(`
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5 text-center
`);
const footerBtnContainer = ctl(`
flex items-center gap-4 mt-3
`);
const ImgStyling = ctl(`
w-[64px] h-[64px]  rounded-2xl object-contain mx-auto
`);
const formContainer = ctl(`
 flex flex-col gap-4
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
const inputField = ctl(`
  w-full py-3 px-5  !bg-black-shade-3  text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:ring-yellow-theme
`);
const inputFieldError = ctl(`
  ${inputField}
   focus:!ring-red-500
`);
const serviceFee = ctl(`
flex justify-between items-center pt-1
`);
const serviceFeeTitle = ctl(`
flex items-center gap-3
`);
const serviceFeeName = ctl(`
text-[#838B8F] text-12px font-normal
`);
const serviceFeeNumber = ctl(`
 text-white text-12px font-normal
`);
const addPropertyBtn = ctl(`
flex items-center justify-between w-full py-3 px-5  !bg-black-shade-3  text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:ring-yellow-theme h-[48px]
`);
const modalBodyWrapper = ctl(`
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 p-5
`);
const propetiesListContainer = ctl(`
flex flex-wrap gap-[2%]
`);
const properyCard = ctl(`
border border-yellow-theme rounded-10px flex flex-col items-center justify-center py-7 px-5 gap-3 bg-background-shade-2 w-full lg:max-w-[32%] mb-[2%] relative
`);
const PropertyName = ctl(`
text-12px font-medium text-yellow-theme
`);
const Type = ctl(`
text-14px font-semibold text-white
`);
const inputFieldModal = ctl(`
  w-full py-3 px-5  !bg-black-shade-2  text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none ring-black-shade-7 ring-2 focus:!ring-yellow-theme active:!ring-yellow-theme
`);
