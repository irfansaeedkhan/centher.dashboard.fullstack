import React, { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import clsx from "clsx";
import { BsPlusCircle } from "react-icons/bs";

import { CustomModal } from "@/components/modal/custom.modal";
import { IoIosClose } from "react-icons/io";
import FinalButton from "@/components/button/final.button";
import {
  levelDataType,
  metaDataType,
  stakingFormInterface,
} from "../../_components/staking-types";

interface FormOneProps {
  getStakingFormOneData: (prop: stakingFormInterface) => void;
}
export const CreateStakingFormOne: React.FC<FormOneProps> = ({
  getStakingFormOneData,
}) => {
  // handle dynamic metadata
  const [metaDataDetails, setMetaDataDetails] = useState<metaDataType>({
    title: "",
    data: "",
  });
  const [metaDataModal, setMetaDataModal] = useState(false);
  const [metaDataErr, setMetaDataErr] = useState<null | string>(null);
  const [metaDataList, setMetaDataList] = useState<metaDataType[]>([]);

  const handleMetaDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const limitedValue = value.slice(0, 16);
    setMetaDataDetails((prev: any) => ({
      ...prev,
      [name]: limitedValue,
    }));
  };
  const addNewMetaDataFunc = () => {
    if (
      metaDataDetails?.title === null ||
      metaDataDetails?.title?.match(/^ *$/) !== null
    ) {
      setMetaDataErr("title/Name value missing");
      return;
    } else if (
      metaDataDetails?.data === null ||
      metaDataDetails?.data?.match(/^ *$/) !== null
    ) {
      setMetaDataErr("title/Name value missing");
      return;
    }
    setMetaDataErr("");
    setMetaDataList((current: any) => [...current, metaDataDetails]);
    setMetaDataModal(false);
    setMetaDataDetails({
      title: "",
      data: "",
    });
  };
  const handleMetaDataRemove = (prop: any) => {
    setMetaDataList(metaDataList.filter((item: any) => item?.title != prop));
  };

  // level system
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [inputValues, setInputValues] = useState<levelDataType[]>([]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const newSelectedValue: string = event.target.value;
    setSelectedValue(newSelectedValue);
    if (newSelectedValue === "No referral") {
      setInputValues([]);
    } else if (
      newSelectedValue === "Recurring Return (0 to 6 levels)" ||
      newSelectedValue === "Fix Commission (0 to 6 levels)"
    ) {
      const numLevels: number = 6;
      const newInputValues: levelDataType[] = Array.from(
        { length: numLevels },
        (_, index) => ({
          level: index + 1,
          percent: 0, // You can set the default percent value here, if needed
        })
      );
      setInputValues(newInputValues);
    } else {
      setInputValues([]);
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const inputValue: string = event.target.value;

    // Check if the input value is a valid number (integer or decimal)
    const numericValue: number = parseFloat(inputValue);
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      const newInputValues: levelDataType[] = [...inputValues];
      newInputValues[index].percent = numericValue;
      setInputValues(newInputValues);
    } else {
      // If the input value is not a valid number, set it to an empty string
      const newInputValues: levelDataType[] = [...inputValues];
      newInputValues[index].percent = 0; // You can set the default percent value here, if needed
      setInputValues(newInputValues);
    }
  };

  const renderInputFields = (): JSX.Element[] => {
    const numLevels: number = inputValues.length;

    return Array.from({ length: numLevels }, (_, index) => (
      <div
        key={index}
        className={clsx(
          `text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0 ${
            index === numLevels - 1 && index % 2 === 0 && "col-span-2"
          }`
        )}
      >
        <label
          htmlFor={`level-${index + 1}`}
          className="block font-normal tracking-wide"
        >
          Level {index + 1}
        </label>
        <input
          type="number"
          name={`level-${index + 1}`}
          id={`level-${index + 1}`}
          placeholder="%"
          className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
          value={inputValues[index]?.percent || ""}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(event, index)
          }
          pattern="[0-9]+(\.[0-9]+)?" // Allows integer and decimal numbers
          title="Please enter numbers only"
          required
        />
      </div>
    ));
  };

  const stakingFormSchema = Joi.object({
    pack: Joi.string().max(200).label("pack"),
    token_address: Joi.string().max(200).label("token address"),
    multilevel_rewards: Joi.string().max(100).label("multilevel rewards"),
    apy: Joi.number().max(9999999999999999999).label("apy"),
    staking_period: Joi.string().max(150).label("staking period"),
    start_time: Joi.string().max(150).label("start time"),
    claim_period: Joi.string().max(150).label("claim period"),
    show_on_centher: Joi.string().max(10).label("show on centher"),
    liquidity_pool_provided: Joi.string()
      .max(10)
      .label("liquidity pool provided"),
    is_cancelable: Joi.string().max(10).label("is cancelable"),
    charge_fee_on_cancel: Joi.number()
      .max(9999999999999999999)
      .label("charge fee on cancel"),
    min_staking_amount: Joi.number()
      .max(9999999999999999999)
      .label("min staking amount"),
    max_staking_amount: Joi.number()
      .max(9999999999999999999)
      .label("max staking amount"),
  });

  const stakingForm = useForm<stakingFormInterface>({
    mode: "onChange",
    resolver: joiResolver(stakingFormSchema),
  });

  const handleDetails = (data: stakingFormInterface) => {
    if (
      data.multilevel_rewards === "Recurring Return (0 to 6 levels)" ||
      data.multilevel_rewards === "Fix Commission (0 to 6 levels)"
    ) {
      inputValues.map((data) => {
        if (data.percent === null || data.percent === undefined) {
          return;
        }
      });
    }
    let finalData = {
      pack: data.pack,
      token_address: data.token_address,
      multilevel_rewards: data.multilevel_rewards,
      apy: data.apy,
      staking_period: data.staking_period,
      start_time: data.start_time,
      claim_period: data.claim_period,
      show_on_centher: data.show_on_centher,
      liquidity_pool_provided: data.liquidity_pool_provided,
      is_cancelable: data.is_cancelable,
      charge_fee_on_cancel: data.charge_fee_on_cancel,
      min_staking_amount: data.min_staking_amount,
      max_staking_amount: data.max_staking_amount,
      project_metadata: metaDataList,
      rewards_level: inputValues,
    };

    getStakingFormOneData(finalData);
    stakingForm.reset({
      pack: "",
      token_address: "",
      multilevel_rewards: "",
      apy: null,
      staking_period: "",
      start_time: "",
      claim_period: "",
      show_on_centher: "yes",
      liquidity_pool_provided: "yes",
      is_cancelable: "yes",
      charge_fee_on_cancel: null,
      min_staking_amount: null,
      max_staking_amount: null,
    });
    setMetaDataList([]);
    setInputValues([]);
    setSelectedValue("");
  };

  /* 
  its custom design drpdown will add if required
      // const [selectedOptionMultilevel, setSelectedOptionMultilevel] = useState("");
  // const [multilevelError, setMultilevelError] = useState(true);
  // const handleSelectOption = (value: string) => {
  //   setSelectedOptionMultilevel(value);
  //   setMultilevelError(false);
  // };

    <CustomDropdown
     options={multilevel.slice(1, multilevel.length).map((item) => ({
      value: item === "Select Any" ? "" : item,
       label: item,
     }))}
     selectedValue={selectedOptionMultilevel}
    onSelect={handleSelectOption}
   /> */
  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-6 rounded-[20px] border-2 border-gray-shade-3 bg-black-shade-9 p-6">
        <div className="mb-2 grid w-full gap-6 md:grid-cols-2">
          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:mb-0">
            <label htmlFor="pack" className="block font-normal tracking-wide">
              Staking Project Name
            </label>
            <input
              type="text"
              {...stakingForm.register("pack")}
              id="pack"
              placeholder="For example: DeXa Pack 1"
              className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
            />
            {stakingForm.formState.errors.pack && (
              <p className={`text-12px pb-2 font-medium text-red-500`}>
                {stakingForm.formState.errors.pack.message}
              </p>
            )}
          </div>

          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label
              htmlFor="token_address"
              className="block font-normal tracking-wide"
            >
              Toke Address
            </label>
            <input
              type="text"
              {...stakingForm.register("token_address")}
              id="token_address"
              placeholder="Add address here"
              className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
            />
            {stakingForm.formState.errors.token_address && (
              <p className={`text-12px pb-2 font-medium text-red-500`}>
                {stakingForm.formState.errors.token_address.message}
              </p>
            )}
          </div>

          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label
              htmlFor="multilevel_rewards"
              className="block font-normal tracking-wide"
            >
              Multilevel Rewards System
            </label>
            <select
              {...stakingForm.register("multilevel_rewards")}
              id="multilevel_rewards"
              className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
              value={selectedValue}
              onChange={handleChange}
            >
              <option value="" className="bg-black text-gray-shade-17">
                Select Any
              </option>
              <option className="bg-black text-white" value="No referral">
                No referral
              </option>
              <option
                className="bg-black text-white"
                value="Recurring Return (0 to 6 levels)"
              >
                Recurring Return (0 to 6 levels)
              </option>
              <option
                className="bg-black text-white"
                value="Fix Commission (0 to 6 levels)"
              >
                Fix Commission (0 to 6 levels)
              </option>
            </select>
            {stakingForm.formState.errors.multilevel_rewards && (
              <p className={`text-12px pb-2 font-medium text-red-500`}>
                {stakingForm.formState.errors.multilevel_rewards.message}
              </p>
            )}
          </div>
          {renderInputFields()}
          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label htmlFor="apy" className="block font-normal tracking-wide">
              APY
            </label>
            <input
              type="number"
              {...stakingForm.register("apy")}
              id="apy"
              placeholder="Only numbers here"
              className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
            />
            {stakingForm.formState.errors.apy && (
              <p className={`text-12px pb-2 font-medium text-red-500`}>
                {stakingForm.formState.errors.apy.message}
              </p>
            )}
          </div>

          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label
              htmlFor="staking_period"
              className="block font-normal tracking-wide"
            >
              Staking Period
            </label>
            <select
              {...stakingForm.register("staking_period")}
              id="staking_period"
              className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
            >
              <option className="bg-black text-gray-shade-17" value="">
                Select Any
              </option>
              <option className="bg-black text-white" value="15 days">
                15 days
              </option>
              <option className="bg-black text-white" value="30 days">
                30 days
              </option>
            </select>
            {stakingForm.formState.errors.staking_period && (
              <p className={`text-12px pb-2 font-medium text-red-500`}>
                {stakingForm.formState.errors.staking_period.message}
              </p>
            )}
          </div>

          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label
              htmlFor="start_time"
              className="block font-normal tracking-wide"
            >
              Rewards Release Start
            </label>
            <select
              {...stakingForm.register("start_time")}
              id="start_time"
              className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
            >
              <option className="bg-black text-gray-shade-17" value="">
                Select Any
              </option>
              <option className="bg-black text-white" value="after 15 days">
                after 15 days
              </option>
              <option className="bg-black text-white" value="after 30 days">
                after 30 days
              </option>
              <option
                className="bg-black text-white"
                value="according to claim period"
              >
                according to claim period
              </option>
            </select>
            {stakingForm.formState.errors.start_time && (
              <p className={`text-12px pb-2 font-medium text-red-500`}>
                {stakingForm.formState.errors.start_time.message}
              </p>
            )}
          </div>

          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label
              htmlFor="claim_period"
              className="block font-normal tracking-wide"
            >
              Claim Period
            </label>
            <select
              {...stakingForm.register("claim_period")}
              id="claim_period"
              className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
            >
              <option className="bg-black text-gray-shade-17" value="">
                Select Any
              </option>
              <option className="bg-black text-white" value="15 days">
                15 days
              </option>
              <option className="bg-black text-white" value="30 days">
                30 days
              </option>
            </select>
            {stakingForm.formState.errors.claim_period && (
              <p className={`text-12px pb-2 font-medium text-red-500`}>
                {stakingForm.formState.errors.claim_period.message}
              </p>
            )}
          </div>

          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label
              htmlFor="show_on_centher"
              className="block font-normal tracking-wide"
            >
              Show on Centher
            </label>
            <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
              <label
                htmlFor="show_on_centher"
                className="block font-normal tracking-wide"
              >
                Show on Centher
              </label>
              <div className=" flex flex-wrap gap-5">
                <div className=" flex items-center">
                  <input
                    id="red-radio1"
                    type="radio"
                    value="no"
                    {...stakingForm.register("show_on_centher")}
                    className="red-radio text-14px h-4 w-4"
                  />
                  <label
                    htmlFor="red-radio1"
                    className="text-sm font-medium text-white"
                  >
                    No
                  </label>
                </div>
                <div className=" flex items-center">
                  <input
                    id="green-radio1"
                    type="radio"
                    value="yes"
                    {...stakingForm.register("show_on_centher")}
                    className="green-radio text-14px h-4 w-4"
                  />
                  <label
                    htmlFor="green-radio1"
                    className="text-sm font-medium text-white"
                  >
                    Yes
                  </label>
                </div>
              </div>
              {stakingForm.formState.errors.show_on_centher && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {stakingForm.formState.errors.show_on_centher.message}
                </p>
              )}
            </div>
          </div>

          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label
              htmlFor="liquidity_pool_provided"
              className="block font-normal tracking-wide"
            >
              Liquidity Pool Provided
            </label>
            <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
              <label
                htmlFor="liquidity_pool_provided"
                className="block font-normal tracking-wide"
              >
                Liquidity Pool Provided
              </label>
              <div className=" flex flex-wrap gap-5">
                <div className=" flex items-center">
                  <input
                    id="red-radio2"
                    type="radio"
                    value="no"
                    {...stakingForm.register("liquidity_pool_provided")}
                    className="red-radio text-14px h-4 w-4"
                  />
                  <label
                    htmlFor="red-radio2"
                    className="text-sm font-medium text-white"
                  >
                    No
                  </label>
                </div>
                <div className=" flex items-center">
                  <input
                    id="green-radio2"
                    type="radio"
                    value="yes"
                    {...stakingForm.register("liquidity_pool_provided")}
                    className="green-radio text-14px h-4 w-4"
                  />
                  <label
                    htmlFor="green-radio2"
                    className="text-sm font-medium text-white"
                  >
                    Yes
                  </label>
                </div>
              </div>
              {stakingForm.formState.errors.liquidity_pool_provided && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {stakingForm.formState.errors.liquidity_pool_provided.message}
                </p>
              )}
            </div>
          </div>

          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label
              htmlFor="is_cancelable"
              className="block font-normal tracking-wide"
            >
              Is Cancelable
            </label>
            <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
              <label
                htmlFor="is_cancelable"
                className="block font-normal tracking-wide"
              >
                Is Cancelable
              </label>
              <div className=" flex flex-wrap gap-5">
                <div className=" flex items-center">
                  <input
                    id="red-radio3"
                    type="radio"
                    value="no"
                    {...stakingForm.register("is_cancelable")}
                    className="red-radio text-14px h-4 w-4"
                  />
                  <label
                    htmlFor="red-radio3"
                    className="text-sm font-medium text-white"
                  >
                    No
                  </label>
                </div>
                <div className=" flex items-center">
                  <input
                    id="green-radio3"
                    type="radio"
                    value="yes"
                    {...stakingForm.register("is_cancelable")}
                    className="green-radio text-14px h-4 w-4"
                  />
                  <label
                    htmlFor="green-radio3"
                    className="text-sm font-medium text-white"
                  >
                    Yes
                  </label>
                </div>
              </div>
              {stakingForm.formState.errors.is_cancelable && (
                <p className={`text-12px pb-2 font-medium text-red-500`}>
                  {stakingForm.formState.errors.is_cancelable.message}
                </p>
              )}
            </div>
          </div>

          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label
              htmlFor="charge_fee_on_cancel"
              className="block font-normal tracking-wide"
            >
              Charge Fee on Cancel
            </label>
            <input
              type="text"
              {...stakingForm.register("charge_fee_on_cancel")}
              id="charge_fee_on_cancel"
              placeholder="0%"
              className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
            />
            {stakingForm.formState.errors.charge_fee_on_cancel && (
              <p className={`text-12px pb-2 font-medium text-red-500`}>
                {stakingForm.formState.errors.charge_fee_on_cancel.message}
              </p>
            )}
          </div>

          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label
              htmlFor="min_staking_amount"
              className="block font-normal tracking-wide"
            >
              Minimum Stakable Amount
            </label>
            <input
              type="text"
              {...stakingForm.register("min_staking_amount")}
              id="min_staking_amount"
              placeholder="Example: 100000000000"
              className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
            />
            {stakingForm.formState.errors.min_staking_amount && (
              <p className={`text-12px pb-2 font-medium text-red-500`}>
                {stakingForm.formState.errors.min_staking_amount.message}
              </p>
            )}
          </div>

          <div className="text-14px col-span-2 mb-6 w-full font-medium text-white md:col-span-1 md:mb-0">
            <label
              htmlFor="max_staking_amount"
              className="block font-normal tracking-wide"
            >
              Maximum Stakable Amount
            </label>
            <input
              type="text"
              {...stakingForm.register("max_staking_amount")}
              id="max_staking_amount"
              placeholder="Only numbers here"
              className="focus:ring-brand-primar text-14pxy mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none"
            />
            {stakingForm.formState.errors.max_staking_amount && (
              <p className={`text-12px pb-2 font-medium text-red-500`}>
                {stakingForm.formState.errors.max_staking_amount.message}
              </p>
            )}
          </div>

          <div className="text-14px col-span-2 w-full font-medium text-white">
            <label htmlFor="test" className="block font-normal">
              Project Metadata
            </label>
            <div className="mt-2 flex w-full  items-center justify-between rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
              <span className="text-14px text-gray-shade-17">
                Add metadata here{" "}
              </span>
              {metaDataList.length < 8 && (
                <button
                  onClick={() => {
                    setMetaDataModal(true);
                  }}
                >
                  <BsPlusCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {metaDataList?.length > 0 && (
            <div className="col-span-2 flex w-full rounded-lg bg-black-shade-3 px-6 py-5">
              <div
                className={
                  "grid w-full gap-[2%] rounded-[14px]  md:grid-cols-4"
                }
              >
                {metaDataList.map((item: metaDataType, index: number) => {
                  return (
                    <div
                      key={index}
                      className="gradientborders2 relative mb-[2%] flex h-[98px] w-full flex-col items-center justify-center gap-3 rounded-10px bg-background-shade-3 p-[2px] "
                    >
                      <button
                        className="absolute top-[-4px] right-[-4px] flex h-5 w-5 items-center justify-center rounded-full border border-gray-shade-3 bg-elevation-1 text-center"
                        onClick={() => {
                          handleMetaDataRemove(item.title);
                        }}
                      >
                        <IoIosClose className="text-xl text-white" />
                      </button>
                      <h5 className="text-12px textGradient font-medium">
                        {item.title}
                      </h5>
                      <h6 className="text-14px font-semibold text-white">
                        {item.data}
                      </h6>
                    </div>
                  );
                })}{" "}
              </div>
            </div>
          )}
          <p className="text-14px col-span-2 text-gray-shade-14">
            <span className="text-white">Note:</span> All fields are mandatory
          </p>
        </div>

        <FinalButton
          title="Next"
          onClick={stakingForm.handleSubmit(handleDetails)}
          variant="primary"
          className=" text-14px mx-auto mt-5 w-[45%]"
          disabled={!stakingForm.formState.isValid}
        />
      </div>

      {metaDataModal && (
        <CustomModal
          onClose={() => {
            setMetaDataModal(false);
          }}
          title={"Add new metadata"}
        >
          <div className="mt-8 flex w-full flex-col gap-2 p-[2px] text-center">
            <div className="flex w-full flex-col gap-2">
              <label className="text-14px text-start font-normal text-white">
                Type
              </label>
              <input
                type="text"
                name="title"
                id="title"
                autoComplete="off"
                placeholder="Project"
                className="text-14px w-full rounded-lg  border-0 !bg-black-shade-2  py-3 px-5 font-semibold text-white ring-2 ring-black-shade-7 focus:outline-none focus:!ring-brand-primary active:!ring-brand-primary"
                onChange={handleMetaDataChange}
                value={metaDataDetails.title}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="text-14px text-start font-normal text-white">
                Name
              </label>
              <input
                type="text"
                name="data"
                id="data"
                autoComplete="off"
                placeholder="Premium"
                className="text-14px w-full rounded-lg  border-0 !bg-black-shade-2  py-3 px-5 font-semibold text-white ring-2 ring-black-shade-7 focus:outline-none focus:!ring-brand-primary active:!ring-brand-primary"
                onChange={handleMetaDataChange}
                value={metaDataDetails.data}
              />
            </div>
            {metaDataErr && (
              <p className={`text-12px pb-2 font-medium text-red-500`}>
                {metaDataErr}
              </p>
            )}
            <FinalButton
              title={"Save"}
              variant="primary"
              onClick={addNewMetaDataFunc}
              className="mt-2 hover:!scale-95"
            />
          </div>
        </CustomModal>
      )}
    </div>
  );
};
