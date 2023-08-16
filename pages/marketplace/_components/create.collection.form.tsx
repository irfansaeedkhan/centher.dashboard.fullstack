import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";
import clsx from "clsx";
import FinalButton from "@/components/button/final.button";
import { CustomNewModal } from "@/components/modal/custom.new.modal";
import useUser from "@/hooks/use.user";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { categories } from "@/models/nft";
import { GreyWorldIcon, GreyFBIcon, XCollection } from "@/assets/svgs";
import { MetamaskIcon2 } from "@/assets/svgs";
import CustomDropdown from "./custom.dropdown";

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
  description: Joi.string().required().label("description").messages({
    "string.empty": `description Required`,
    "any.required": `Required Field`,
  }),
  url: Joi.string().allow("").optional().max(50).label("url").messages({
    "string.empty": `url Required`,
    "any.required": `Required Field`,
  }),
  yoursite: Joi.string()
    .optional()
    .allow("")
    .uri()
    .required()
    .max(50)
    .label("Personal Site")
    .messages({
      "string.empty": `Personal Site Required`,
      "any.required": `Required Field`,
    }),
  facebook: Joi.string()
    .optional()
    .uri()
    .allow("")
    .required()
    .max(50)
    .label("Facebook link")
    .messages({
      "string.empty": `FB Link Required`,
      "any.required": `Required Field`,
    }),
  twitter: Joi.string()
    .optional()
    .uri()
    .allow("")
    .required()
    .max(50)
    .label("Twitter Link")
    .messages({
      "string.empty": `Twitter Link Required`,
      "any.required": `Required Field`,
    }),
});

interface CreateNFTCollectionFormProps {
  createCollection: any;
  clearForm: boolean;
  cover: Blob | undefined;
  profile: Blob | undefined;
  library: any;
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
  cover,
  profile,
  library,
}: CreateNFTCollectionFormProps) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [categoryError, setCategoryError] = useState(true);
  const { user: loggedInUser } = useUser();
  const { connectWallet } = useConnectWallet();
  const { deactivate } = useWeb3React();
  const [Modal, setModal] = useState(false);
  const [connectWalletModal, setConnectWalletModal] = useState(false);

  const handleSelectOption = (value: string) => {
    setSelectedOption(value);
    setCategoryError(false);
  };

  const { handleSubmit, register, formState, reset } = useForm<ICollectionData>(
    {
      mode: "onChange",
      resolver: joiResolver(schema),
      defaultValues: {
        name: "",
        symbol: "",
        description: "",
        url: "",
        yoursite: "",
        facebook: "",
        twitter: "",
      },
    }
  );

  const onSubmit = async (data: any) => {
    if (selectedOption) {
      setCategoryError(false);
    }
    const collectionData = {
      name: data.name,
      symbol: data.symbol,
      totalsupply: ethers.constants.MaxUint256,
      description: data.description,
      category: selectedOption,
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
        url: "",
        yoursite: "",
        facebook: "",
        twitter: "",
      });
      setSelectedOption("");
    }
  }, [clearForm, reset]);

  return (
    <div className={CreateNFTCollectionFormContainer}>
      <div className={formContainer}>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>
            Name Your Collection <span className="text-red-500">*</span>
          </label>
          <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
            <input
              type="text"
              id="name"
              maxLength={150}
              autoComplete="off"
              {...register("name")}
              placeholder="eg. ‘big skull collection’ "
              className={!formState.errors.name ? inputField : inputFieldError}
            />
          </div>
          {formState.errors.name && (
            <p className={`text-red-500 ${errMessage}`}>
              {formState.errors.name.message}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>
            Symbol <span className="text-red-500">*</span>
          </label>
          <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
            <input
              type="text"
              id="symbol"
              maxLength={150}
              autoComplete="off"
              {...register("symbol")}
              placeholder="eg. ‘NTD’ "
              className={
                !formState.errors.symbol ? inputField : inputFieldError
              }
            />
          </div>
          {formState.errors.symbol && (
            <p className={`text-red-500 ${errMessage}`}>
              {formState.errors.symbol.message}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>
            Description <span className="text-red-500">*</span>
          </label>
          <span className="text-12px leading-4 text-[#B7BBCC]">
            The description will be included in the collection page underneath
            its image.{" "}
          </span>
          <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
            <textarea
              id="description"
              autoComplete="off"
              {...register("description")}
              placeholder="Write some details about your NFTs collection"
              className={clsx(
                !formState.errors.description ? inputField : inputFieldError,
                "customScrollbar2"
              )}
              cols={20}
              rows={6}
            ></textarea>
          </div>
          {formState.errors.description && (
            <p className={`text-red-500 ${errMessage}`}>
              {formState.errors.description.message}
            </p>
          )}
        </div>
        <div className={"z-50 flex w-full flex-col gap-2"}>
          <label htmlFor="category" className={fieldTitle}>
            Category <span className="text-red-500">*</span>
          </label>
          <CustomDropdown
            options={categories.slice(1, categories.length).map((item) => ({
              value: item === "Select" ? "" : item,
              label: item,
            }))}
            selectedValue={selectedOption}
            onSelect={handleSelectOption}
          />
        </div>

        <div className={fieldWrapper}>
          <label className={fieldTitle}>
            URL <span className="text-gray-shade-17"> (optional)</span>
          </label>
          <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
            <input
              type="text"
              id="url"
              autoComplete="off"
              {...register("url")}
              placeholder="eg. https://centher.io/collection/ skull- Price"
              className={!formState.errors.url ? inputField : inputFieldError}
            />
          </div>
          {formState.errors.url && (
            <p className={`text-red-500 ${errMessage}`}>
              {formState.errors.url.message}
            </p>
          )}
        </div>
        <div className={fieldWrapper}>
          <label className={fieldTitle}>
            Add Links <span className="text-gray-shade-17"> (optional)</span>
          </label>
          <div className={linkListContainer}>
            <div>
              <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
                <div className={linkInputContainer}>
                  <GreyWorldIcon className={linkIcon} />
                  <input
                    type="text"
                    id="yoursite"
                    autoComplete="off"
                    {...register("yoursite")}
                    placeholder="eg. https://yoursite.io"
                    className={
                      !formState.errors.yoursite ? linkField : linkFieldError
                    }
                  />
                </div>
              </div>
              {formState.errors.yoursite && (
                <p className={`text-red-500 ${errMessage}`}>
                  {formState.errors.yoursite.message}
                </p>
              )}
            </div>
            <div>
              <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
                <div className={linkInputContainer}>
                  <GreyFBIcon className={linkIcon} />
                  <input
                    type="text"
                    id="facebook"
                    autoComplete="off"
                    {...register("facebook")}
                    placeholder="eg. https://facebook.com/your profile"
                    className={
                      !formState.errors.facebook ? linkField : linkFieldError
                    }
                  />
                </div>
              </div>
              {formState.errors.facebook && (
                <p className={`text-red-500 ${errMessage}`}>
                  {formState.errors.facebook.message}
                </p>
              )}
            </div>
            <div>
              <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
                <div className={linkInputContainer}>
                  <XCollection className={linkIcon} />

                  <input
                    type="text"
                    id="twitter"
                    autoComplete="off"
                    {...register("twitter")}
                    placeholder="eg. https://X.com/your profile"
                    className={
                      !formState.errors.twitter ? linkField : linkFieldError
                    }
                  />
                </div>
              </div>
              {formState.errors.twitter && (
                <p className={`text-red-500 ${errMessage}`}>
                  {formState.errors.twitter.message}
                </p>
              )}
            </div>
          </div>
        </div>
        {!library ? (
          <FinalButton
            title={"Connect Wallet"}
            variant="primary"
            onClick={() => {
              setConnectWalletModal(true);
            }}
            className="mt-2 w-full py-4 hover:scale-75"
          />
        ) : (
          <FinalButton
            title={"Create Collection"}
            variant={
              formState.isValid &&
              profile != undefined &&
              cover != undefined &&
              categoryError === false
                ? "primary"
                : "primary"
            }
            disabled={
              !formState.isValid &&
              profile === undefined &&
              cover === undefined &&
              categoryError
            }
            onClick={handleSubmit(onSubmit)}
            className="mt-2 w-full py-4 hover:scale-95"
          />
        )}
      </div>
      {connectWalletModal && (
        <CustomNewModal
          onClose={() => {
            setConnectWalletModal(false);
          }}
          title={"Connect to wallet"}
        >
          <div className="mb-8 flex w-full justify-center px-5 md:px-10">
            <p className="mt-2 w-full max-w-[366px] text-center text-xs text-gray-shade-14">
              Please Connect your wallet to continue, the system support
              following wallet.
            </p>
          </div>
          <div className="flex w-full justify-center px-5 md:px-10">
            <div className="flex w-full max-w-[400px] items-center justify-between gap-10 rounded-xl border border-brand-primary px-5 py-3">
              <div className="flex items-center gap-3 fsm:gap-6">
                <MetamaskIcon2 />
                <h3 className="text-sm font-semibold text-white fmd:text-base">
                  Metamask
                </h3>
              </div>
              <button
                onClick={async () => {
                  if (!loggedInUser) {
                    toast.error("Please login to buy this nft");
                    setConnectWalletModal(false);
                    return;
                  }
                  const _account = await connectWallet();
                  if (
                    loggedInUser._id.toLowerCase() !== _account?.toLowerCase()
                  ) {
                    toast.error("Please connect to correct account");
                    deactivate();
                  }
                  setConnectWalletModal(false);
                }}
              >
                <FiArrowRight className="h-6 w-6 text-brand-primary fsm:h-8 fsm:w-8" />
              </button>
            </div>
          </div>
        </CustomNewModal>
      )}
    </div>
  );
};
// styling
const CreateNFTCollectionFormContainer = `
 bg-black-shade-9 rounded-2xl relative w-full border border-gray-shade-3 py-8 px-6 flex flex-col gap-6
`;
const formContainer = `
 flex flex-col gap-5
`;
const errMessage = `
pb-2 text-12px font-medium
`;
const fieldWrapper = `
  flex gap-2 flex-col w-full
`;
const fieldTitle = `
  text-14px  font-normal text-white
`;
const inputField = `
  w-full py-3 px-5 !bg-black-shade-3 text-white font-semibold text-14px rounded-lg border-0 focus:outline-none focus:!ring-0
`;
const inputFieldError = `
  ${inputField}
   focus:!ring-red-500
`;
const linkField = `
absolute top-0 left-0 w-full h-full !pl-14 !bg-black-shade-3 text-white font-semibold text-14px rounded-lg border-0 focus:outline-none focus:!ring-0
`;
const linkFieldError = `
  ${linkField}
   focus:!ring-red-500
`;
const linkInputContainer = `
inputItem h-[48px]  w-full !bg-black-shade-3 text-white font-semibold text-14px rounded-lg border-0 focus:outline-none focus:!ring-0 relative
`;
const linkIcon = `
z-30 absolute top-[50%] left-[20px] translate-y-[-50%] stroke-[#45474D] h-5 w-5
`;
const linkListContainer = `
flex flex-col gap-5
`;
