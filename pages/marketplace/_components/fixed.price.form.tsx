// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

// App imports
import Button from "@/components/button";
import { AddIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import CustomDropdown from "./custom.dropdown";
import { formatAddress } from "@/utils/format.address";
import { IMyCollection } from "@/hooks/use.get.my.collections";
import { IoIosClose } from "react-icons/io";
import { BlockchainConfig } from "@/web3/blockchain/config";

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
  // NFTPrice: Joi.number().greater(0).required().label("NFT Price").messages({
  //   "string.empty": `NFTPrice Required`,
  //   "any.required": `Required Field`,
  // }),
  // Collection: Joi.string().required().max(150).label("Collection").messages({
  //   "string.empty": `Collection Required`,
  //   "any.required": `Required Field`,
  // }),
});
interface FixedPriceFormProps {
  createNFT: any;
  collections: IMyCollection[];
  clearForm: boolean;
  asset: Blob | undefined;
}
interface FormFields {
  NFTName: String;
  Description: String;
  NFTAmount: number | null;
  NFTPrice: number | null;
  Collection: String;
}
// TODO: Kindly fix any types
const FixedPriceForm = ({
  createNFT,
  collections,
  clearForm,
  asset,
}: FixedPriceFormProps) => {
  const [loadingState, setLoadingState] = useState(false);
  const [propertyModal, setPropertyModal] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<any>([]);
  const [propertyList, setPropertyList] = useState<any>([]);
  const [propertyErr, setPropertyErr] = useState<null | string>(null);
  const [changeNFTPrice, setChangeNFTPrice] = useState<any>(null);
  const [nftPriceError, setNFTPriceError] = useState<any>(" ");
  const [collectionErrorMsg, setCollectionErrorMsg] = useState<any>("");
  const [selectedOption, setSelectedOption] = useState(
    collections[0].collection
  );
  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    setCollectionErrorMsg("");
  };

  const { handleSubmit, register, setError, formState, reset } =
    useForm<FormFields>({
      mode: "onChange",
      resolver: joiResolver(schema),
      defaultValues: {
        NFTName: "",
        Description: "",
        // NFTPrice: null,
        // Collection: "",
      },
    });
  // functions to add/remove dynamic properties
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

  // handle submit data
  const onSubmit = async (data: any) => {
    if (!selectedOption) {
      setCollectionErrorMsg("Field Required");
      return;
    }
    if (!changeNFTPrice) {
      setNFTPriceError("Field Required");
      return;
    }
    let finalizedData = {
      name: data.NFTName,
      description: data.Description,
      supply: 1,
      collection: selectedOption,
      isAuction: false,
      price: changeNFTPrice,
      period: 0,
      properties: propertyList,
    };
    createNFT(finalizedData);
  };
  useEffect(() => {
    if (clearForm) {
      setChangeNFTPrice(null);
      reset({
        NFTName: "",
        Description: "",
        NFTAmount: 1,
      });
      setSelectedOption("");
      setPropertyList([]);
    }
  }, [clearForm, reset]);

  return (
    <div className={formContainer}>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>
          Name Your NFT <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="text"
          id="NFTName"
          maxLength={150}
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
        <label className={fieldTitle}>
          Description <span className="text-red-500">*</span>{" "}
        </label>
        <textarea
          id="Description"
          autoComplete="off"
          maxLength={550}
          {...register("Description")}
          placeholder="Write some details about your NFT"
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
      <div className={fieldWrapper}>
        <label className={fieldTitle}>
          NFT Price <span className="text-red-500">*</span>{" "}
        </label>

        <div className="relative">
          <span className="text-14px absolute right-2 top-[50%] translate-x-[-50%] leading-[0] text-brand-primary">
            BNB
          </span>
          {/* <input
            type="number"
            id="NFTPrice"
            autoComplete="off"
            {...register("NFTPrice")}
            placeholder="Enter NFT Price"
            className={
              !formState.errors.NFTPrice ? inputField : inputFieldError
            }
          /> */}
          <input
            type="text"
            id="NFTPrice"
            autoComplete="off"
            placeholder="Enter NFT Price"
            className={nftPriceError === "" ? inputField : inputFieldError}
            onChange={(e) => {
              setNFTPriceError("");
              const inputValue = e.target.value;
              const numberValue = Number(inputValue);

              const pattern = /^\d*\.?\d+$/; // Regular expression to match positive integers and positive floating numbers
              if (pattern.test(inputValue)) {
                if (numberValue <= 0) {
                  setNFTPriceError("NFT Price must be greater than 0");
                  setChangeNFTPrice(null);
                }
                if (numberValue < BlockchainConfig.networkDecimals) {
                  setNFTPriceError(
                    "NFT Price must be greater than 0.000000000000000001"
                  );
                  setChangeNFTPrice(null);
                }
                setChangeNFTPrice(numberValue);
              } else if (e.target.value == "") {
                setNFTPriceError("Field Required");
                setChangeNFTPrice(null);
              } else {
                setNFTPriceError("NFT Price must be a positive number");
                setChangeNFTPrice(null);
              }
            }}
          />
        </div>
        {nftPriceError !== "" && (
          <p className={`text-red-500 ${errMessage}`}>{nftPriceError}</p>
        )}
        {/* <div className={serviceFee}>
          <div className={serviceFeeTitle}>
            <span className={serviceFeeName}>Service fee</span>
            <QuestionIcon />
          </div>
          <span className={serviceFeeNumber}>0.0370 BNB</span>
        </div> */}
      </div>
      <div className={"z-50 flex w-full flex-col gap-2"}>
        <label htmlFor="textarea" className={fieldTitle}>
          Collection <span className="text-red-500">*</span>{" "}
        </label>
        <CustomDropdown
          options={collections.map((collection) => ({
            value: collection.collection,
            label: `${collection.name} ${formatAddress(collection.collection)}`,
          }))}
          selectedValue={selectedOption}
          onSelect={handleOptionSelect}
          error={collectionErrorMsg}
        />
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>
          Properties{"  "}
          <span className="text-14px  font-normal text-gray-shade-7">
            (optional)
          </span>
        </label>
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
                  className="absolute top-0 right-0"
                  onClick={() => {
                    handlePropertyRemove(item.PropertyName);
                  }}
                >
                  <IoIosClose className="text-2xl text-white" />
                </button>
                <h5 className={PropertyName}>{item.PropertyName}</h5>
                <h6 className={Type}>{item.Type}</h6>
              </div>
            );
          })}
      </div>

      <Button
        title={"Create NFT"}
        variant={
          formState.isValid &&
          asset !== undefined &&
          nftPriceError === "" &&
          collectionErrorMsg == ""
            ? "v1"
            : "v2"
        }
        disabled={!formState.isValid && asset === undefined}
        onClick={handleSubmit(onSubmit)}
        className="mt-2 py-4"
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
              variant="v1"
              onClick={addNewPropertyFunc}
              className="mt-2 py-4"
            />
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default FixedPriceForm;

// styling
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
  w-full py-3 px-5  !bg-black-shade-3 text-white font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:!ring-yellow-theme active:!ring-yellow-theme
`);
const inputFieldModal = ctl(`
  w-full py-3 px-5  !bg-black-shade-2  text-white font-semibold text-14px rounded-lg border-0 focus:outline-none ring-black-shade-7 ring-2 focus:!ring-yellow-theme active:!ring-yellow-theme
`);
const inputFieldError = ctl(`
  ${inputField}
   focus:!ring-red-500
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
text-12px font-medium text-brand-primary
`);
const Type = ctl(`
text-14px font-semibold text-white
`);
