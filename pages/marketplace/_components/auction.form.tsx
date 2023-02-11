// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Joi, { string } from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import ctl from "@netlify/classnames-template-literals";
import moment from "moment";

// App imports
import Button from "@/components/button";
import { CustomModal } from "@/components/modal/custom.modal";
import { AddIcon, LoaderIcon, BNBIcon } from "@/assets/svgs";
import { formatAddress } from "@/utils/format.address";
import { IMyCollection } from "@/hooks/use.get.my.collections";
import { categories } from "@/models/nft";

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
  // NFTSymbol: Joi.string().required().max(50).label("NFT Symbol").messages({
  //   "string.empty": `NFTSymbol Required`,
  //   "any.required": `Required Field`,
  // }),
  NFTAmount: Joi.number()
    .integer()
    .greater(0)
    .required()
    .label("NFT Amount")
    .messages({
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

// schema.validate({ AuctionEndTime: 1994 });
interface AuctionFormFields {
  NFTName: string;
  Description: string;
  // NFTSymbol: string;
  NFTAmount: number | null;
  AuctionEndTime: string;
  StartingNFTPrice: number | null;
  Category: string;
  Collection: string;
}
interface AuctionFormProps {
  createNFT: any;
  collections: IMyCollection[];
  clearForm: boolean;
  asset: Blob | undefined;
}
const AuctionForm = ({
  createNFT,
  collections,
  clearForm,
  asset,
}: AuctionFormProps) => {
  const [loadingState, setLoadingState] = useState(false);
  const [propertyModal, setPropertyModal] = useState(false);
  const [AuctionEndTimeErr, setAuctionEndTimeErr] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<any>([]);
  const [propertyList, setPropertyList] = useState<any>([]);
  const [propertyErr, setPropertyErr] = useState<null | string>(null);

  const { handleSubmit, register, setError, formState, reset } =
    useForm<AuctionFormFields>({
      mode: "onChange",
      resolver: joiResolver(schema),
      defaultValues: {
        NFTName: "",
        Description: "",
        // NFTSymbol: "",
        NFTAmount: null,
        AuctionEndTime: "",
        StartingNFTPrice: null,
        Category: "",
        Collection: "",
      },
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

  const timeNow = moment().format("LLLL");
  // moment(post.createdAt).add(15, "minutes");
  // schema.validate({ AuctionEndTime: 1994 });
  // handle submit
  const onSubmit = async (data: any) => {
    if (moment(data.AuctionEndTime) <= moment()) {
      setAuctionEndTimeErr(true);
      return;
    } else {
      setAuctionEndTimeErr(false);
    }

    // let finalizedData = {
    //   NFTName: data.NFTName,
    //   Description: data.Description,
    //   NFTSymbol: data.NFTSymbol,
    //   NFTAmount: data.NFTAmount,
    //   AuctionEndTime: data.AuctionEndTime,
    //   StartingNFTPrice: data.StartingNFTPrice,
    //   Category: data.Category,
    //   Collection: data.Collection,
    //   PropertiesList: propertyList,
    // };
    // console.log(finalizedData);

    let finalizedData = {
      name: data.NFTName,
      description: data.Description,
      supply: data.NFTAmount,
      collection: data.Collection,
      category: data.Category,
      isAuction: true,
      price: data.StartingNFTPrice,
      period: Math.floor((data.AuctionEndTime - Date.now()) / 1000),
      properties: propertyList,
    };

    createNFT(finalizedData);
  };

  useEffect(() => {
    if (clearForm) {
      reset({
        NFTName: "",
        Description: "",
        Category: "",
        NFTAmount: null,
        AuctionEndTime: "",
        StartingNFTPrice: null,
        Collection: "",
        // PropertiesList: "",
      });
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
      <div className="flex gap-3">
        {/* <div className={fieldWrapper}>
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
        </div> */}
        <div className={fieldWrapper}>
          <label className={fieldTitle}>
            NFT Amount <span className="text-red-500">*</span>{" "}
          </label>
          <input
            type="number"
            id="NFTAmount"
            maxLength={10}
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
        <label className={fieldTitle}>
          Set Auction End Time <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="datetime-local"
          id="AuctionEndTime"
          autoComplete="off"
          {...register("AuctionEndTime")}
          placeholder="Set Auction End Time"
          className={`${
            !formState.errors.AuctionEndTime ? inputField : inputFieldError
          } dateInput`}
        />
        {formState.errors.AuctionEndTime && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.AuctionEndTime.message}
          </p>
        )}
        {AuctionEndTimeErr && (
          <p className={`text-red-500 ${errMessage}`}>
            Please select date & time from future
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>
          Starting price for NFT <span className="text-red-500">*</span>{" "}
        </label>
        <div className="relative">
          <span className="text-14px absolute right-2 top-[50%] translate-x-[-50%] leading-[0] text-yellow-theme">
            BNB
          </span>
          <input
            type="number"
            id="StartingNFTPrice"
            autoComplete="off"
            {...register("StartingNFTPrice")}
            placeholder="Enter NFT Price"
            className={
              !formState.errors.StartingNFTPrice ? inputField : inputFieldError
            }
          />
        </div>
        {formState.errors.StartingNFTPrice && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.StartingNFTPrice.message}
          </p>
        )}
        {/* <div className={serviceFee}>
          <div className={serviceFeeTitle}>
            <span className={serviceFeeName}>Service fee</span>
            <QuestionIcon />
          </div>
          <span className={serviceFeeNumber}>0.0370 BNB</span>
        </div> */}
      </div>
      <div className={fieldWrapper}>
        <label htmlFor="textarea" className={fieldTitle}>
          Category <span className="text-red-500">*</span>{" "}
        </label>
        <select
          id="Category"
          {...register("Category")}
          className={!formState.errors.Category ? inputField : inputFieldError}
        >
          {categories.slice(1, categories.length).map((item, key) => {
            return (
              <option value={item === "Select" ? "" : item} key={key}>
                {item}
              </option>
            );
          })}
        </select>
        {formState.errors.Category && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.Category.message}
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label htmlFor="textarea" className={fieldTitle}>
          Collection <span className="text-red-500">*</span>{" "}
        </label>
        <select
          id="Collection"
          {...register("Collection")}
          className={
            !formState.errors.Collection ? inputField : inputFieldError
          }
        >
          <option value="">Select</option>
          {collections.map((collection) => {
            return (
              <option value={collection.collection} key={collection.id}>
                {`${collection.name}  (${formatAddress(
                  collection.collection
                )})`}
              </option>
            );
          })}
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
                  {/* <CrossFullIcon /> */}
                </button>
                <h5 className={PropertyName}>{item.PropertyName}</h5>
                <h6 className={Type}>{item.Type}</h6>
              </div>
            );
          })}
      </div>
      <Button
        title={"Create NFT"}
        variant={formState.isValid && asset !== undefined ? "v1" : "v2"}
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

export default AuctionForm;

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
  w-full py-3 px-5  !bg-black-shade-3  text-white font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:ring-yellow-theme
`);
const inputFieldError = ctl(`
  ${inputField}
   focus:!ring-red-500
`);
const addPropertyBtn = ctl(`
flex items-center justify-between w-full py-3 px-5  !bg-black-shade-3 text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:ring-yellow-theme h-[48px]
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
  w-full py-3 px-5  !bg-black-shade-2 text-white  font-semibold text-14px rounded-lg border-0 focus:outline-none ring-black-shade-7 ring-2 focus:!ring-yellow-theme active:!ring-yellow-theme
`);
