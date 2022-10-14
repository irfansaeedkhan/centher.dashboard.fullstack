// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-hot-toast";

// App imports
import Button from "@/components/button";
import { QuestionIcon } from "@/assets/svgs";
import { axiosNodeApi } from "@/utils/axios";

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
const AuctionForm = () => {
  const [loadingState, setLoadingState] = useState(false);
  const { handleSubmit, register, setError, formState, reset } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      setLoadingState(true);
      let result = await axiosNodeApi.post("");
      setLoadingState(result && false);
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
      setLoadingState(false);
      return 0;
    }
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
          placeholder="eg. ‘big skull’"
          className={!formState.errors.NFTName ? inputField : inputFieldError}
        />
        {formState.errors.NFTName && (
          <p className={`text-red-500 ${errMessage}`}>
            {/* {formState.errors.NFTName.message} */}
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
            {/* {formState.errors.Description.message} */}
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
              {/* {formState.errors.NFTSymbol.message} */}
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
              {/* {formState.errors.NFTAmount.message} */}
            </p>
          )}
        </div>
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>Set Auction End Time</label>
        <input
          type="date"
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
            {/* {formState.errors.AuctionEndTime.message} */}
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
            {/* {formState.errors.StartingNFTPrice.message} */}
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
            {/* {formState.errors.Category.message} */}
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
            {/* {formState.errors.Collection.message} */}
          </p>
        )}
      </div>

      <Button
        title={"Create NFT"}
        variant={formState.isValid ? "v1" : "v2"}
        disabled={!formState.isValid}
        onClick={handleSubmit(onSubmit)}
        className="py-4 mt-2"
      />
    </div>
  );
};

export default AuctionForm;

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
  w-full py-3 px-5  !bg-black-shade-3  text-[#45474D] font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:ring-yellow-theme
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
