// React, Next, NPM Packages
import React, { useState } from "react";
import { ethers } from "ethers";
import ctl from "@netlify/classnames-template-literals";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

// App imports
import Button from "@/components/button";
import {
  GreyWorldIcon,
  GreyFBIcon,
  GreyTwitterIcon,
} from "@/assets/svgs";
// form validations
const schema = Joi.object({
  CollectionName: Joi.string().required().max(150).label("NFT Name").messages({
    "string.empty": `NFT Name Required`,
    "any.required": `Required Field`,
  }),
  Symbol: Joi.string().required().max(150).label("NFT Name").messages({
    "string.empty": `NFT Name Required`,
    "any.required": `Required Field`,
  }),
  Description: Joi.string().required().max(550).label("Description").messages({
    "string.empty": `Description Required`,
    "any.required": `Required Field`,
  }),
  Category: Joi.string().required().max(150).label("Category").messages({
    "string.empty": `Category Required`,
    "any.required": `Required Field`,
  }),
  Url: Joi.string().allow("").optional().max(50).label("Url").messages({
    "string.empty": `Url Required`,
    "any.required": `Required Field`,
  }),
  OwnSite: Joi.string()
    .uri()
    .required()
    .max(50)
    .label("Personal Site")
    .messages({
      "string.empty": `Personal Site Required`,
      "any.required": `Required Field`,
    }),
  FBLink: Joi.string()
    .uri()
    .required()
    .max(50)
    .label("Facebook link")
    .messages({
      "string.empty": `FB Link Required`,
      "any.required": `Required Field`,
    }),
  TwitterLink: Joi.string()
    .uri()
    .required()
    .max(50)
    .label("Twitter Link")
    .messages({
      "string.empty": `Twitter Link Required`,
      "any.required": `Required Field`,
    }),
});

interface CreateNFTCollectionFormProps {
  createCollection: any
}
export interface ICollectionData {
  name: string
  symbol: string
  totalsupply: number
  description: string
  category: string
  url: string
  yoursite: string
  facebook: string
  twitter: string
}
export const CreateNFTCollectionForm = ({
  createCollection,
} : CreateNFTCollectionFormProps) => {
  const { handleSubmit, register, setError, formState, reset } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const collectionData = {
      name: data.CollectionName,
      symbol: data.Symbol,
      totalsupply: ethers.constants.MaxUint256,
      description: data.Description,
      url: data.Url,
      yoursite: data.OwnSite,
      facebook: data.FBLink,
      twitter: data.TwitterLink,
    }
    createCollection(collectionData);
  };

  return (
    <div className={CreateNFTCollectionFormContainer}>
      <div className={formContainer}>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Name your Collection</label>
          <input
            type="text"
            id="CollectionName"
            autoComplete="off"
            {...register("CollectionName")}
            placeholder="eg. ‘big skull collection’ "
            className={
              !formState.errors.CollectionName ? inputField : inputFieldError
            }
          />
          {formState.errors.CollectionName && (
            <p className={`text-red-500 ${errMessage}`}>
              {/* {formState.errors.CollectionName.message} */}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Symbol</label>
          <input
            type="text"
            id="Symbol"
            autoComplete="off"
            {...register("Symbol")}
            placeholder="eg. ‘NTD’ "
            className={
              !formState.errors.Symbol ? inputField : inputFieldError
            }
          />
          {formState.errors.Symbol && (
            <p className={`text-red-500 ${errMessage}`}>
              {/* {formState.errors.Symbol.message} */}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Description</label>
          <span className="text-12px leading-4 text-[#B7BBCC]">
            The description will be included in the collection page underneath
            its image.{" "}
          </span>
          <textarea
            id="Description"
            autoComplete="off"
            {...register("Description")}
            placeholder="Wrirte some details about your NFTs collection"
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
              {/* TODO: kindly solve this error type issue */}
              {/* {formState.errors.Category.message} */}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>
            Url <span className="text-gray-shade-17"> (optional)</span>
          </label>
          <input
            type="text"
            id="Url"
            autoComplete="off"
            {...register("Url")}
            placeholder="https://nethernft.io/collection/ skull- Price"
            className={!formState.errors.Url ? inputField : inputFieldError}
          />
          {formState.errors.Url && (
            <p className={`text-red-500 ${errMessage}`}>
              {/* {formState.errors.Url.message} */}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Add links</label>
          <div className={linkListContainer}>
            <div>
              <div className={linkInputContainer}>
                <GreyWorldIcon className={linkIcon} />
                <input
                  type="text"
                  id="OwnSite"
                  autoComplete="off"
                  {...register("OwnSite")}
                  placeholder="https://yoursite.io"
                  className={
                    !formState.errors.OwnSite ? linkField : linkFieldError
                  }
                />
              </div>
              {formState.errors.OwnSite && (
                <p className={`text-red-500 ${errMessage}`}>
                  {/* {formState.errors.OwnSite.message} */}
                </p>
              )}
            </div>
            <div>
              <div className={linkInputContainer}>
                <GreyFBIcon className={linkIcon} />
                <input
                  type="text"
                  id="FBLink"
                  autoComplete="off"
                  {...register("FBLink")}
                  placeholder="https://facebook.com/your profile"
                  className={
                    !formState.errors.FBLink ? linkField : linkFieldError
                  }
                />
              </div>
              {formState.errors.FBLink && (
                <p className={`text-red-500 ${errMessage}`}>
                  {/* {formState.errors.FBLink.message} */}
                </p>
              )}
            </div>
            <div>
              <div className={linkInputContainer}>
                <GreyTwitterIcon className={linkIcon} />
                <input
                  type="text"
                  id="TwitterLink"
                  autoComplete="off"
                  {...register("TwitterLink")}
                  placeholder="https://Twitter.com/your profile"
                  className={
                    !formState.errors.TwitterLink ? linkField : linkFieldError
                  }
                />
              </div>
              {formState.errors.TwitterLink && (
                <p className={`text-red-500 ${errMessage}`}>
                  {/* {formState.errors.TwitterLink.message} */}
                </p>
              )}
            </div>
          </div>
        </div>
        <Button
          title={"Create Collectiion"}
          variant={formState.isValid ? "v1" : "v2"}
          disabled={!formState.isValid}
          onClick={handleSubmit(onSubmit)}
          className="py-4 mt-2"
        />
      </div>
    </div>
  );
};
// styling
const CreateNFTCollectionFormContainer = ctl(`
 bg-black-shade-9 rounded-2xl relative w-full border   border-gray-shade-3 py-8 px-6 flex flex-col gap-6
`);
const formContainer = ctl(`
 flex flex-col gap-5
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
  w-full py-3 px-5  !bg-black-shade-3   text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:!ring-yellow-theme active:!ring-yellow-theme
`);
const inputFieldError = ctl(`
  ${inputField}
   focus:!ring-red-500
`);
const linkField = ctl(`
absolute top-0 left-0 w-full h-full !pl-14 !bg-black-shade-3   text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:!ring-yellow-theme active:!ring-yellow-theme
`);
const linkFieldError = ctl(`
  ${linkField}
   focus:!ring-red-500
`);
const linkInputContainer = ctl(`
inputItem h-[48px]  w-full !bg-black-shade-3   text-gray-shade-17 font-semibold text-14px rounded-lg border-0 focus:outline-none   focus:!ring-yellow-theme active:!ring-yellow-theme relative
`);
const linkIcon = ctl(`
z-30 absolute top-[50%] left-[20px] translate-y-[-50%]
`);
const linkListContainer = ctl(`
flex flex-col gap-5
`);
