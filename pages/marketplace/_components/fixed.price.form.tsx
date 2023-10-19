import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useWeb3React } from "@web3-react/core";
import { FiArrowRight } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-hot-toast";
import Joi from "joi";
import clsx from "clsx";
import Button from "@/components/button";
import { CustomModal } from "@/components/modal/custom.modal";
import { CustomNumberInput } from "@/components/custom-number-input";
import { CustomNewModal } from "@/components/modal/custom.new.modal";
import { AddIcon, MetamaskIcon2 } from "@/assets/svgs";
import { formatAddress } from "@/utils/format.address";
import { IMyCollection } from "@/hooks/use.get.my.collections";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import useUser from "@/hooks/use.user";
import CustomDropdown from "./custom.dropdown";

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
  createNFT: any;
  collections: IMyCollection[];
  clearForm: boolean;
  asset: Blob | undefined;
  library: any;
}
interface FormFields {
  NFTName: String;
  Description: String;
  NFTAmount: number | null;
  NFTPrice: number | null;
  NFTSupply: number | null;
  Collection: String;
}
// TODO: Kindly fix any types
const FixedPriceForm = ({
  createNFT,
  collections,
  clearForm,
  asset,
  library,
}: FixedPriceFormProps) => {
  const { user: loggedInUser } = useUser();
  const { connectWallet } = useConnectWallet();
  const { deactivate } = useWeb3React();
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [propertyModal, setPropertyModal] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<any>([]);
  const [propertyList, setPropertyList] = useState<any>([]);
  const [propertyErr, setPropertyErr] = useState<null | string>(null);
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
  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    setCollectionErrorMsg(undefined);
  };

  const { handleSubmit, register, setError, formState, reset } =
    useForm<FormFields>({
      mode: "onChange",
      resolver: joiResolver(schema),
      defaultValues: {
        NFTName: "",
        Description: "",
        NFTSupply: 1,
        // NFTPrice: null,
        // Collection: "",
      },
    });

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

  return (
    <div className={formContainer}>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>
          Name Your NFT <span className="text-red-500">*</span>{" "}
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
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.NFTName.message}
          </p>
        )}
      </div>
      <div className={fieldWrapper}>
        <label className={fieldTitle}>
          Description <span className="text-red-500">*</span>{" "}
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
          <span className="textGradient absolute right-2 top-[50%] translate-x-[-50%] text-sm leading-[0]">
            BNB
          </span>
          <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
            <CustomNumberInput
              value={changeNFTPrice === undefined ? "" : changeNFTPrice}
              id="NFTPrice"
              autoComplete="off"
              placeholder="Enter NFT Price"
              className={!nftPriceError ? inputField : inputFieldError}
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
          </div>
        </div>
        {nftPriceError !== "" && (
          <p className={`text-red-500 ${errMessage}`}>{nftPriceError}</p>
        )}
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
          Supply <span className="text-red-500">*</span>{" "}
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
          <p className={`text-red-500 ${errMessage}`}>
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
        <Button
          title={"Connect Wallet"}
          variant="primary"
          onClick={() => {
            setConnectWalletModal(true);
          }}
        />
      ) : (
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
          className="mt-2"
        />
      )}

      {propertyModal && (
        <CustomModal
          onClose={() => {
            setPropertyModal(false);
          }}
          title={"Add new properties"}
        >
          <div className={modalBodyWrapper}>
            <div className={fieldWrapper}>
              <label className={fieldTitle}>Name</label>
              <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
                <input
                  type="text"
                  name="PropertyName"
                  id="PropertyName"
                  autoComplete="off"
                  placeholder="Male"
                  className={inputFieldModal}
                  onChange={handlePropertyChange}
                  value={propertyDetails.PropertyName}
                />
              </div>
            </div>
            <div className={fieldWrapper}>
              <label className={fieldTitle}>Type</label>
              <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
                <input
                  type="text"
                  name="Type"
                  id="Type"
                  autoComplete="off"
                  placeholder="Character"
                  className={inputFieldModal}
                  onChange={handlePropertyChange}
                  value={propertyDetails.Type}
                />
              </div>
            </div>
            {propertyErr && (
              <p className={`text-red-500 ${errMessage}`}>{propertyErr}</p>
            )}
            <Button
              title={"Save"}
              variant="primary"
              onClick={addNewPropertyFunc}
              className="mt-2"
            />
          </div>
        </CustomModal>
      )}
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

export default FixedPriceForm;

// styling
const formContainer = `
 flex flex-col gap-4
`;
const errMessage = `
pb-2 text-xs font-medium
`;
const fieldWrapper = `
  flex gap-2 flex-col w-full
`;
const fieldTitle = `
text-sm text-start font-normal text-white
`;
const inputField = `
w-full py-3 px-5 bg-black-shade-3 text-white font-semibold text-sm rounded-lg border-0 focus:outline-none focus:ring-0
`;
const inputFieldModal = `
w-full py-3 px-5 !bg-black-shade-2 text-white font-semibold text-sm rounded-lg border-0 focus:outline-none ring-black-shade-7 ring-2 focus:ring-0 active:!ring-brand-primary
`;
const inputFieldError = `
  ${inputField}
   focus:!ring-red-500
`;
const addPropertyBtn = `
flex items-center justify-between w-full py-3 px-5 !bg-black-shade-3 text-gray-shade-17 font-semibold text-sm rounded-lg border-0 focus:outline-none focus:ring-brand-primary h-[48px]
`;
const modalBodyWrapper = `
flex flex-col gap-2 w-full mt-8 text-center p-[2px]
`;

const properyCard = `
gradientborders2 rounded-10px flex flex-col items-center justify-center h-[98px] p-[2px] gap-3 bg-background-shade-2 w-full lg:max-w-[32%] mb-[2%] relative
`;
const PropertyName = `
text-xs font-medium textGradient
`;
const Type = `
text-sm font-semibold text-white
`;
