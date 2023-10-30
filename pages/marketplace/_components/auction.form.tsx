import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import moment from "moment";
import Joi from "joi";
import clsx from "clsx";
import Button from "@/components/button";
import { CustomNumberInput } from "@/components/custom-number-input";
import { formatAddress } from "@/utils/format.address";
import { IMyCollection } from "@/hooks/use.get.my.collections";
import useUser from "@/hooks/use.user";
import { useWallet } from "@/web3/hooks/use.wallet";
import { AddIcon } from "@/assets/svgs";
import cn from "@/utils/cn";
import CustomDropdown from "./custom.dropdown";
import ConnectWalletModal from "./connect-wallet-modal";
import AddPropertiesModal from "./add-properties-modal";

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

  AuctionEndTime: Joi.date().required().label("Auction End Time").messages({
    "string.empty": `AuctionEndTime Required`,
    "any.required": `Required Field`,
  }),
  StartingNFTPrice: Joi.number()
    .greater(0)
    .required()
    .label("NFT Price")
    .messages({
      "string.empty": `StartingNFTPrice Required`,
      "any.required": `Required Field`,
    }),
});

interface AuctionFormFields {
  NFTName: string;
  Description: string;
  AuctionEndTime: string;
  StartingNFTPrice: number | null;
}
interface AuctionFormProps {
  createNFT: any;
  collections: IMyCollection[];
  clearForm: boolean;
  asset: Blob | undefined;
  library: any;
}
const AuctionForm = ({
  createNFT,
  collections,
  clearForm,
  asset,
  library,
}: AuctionFormProps) => {
  const { user: loggedInUser } = useUser();
  const { disconnectWallet, connectWallet } = useWallet();
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [propertyModal, setPropertyModal] = useState(false);
  const [AuctionEndTimeErr, setAuctionEndTimeErr] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<any>([]);
  const [propertyList, setPropertyList] = useState<any>([]);
  const [propertyErr, setPropertyErr] = useState<null | string>(null);
  const [collectionErrorMsg, setCollectionErrorMsg] = useState<any>("");
  const [selectedOption, setSelectedOption] = useState(
    collections[0].collection
  );
  const today = new Date();

  // Add 7 days to today's date
  let futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 7);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    setCollectionErrorMsg("");
  };

  const { handleSubmit, register, formState, reset } =
    useForm<AuctionFormFields>({
      mode: "onChange",
      resolver: joiResolver(schema),
      defaultValues: {
        NFTName: "",
        Description: "",
        AuctionEndTime: "",
        StartingNFTPrice: null,
      },
    });

  // function to add/remove dynamic property
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

  const onSubmit = async (data: any) => {
    if (!selectedOption) {
      setCollectionErrorMsg("Field Required");
      return;
    }
    if (moment(data.AuctionEndTime) <= moment()) {
      setAuctionEndTimeErr(true);
      return;
    } else {
      setAuctionEndTimeErr(false);
    }

    let finalizedData = {
      name: data.NFTName,
      description: data.Description,
      supply: 1,
      collection: selectedOption,
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
        AuctionEndTime: "",
        StartingNFTPrice: null,
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
        <div className="focus-within:gradient-border-3 !rounded-lg p-[1px]">
          <input
            type="text"
            id="NFTName"
            maxLength={150}
            autoComplete="off"
            {...register("NFTName")}
            placeholder="eg. &#34;big skull&#34;"
            className={!formState.errors.NFTName ? inputField : inputFieldError}
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
              !formState.errors.Description ? inputField : inputFieldError,
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
          Set Auction End Time <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="date"
          id="AuctionEndTime"
          autoComplete="off"
          min={new Date().toISOString().split("T")[0]}
          max={futureDate.toISOString().split("T")[0]}
          {...register("AuctionEndTime")}
          placeholder="Set Auction End Time"
          className={cn(
            `dateInput`,
            !formState.errors.AuctionEndTime ? inputField : inputFieldError
          )}
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
        <div
          className={clsx(
            "!rounded-lg p-[1px]",
            !formState.errors.StartingNFTPrice
              ? "focus-within:gradient-border-3"
              : "focus-within:ring-1 focus-within:ring-red-500"
          )}
        >
          <div className="flex items-center justify-between gap-3 !rounded-lg bg-black-shade-3 px-5 py-3">
            <CustomNumberInput
              {...register("StartingNFTPrice")}
              id="StartingNFTPrice"
              autoComplete="off"
              placeholder="Enter NFT Price"
              min={0}
              className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-white focus:outline-none focus:ring-0"
            />
            <span className="text-gradient w-fit text-sm">BNB</span>
          </div>
        </div>
        {formState.errors.StartingNFTPrice && (
          <p className={`text-red-500 ${errMessage}`}>
            {formState.errors.StartingNFTPrice.message}
          </p>
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
        <label className={fieldTitle}>Properties</label>
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
            formState.isValid && asset !== undefined && collectionErrorMsg == ""
              ? "primary"
              : "secondary"
          }
          disabled={!formState.isValid || asset === undefined}
          onClick={handleSubmit(onSubmit)}
          className="mt-2"
        />
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
      {connectWalletModal && (
        <ConnectWalletModal
          connectWallet={connectWallet}
          deactivate={disconnectWallet}
          loggedInUser={loggedInUser}
          setConnectWalletModal={setConnectWalletModal}
        />
      )}
    </div>
  );
};

export default AuctionForm;

// styling
const formContainer = `flex flex-col gap-4`;
const errMessage = `pb-2 text-xs font-medium`;
const fieldWrapper = `flex gap-2 flex-col w-full`;
const Type = `text-sm font-semibold text-white`;
const PropertyName = `text-xs font-medium textGradient`;
const fieldTitle = `text-sm text-start font-normal text-white`;
const inputField = `w-full py-3 px-5 bg-black-shade-3 text-white font-semibold text-sm rounded-lg border-0 focus:outline-none focus:ring-0`;
const inputFieldError = `${inputField} focus:!ring-red-500`;
const addPropertyBtn = `flex items-center justify-between w-full py-3 px-5 !bg-black-shade-3 text-gray-shade-17 font-semibold text-sm rounded-lg border-0 focus:outline-none focus:ring-brand-primary h-[48px]`;
const properyCard = `gradientborders2 rounded-10px flex flex-col items-center justify-center h-[98px] p-[2px] gap-3 bg-background-shade-2 w-full lg:max-w-[32%] mb-[2%] relative`;
