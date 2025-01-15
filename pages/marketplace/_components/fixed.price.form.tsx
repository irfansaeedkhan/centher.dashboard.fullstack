import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosClose } from "react-icons/io";
import Joi from "joi";
import clsx from "clsx";
import { JsonRpcSigner } from "@ethersproject/providers";
import { AddIcon } from "@/assets/svgs";
import Button from "@/components/button";
import { CustomNumberInput } from "@/components/custom-number-input";
import useUser from "@/hooks/use.user";
import { joiResolver } from "@hookform/resolvers/joi";
import { IMyCollection } from "@/hooks/use.get.my.collections";
import useGetUser from "@/hooks/use.get.user";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { formatAddress } from "@/utils/format.address";
import { IModalHandler, ModalManager, TemplateCollection } from "@/utils/modal";
import { CollectionPreviewModal } from "@/components/modal/collection-preview";
import CustomDropdown from "@/pages/marketplace/_components/custom.dropdown";
import { INFTData } from "@/pages/marketplace/_components/create.nft.form";
import AddPropertiesModal from "@/pages/marketplace/_components/add-properties-modal";
import NftPreview from "@/pages/marketplace/_components/nft-preview";
import { ConnectWalletComp } from "@/components/connect.wallet";
import { useWallet } from "@/web3/hooks/use.wallet";

enum ModalType {
  previewNft = "previewNft",
}

// form validations
const schema = Joi.object({
  NFTName: Joi.string().required().max(150).label("NFT Name").messages({
    "string.empty": `NFT Name Required`,
    "any.required": `Required Field`,
  }),
  Description: Joi.string().required().label("Description").messages({
    "string.empty": `Description Required`,
    "any.required": `Required Field`,
  }),
  NFTSupply: Joi.number(),
});
interface FixedPriceFormProps {
  createNFT: (values: INFTData) => void;
  collections: IMyCollection[];
  clearForm: boolean;
  asset: Blob | undefined;
  signer: JsonRpcSigner;
  assetTab: string;
}
interface FormFields {
  NFTName: string;
  Description: string;
  NFTAmount: number | null;
  NFTPrice: number | null;
  NFTSupply: number | null;
  Collection: string;
}

const FixedPriceForm = ({
  createNFT,
  collections,
  clearForm,
  asset,
  signer: library,
  assetTab,
}: FixedPriceFormProps) => {
  const { user: loggedInUser } = useUser();
  const { connectWallet } = useWallet();
  const { user } = useGetUser(loggedInUser?._id);
  const [propertyModal, setPropertyModal] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<any>([]);
  const [propertyList, setPropertyList] = useState<any>([]);
  const [propertyErr, setPropertyErr] = useState<null | string>(null);
  const [ModalModel, setModalModel] = useState<IModalHandler>({
    visibility: false,
    title: "",
    content: "",
  });
  const [changeNFTPrice, setChangeNFTPrice] = useState<number | undefined>(
    undefined
  );
  const [nftPriceError, setNFTPriceError] = useState<string | undefined>(
    undefined
  );
  const [collectionErrorMsg, setCollectionErrorMsg] = useState<
    string | undefined
  >(undefined);
  const [selectedOption, setSelectedOption] = useState(
    collections[0].collection
  );

  const { handleSubmit, register, formState, reset, watch } =
    useForm<FormFields>({
      mode: "onChange",
      resolver: joiResolver(schema),
      defaultValues: {
        NFTName: "",
        Description: "",
        NFTSupply: 1,
      },
    });

  const modalTemplateCollection: TemplateCollection = {
    previewNft: {
      title: "Review your NFT",
      visibility: true,
      content: () => (
        <NftPreview
          asset={asset}
          watch={watch}
          selectedOption={selectedOption}
          changeNFTPrice={changeNFTPrice}
          loggedInUser={loggedInUser!}
          assetTab={assetTab}
          user={user!}
        />
      ),
    },
  };

  const modal = new ModalManager(setModalModel, modalTemplateCollection);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    setCollectionErrorMsg(undefined);
  };

  useEffect(() => {
    if (clearForm) {
      setChangeNFTPrice(undefined);
      setCollectionErrorMsg(undefined);
      setNFTPriceError(undefined);
      reset({
        NFTName: "",
        Description: "",
        NFTSupply: 1,
      });
      setSelectedOption(collections[0].collection);
      setPropertyList([]);
    }
  }, [clearForm, reset, collections]);

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const limitedValue = value.slice(0, 16);
    setPropertyDetails((prev: any) => ({
      ...prev,
      [name]: limitedValue,
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
      supply: data.NFTSupply,
      collection: selectedOption,
      isAuction: false,
      price: changeNFTPrice,
      period: 0,
      properties: propertyList,
    };
    createNFT(finalizedData);
    modal.dismissModal();
  };

  return (
    <div className={formContainer}>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>
          Name Your NFT <span className="text-danger">*</span>{" "}
        </label>
        <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
          <input
            type="text"
            id="NFTName"
            maxLength={150}
            autoComplete="off"
            {...register("NFTName")}
            placeholder="eg. &#34;big skull&#34;"
            className={clsx(
              !formState.errors.NFTName ? inputField : inputFieldError
            )}
          />
        </div>
        {formState.errors.NFTName && (
          <p className={`text-danger ${errMessage}`}>
            {formState.errors.NFTName.message}
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>
          Description <span className="text-danger">*</span>{" "}
        </label>
        <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
          <textarea
            id="Description"
            autoComplete="off"
            {...register("Description")}
            placeholder="Write some details about your NFT"
            className={clsx(
              !formState.errors.NFTName ? inputField : inputFieldError,
              "customScrollbar2"
            )}
            cols={20}
            rows={6}
          ></textarea>
        </div>
        {formState.errors.Description && (
          <p className={`text-danger ${errMessage}`}>
            {formState.errors.Description.message}
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>
          NFT Price <span className="text-danger">*</span>{" "}
        </label>
        <div
          className={clsx(
            "!rounded-lg p-[1px]",
            !nftPriceError
              ? "focus-within:gradient-border-3"
              : "focus-within:ring-1 focus-within:ring-red-500"
          )}
        >
          <div className="flex items-center justify-between gap-3 !rounded-lg bg-black-shade-3 px-5 py-3">
            <CustomNumberInput
              value={changeNFTPrice === undefined ? "" : changeNFTPrice}
              id="NFTPrice"
              autoComplete="off"
              placeholder="Enter NFT Price"
              className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-white focus:outline-none focus:ring-0"
              onChange={(e) => {
                setNFTPriceError(undefined);
                const inputValue = e.target.value;
                const numberValue = Number(inputValue);
                const pattern = /^\d*\.?\d+$/; // Regular expression to match positive integers and positive floating numbers
                if (pattern.test(inputValue)) {
                  if (numberValue <= 0) {
                    setNFTPriceError("NFT Price must be greater than 0");
                    setChangeNFTPrice(undefined);
                  }
                  if (numberValue < BlockchainConfig.networkDecimals) {
                    setNFTPriceError(
                      "NFT Price must be greater than 0.000000000000000001"
                    );
                    setChangeNFTPrice(undefined);
                  }
                  setChangeNFTPrice(numberValue);
                } else if (e.target.value == "") {
                  setNFTPriceError("Field Required");
                  setChangeNFTPrice(undefined);
                } else {
                  setNFTPriceError("NFT Price must be a positive number");
                  setChangeNFTPrice(undefined);
                }
              }}
            />
            <span className="text-gradient w-fit text-sm">BNB</span>
          </div>
        </div>
        {nftPriceError !== "" && (
          <p className={`text-danger ${errMessage}`}>{nftPriceError}</p>
        )}
      </div>
      <div className={"z-50 flex w-full flex-col gap-2"}>
        <label htmlFor="textarea" className={fieldTitle}>
          Collection <span className="text-danger">*</span>{" "}
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
          Supply <span className="text-danger">*</span>{" "}
        </label>
        <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
          <input
            type="number"
            id="NFTSupply"
            autoComplete="off"
            {...register("NFTSupply")}
            placeholder="eg. 1"
            className={clsx(
              !formState.errors.NFTSupply ? inputField : inputFieldError
            )}
          />
        </div>
        {formState.errors.NFTSupply && (
          <p className={`text-danger ${errMessage}`}>
            {formState.errors.NFTSupply.message}
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>
          Properties{"  "}
          <span className="text-sm  font-normal text-gray-shade-7">
            (optional)
          </span>
        </label>
        <div className={addPropertyBtn}>
          <span>Add new properties (max 9)</span>
          {propertyList.length < 9 && (
            <button
              onClick={() => {
                setPropertyModal(true);
              }}
            >
              <AddIcon />
            </button>
          )}
        </div>
      </div>
      {propertyList?.length > 0 && (
        <div
          className={
            "flex flex-wrap gap-[2%] rounded-[14px] bg-black-shade-3 px-5 py-6"
          }
        >
          {propertyList.map((item: any, index: number) => {
            return (
              <div key={index} className={properyCard}>
                <button
                  className="absolute right-[-4px] top-[-4px] flex h-5 w-5 items-center justify-center rounded-full border border-gray-shade-3 bg-elevation-1 text-center"
                  onClick={() => {
                    handlePropertyRemove(item.PropertyName);
                  }}
                >
                  <IoIosClose className="text-xl text-white" />
                </button>
                <h5 className={PropertyName}>{item.PropertyName}</h5>
                <h6 className={Type}>{item.Type}</h6>
              </div>
            );
          })}{" "}
        </div>
      )}

      {!library ? (
        <ConnectWalletComp authType="login" connectWallet={connectWallet} />
      ) : (
        <div className="mt-2 flex flex-col items-center gap-2 fsm:flex-row">
          <Button
            title={"Preview"}
            variant={"secondary"}
            disabled={
              !formState.isValid ||
              watch("NFTName") === "" ||
              asset === undefined ||
              watch("Description") === "" ||
              selectedOption === undefined ||
              changeNFTPrice === undefined
            }
            onClick={() => {
              modal.createModal(ModalType.previewNft);
            }}
            className="w-full"
          />
          <Button
            title={"Create NFT"}
            variant={
              formState.isValid &&
              asset !== undefined &&
              nftPriceError === undefined &&
              collectionErrorMsg == undefined &&
              changeNFTPrice !== undefined
                ? "primary"
                : "secondary"
            }
            disabled={!formState.isValid || asset === undefined}
            onClick={handleSubmit(onSubmit)}
            className="w-full"
          />
        </div>
      )}

      {propertyModal && (
        <AddPropertiesModal
          addNewPropertyFunc={addNewPropertyFunc}
          handlePropertyChange={handlePropertyChange}
          propertyDetails={propertyDetails}
          setPropertyModal={setPropertyModal}
          propertyErr={propertyErr}
        />
      )}

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

export default FixedPriceForm;

// styling
const formContainer = `flex flex-col gap-4`;
const errMessage = `pb-2 text-xs font-medium`;
const fieldWrapper = `flex gap-2 flex-col w-full`;
const fieldTitle = `text-sm text-start font-normal text-white`;
const inputField = `w-full py-3 px-5 bg-black-shade-3 text-white font-semibold text-sm rounded-lg border-0 focus:outline-none focus:ring-0`;
const inputFieldError = `${inputField} focus:!ring-red-500`;
const addPropertyBtn = `flex items-center justify-between w-full py-3 px-5 bg-black-shade-3 text-gray-shade-17 font-semibold text-sm rounded-lg focus:border h-[48px]`;
const properyCard = `gradientborders2 rounded-10px flex flex-col items-center justify-center h-[98px] p-[2px] gap-3 bg-background-shade-2 w-full lg:max-w-[32%] mb-[2%] relative`;
const PropertyName = `text-xs font-medium textGradient`;
const Type = `text-sm font-semibold text-white`;
