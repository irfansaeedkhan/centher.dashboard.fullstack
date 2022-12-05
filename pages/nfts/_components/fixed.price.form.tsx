// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

// App imports
import Button from "@/components/button";
import { AddIcon, CrossFullIcon } from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
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
  Category: Joi.string().required().max(150).label("category").messages({
    "string.empty": `category Required`,
    "any.required": `Required Field`,
  }),
  NFTAmount: Joi.number()
    .integer()
    .greater(0)
    .required()
    .label("NFT Amount")
    .messages({
      "string.empty": `NFTAmount Required`,
      "any.required": `Required Field`,
    }),
  NFTPrice: Joi.number().required().label("NFT Price").messages({
    "string.empty": `NFTPrice Required`,
    "any.required": `Required Field`,
  }),
  Collection: Joi.string().required().max(150).label("Collection").messages({
    "string.empty": `Collection Required`,
    "any.required": `Required Field`,
  }),
});
interface FixedPriceFormProps {
  createNFT: any;
  collections: IMyCollection[];
  clearForm: boolean;
}
interface FormFields {
  NFTName: String;
  Category: String;
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
}: FixedPriceFormProps) => {
  const [loadingState, setLoadingState] = useState(false);
  const [propertyModal, setPropertyModal] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<any>([]);
  const [propertyList, setPropertyList] = useState<any>([]);
  const [propertyErr, setPropertyErr] = useState<null | string>(null);

  const { handleSubmit, register, setError, formState, reset } =
    useForm<FormFields>({
      mode: "onChange",
      resolver: joiResolver(schema),
      defaultValues: {
        NFTName: "",
        Description: "",
        Category: "",
        NFTAmount: null,
        NFTPrice: null,
        Collection: "",
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
    let finalizedData = {
      name: data.NFTName,
      description: data.Description,
      category: data.Category,
      supply: data.NFTAmount,
      collection: data.Collection,
      isAuction: false,
      price: data.NFTPrice,
      period: 0,
      properties: propertyList,
    };
    createNFT(finalizedData);
  };
  useEffect(() => {
    if (clearForm) {
      reset({
        NFTName: "",
        Category: "",
        Description: "",
        NFTAmount: null,
        NFTPrice: null,
        Collection: "",
      });
      setPropertyList([]);
    }
  }, [clearForm, reset]);
  return (
    <div className={formContainer}>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>
          Name your NFT <span className="text-red-500">*</span>{" "}
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
      <div className="flex gap-3">
        <div className={fieldWrapper}>
          <label className={fieldTitle}>
            NFT Amount <span className="text-red-500">*</span>{" "}
          </label>
          <input
            type="number"
            id="NFTAmount"
            autoComplete="off"
            maxLength={10}
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
          NFT Price <span className="text-red-500">*</span>{" "}
        </label>

        <div className="relative">
          <span className="text-yellow-theme text-14px absolute right-2 top-[50%] translate-x-[-50%] leading-[0]">
            BNB
          </span>
          <input
            type="text"
            id="NFTPrice"
            autoComplete="off"
            {...register("NFTPrice")}
            placeholder="Enter NFT Price"
            className={
              !formState.errors.NFTPrice ? inputField : inputFieldError
            }
          />
        </div>
        {formState.errors.NFTPrice && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.NFTPrice.message}
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
              variant="v1"
              onClick={addNewPropertyFunc}
              className="py-4 mt-2"
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
