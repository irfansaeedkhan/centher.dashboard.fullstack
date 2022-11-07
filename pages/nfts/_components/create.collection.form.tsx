// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ctl from "@netlify/classnames-template-literals";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

// App imports
import Button from "@/components/button";
import { GreyWorldIcon, GreyFBIcon, GreyTwitterIcon } from "@/assets/svgs";
// form validations
const schema = Joi.object({
  name: Joi.string().required().max(150).label("NFT Name").messages({
    "string.empty": `NFT Name Required`,
    "any.required": `Required Field`,
  }),
  symbol: Joi.string().required().max(150).label("NFT Name").messages({
    "string.empty": `NFT Name Required`,
    "any.required": `Required Field`,
  }),
  description: Joi.string().required().max(550).label("description").messages({
    "string.empty": `description Required`,
    "any.required": `Required Field`,
  }),
  category: Joi.string().required().max(150).label("category").messages({
    "string.empty": `category Required`,
    "any.required": `Required Field`,
  }),
  url: Joi.string().allow("").optional().max(50).label("url").messages({
    "string.empty": `url Required`,
    "any.required": `Required Field`,
  }),
  yoursite: Joi.string()
    .uri()
    .required()
    .max(50)
    .label("Personal Site")
    .messages({
      "string.empty": `Personal Site Required`,
      "any.required": `Required Field`,
    }),
  facebook: Joi.string()
    .uri()
    .required()
    .max(50)
    .label("Facebook link")
    .messages({
      "string.empty": `FB Link Required`,
      "any.required": `Required Field`,
    }),
  twitter: Joi.string()
    .uri()
    .required()
    .max(50)
    .label("Twitter Link")
    .messages({
      "string.empty": `Twitter Link Required`,
      "any.required": `Required Field`,
    }),
});
export const categories = [
  "Select",
  "Premium",
  "Arts",
  "Music",
  "Sport",
  "Entertainment",
  "Gaming",
  "Collectibles",
  "E-sport",
  "Utility",
];
interface CreateNFTCollectionFormProps {
  createCollection: any;
  clearForm: boolean;
}
export interface ICollectionData {
  name: string;
  symbol: string;
  totalsupply: number | null;
  description: string;
  category: string;
  url: string;
  yoursite: string;
  facebook: string;
  twitter: string;
}
export const CreateNFTCollectionForm = ({
  createCollection,
  clearForm,
}: CreateNFTCollectionFormProps) => {
  const { handleSubmit, register, setError, formState, reset } =
    useForm<ICollectionData>({
      mode: "onChange",
      resolver: joiResolver(schema),
      defaultValues: {
        name: "",
        symbol: "",
        description: "",
        category: "",
        url: "",
        yoursite: "",
        facebook: "",
        twitter: "",
      },
    });

  const onSubmit = async (data: any) => {
    const collectionData = {
      name: data.name,
      symbol: data.symbol,
      totalsupply: ethers.constants.MaxUint256,
      description: data.description,
      url: data.url,
      yoursite: data.yoursite,
      facebook: data.facebook,
      twitter: data.twitter,
    };
    createCollection(collectionData);
  };
  useEffect(() => {
    if (clearForm) {
      reset({
        name: "",
        symbol: "",
        description: "",
        category: "",
        url: "",
        yoursite: "",
        facebook: "",
        twitter: "",
      });
    }
  }, [clearForm]);

  return (
    <div className={CreateNFTCollectionFormContainer}>
      <div className={formContainer}>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>Name your Collection</label>
          <input
            type="text"
            id="name"
            autoComplete="off"
            {...register("name")}
            placeholder="eg. ‘big skull collection’ "
            className={!formState.errors.name ? inputField : inputFieldError}
          />
          {formState.errors.name && (
            <p className={`text-red-500 ${errMessage}`}>
              {formState.errors.name.message}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>symbol</label>
          <input
            type="text"
            id="symbol"
            autoComplete="off"
            {...register("symbol")}
            placeholder="eg. ‘NTD’ "
            className={!formState.errors.symbol ? inputField : inputFieldError}
          />
          {formState.errors.symbol && (
            <p className={`text-red-500 ${errMessage}`}>
              {formState.errors.symbol.message}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>description</label>
          <span className="text-12px leading-4 text-[#B7BBCC]">
            The description will be included in the collection page underneath
            its image.{" "}
          </span>
          <textarea
            id="description"
            autoComplete="off"
            {...register("description")}
            placeholder="Wrirte some details about your NFTs collection"
            className={
              !formState.errors.description ? inputField : inputFieldError
            }
            cols={20}
            rows={3}
          ></textarea>
          {formState.errors.description && (
            <p className={`text-red-500 ${errMessage}`}>
              {formState.errors.description.message}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label htmlFor="textarea" className={fieldTitle}>
            category
          </label>
          <select
            id="category"
            {...register("category")}
            className={
              !formState.errors.category ? inputField : inputFieldError
            }
          >
            {categories.map((item, key) => {
              return (
                <option value={item === "Select" ? "" : item} key={key}>
                  {item}
                </option>
              );
            })}
          </select>
          {formState.errors.category && (
            <p className={`text-red-500 ${errMessage}`}>
              {formState.errors.category.message}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>
            url <span className="text-gray-shade-17"> (optional)</span>
          </label>
          <input
            type="text"
            id="url"
            autoComplete="off"
            {...register("url")}
            placeholder="https://nethernft.io/collection/ skull- Price"
            className={!formState.errors.url ? inputField : inputFieldError}
          />
          {formState.errors.url && (
            <p className={`text-red-500 ${errMessage}`}>
              {formState.errors.url.message}
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
                  id="yoursite"
                  autoComplete="off"
                  {...register("yoursite")}
                  placeholder="https://yoursite.io"
                  className={
                    !formState.errors.yoursite ? linkField : linkFieldError
                  }
                />
              </div>
              {formState.errors.yoursite && (
                <p className={`text-red-500 ${errMessage}`}>
                  {formState.errors.yoursite.message}
                </p>
              )}
            </div>
            <div>
              <div className={linkInputContainer}>
                <GreyFBIcon className={linkIcon} />
                <input
                  type="text"
                  id="facebook"
                  autoComplete="off"
                  {...register("facebook")}
                  placeholder="https://facebook.com/your profile"
                  className={
                    !formState.errors.facebook ? linkField : linkFieldError
                  }
                />
              </div>
              {formState.errors.facebook && (
                <p className={`text-red-500 ${errMessage}`}>
                  {formState.errors.facebook.message}
                </p>
              )}
            </div>
            <div>
              <div className={linkInputContainer}>
                <GreyTwitterIcon className={linkIcon} />
                <input
                  type="text"
                  id="twitter"
                  autoComplete="off"
                  {...register("twitter")}
                  placeholder="https://Twitter.com/your profile"
                  className={
                    !formState.errors.twitter ? linkField : linkFieldError
                  }
                />
              </div>
              {formState.errors.twitter && (
                <p className={`text-red-500 ${errMessage}`}>
                  {formState.errors.twitter.message}
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
