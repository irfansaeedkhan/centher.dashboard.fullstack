import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import clsx from "clsx";
import { JsonRpcSigner } from "@ethersproject/providers";
import Button from "@/components/button";
import { CollectionPreviewModal } from "@/components/modal/collection-preview";
import { ConnectWalletComp } from "@/components/connect.wallet";
import useUser from "@/hooks/use.user";
import { categories } from "@/models/nft";
import { GreyWorldIcon, GreyFBIcon, XLogo, MetamaskIcon2 } from "@/assets/svgs";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import { useWallet } from "@/web3/hooks/use.wallet";
import CustomDropdown from "@/pages/marketplace/_components/custom.dropdown";
import CollectionPreview from "@/pages/marketplace/_components/collection-preview";

enum ModalType {
  previewCollection = "previewCollection",
}

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
  signer: JsonRpcSigner;
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
}: CreateNFTCollectionFormProps) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [categoryError, setCategoryError] = useState(true);
  const { user: loggedInUser } = useUser();
  const { getSigner, connectWallet, connectedAddress, disconnectWallet } =
    useWallet();
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });

  const { handleSubmit, register, formState, reset, watch } =
    useForm<ICollectionData>({
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
    });

  const modalTemplateCollection: TemplateCollection = {
    previewCollection: {
      title: "Preview Collection",
      visibility: true,
      content: () => (
        <CollectionPreview
          watch={watch}
          cover={cover}
          profile={profile}
          loggedInUser={loggedInUser!}
        />
      ),
    },
  };

  const modal = new ModalManager(setModalModel, modalTemplateCollection);

  const handleSelectOption = (value: string) => {
    setSelectedOption(value);
    setCategoryError(false);
  };

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
    <div className="relative flex w-full flex-col gap-6 rounded-2xl border border-gray-shade-3 bg-black-shade-9 px-6 py-8">
      <div className="flex flex-col gap-5">
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
          <span className="text-xs leading-4 text-[#B7BBCC]">
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
              placeholder="eg. https://centher.io/collection/skull-price"
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
          <div className="flex flex-col gap-5">
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
                    placeholder="eg. https://facebook.com/username"
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
                  <XLogo className={linkIcon} />

                  <input
                    type="text"
                    id="twitter"
                    autoComplete="off"
                    {...register("twitter")}
                    placeholder="eg. https://X.com/username"
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
        {!getSigner() ? (
          <ConnectWalletComp
            connectWallet={connectWallet}
            connectedAddress={connectedAddress}
            disconnectWallet={disconnectWallet}
            authType="login"
            className="mt-2 w-full py-4"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 fsm:flex-row">
            <Button
              title={"Preview"}
              variant={"secondary"}
              disabled={
                !formState.isValid ||
                watch("name") === "" ||
                watch("symbol") === "" ||
                watch("description") === "" ||
                profile === undefined ||
                cover === undefined ||
                categoryError
              }
              onClick={() => {
                modal.createModal(ModalType.previewCollection);
              }}
              className="mt-2 w-full"
            />
            <Button
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
                !formState.isValid ||
                profile === undefined ||
                cover === undefined ||
                categoryError
              }
              onClick={handleSubmit(onSubmit)}
              className="mt-2 w-full"
            />
          </div>
        )}
      </div>
      {ModalModel.visibility && (
        <CollectionPreviewModal
          onClose={() => {
            modal.dismissModal();
          }}
          title={ModalModel.title as string}
          onSubmit={handleSubmit(onSubmit)}
        >
          {ModalModel.content}
        </CollectionPreviewModal>
      )}
    </div>
  );
};
// styling

const errMessage = `pb-2 text-xs font-medium`;
const fieldWrapper = `flex gap-2 flex-col w-full`;
const fieldTitle = `text-sm font-normal text-white`;
const inputField = `w-full py-3 px-5 !bg-black-shade-3 text-white font-semibold text-sm rounded-lg border-0 focus:outline-none focus:!ring-0`;
const inputFieldError = `${inputField} focus:!ring-red-500`;
const linkField = `absolute top-0 left-0 w-full h-full !pl-14 !bg-black-shade-3 text-white font-semibold text-sm rounded-lg border-0 focus:outline-none focus:!ring-0`;
const linkFieldError = `${linkField} focus:!ring-red-500`;
const linkInputContainer = `inputItem h-[48px] w-full !bg-black-shade-3 text-white font-semibold text-sm rounded-lg border-0 focus:outline-none focus:!ring-0 relative`;
const linkIcon = `z-30 absolute top-[50%] left-[20px] translate-y-[-50%] stroke-[#45474D] h-5 w-5`;
