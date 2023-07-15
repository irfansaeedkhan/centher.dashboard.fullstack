import React, { useState, ChangeEvent } from "react";
import {
  BsFillPlusSquareFill,
  BsPlusCircle,
  BsPlusSquare,
  BsPlusSquareFill,
} from "react-icons/bs";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import CustomDropdown from "@/pages/marketplace/_components/custom.dropdown";
import { multilevel } from "../_components/staking-types";
import { CustomModal } from "@/components/modal/custom.modal";
import { IoIosClose } from "react-icons/io";
import FinalButton from "@/components/button/final.button";
import clsx from "clsx";

const CreateStaking: NextPageWithLayout = () => {
  const [metaDataDetails, setMetaDataDetails] = useState<any>([]);
  const [metaDataModal, setMetaDataModal] = useState(false);
  const [innitialForm, setInnitialForm] = useState(false);
  const [metaDataErr, setMetaDataErr] = useState<null | string>(null);
  const [metaDataList, setMetaDataList] = useState<any>([]);

  // function to add/remove dynamic metaData
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
      metaDataDetails?.Type === null ||
      metaDataDetails?.Type?.match(/^ *$/) !== null
    ) {
      setMetaDataErr("Type/Name value missing");
      return;
    } else if (
      metaDataDetails?.MetaDataName === null ||
      metaDataDetails?.MetaDataName?.match(/^ *$/) !== null
    ) {
      setMetaDataErr("Type/Name value missing");
      return;
    }
    setMetaDataErr("");
    setMetaDataList((current: any) => [...current, metaDataDetails]);
    setMetaDataModal(false);
    setMetaDataDetails([]);
  };
  const handleMetaDataRemove = (prop: any) => {
    setMetaDataList(
      metaDataList.filter((item: any) => item?.MetaDataName != prop)
    );
  };

  // const [selectedOptionMultilevel, setSelectedOptionMultilevel] = useState("");
  // const [multilevelError, setMultilevelError] = useState(true);
  // const handleSelectOption = (value: string) => {
  //   setSelectedOptionMultilevel(value);
  //   setMultilevelError(false);
  // };

  const [selectedValue, setSelectedValue] = useState<string>("");
  const [inputValues, setInputValues] = useState<string[]>([]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const newSelectedValue: string = event.target.value;
    setSelectedValue(newSelectedValue);

    const numLevels: number = parseInt(newSelectedValue.split("-")[1]);
    setInputValues((prevInputValues: string[]) =>
      prevInputValues.slice(0, numLevels)
    );
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const newInputValues: string[] = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  const renderInputFields = (): JSX.Element[] => {
    const numLevels: number = parseInt(selectedValue.split("-")[1]);

    return Array.from({ length: numLevels }, (_, index) => (
      <div
        key={index}
        className={clsx(
          `text-14px mb-6 w-full font-medium text-white md:mb-0 ${
            index === numLevels - 1 && index % 2 === 0 && "col-span-2"
          }`
        )}
      >
        <label htmlFor="test" className="block font-normal tracking-wide">
          Level {index + 1}
        </label>
        <input
          type="text"
          name="test"
          id="test"
          placeholder="Add address here"
          className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
          value={inputValues[index] || ""}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(event, index)
          }
        />
      </div>
    ));
  };

  // members
  const [jobTitle, setJobTitle] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const handleJobTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setJobTitle(event.target.value);
  };

  const handleWalletAddressChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setWalletAddress(event.target.value);
  };

  const handleAddMember = (): void => {
    if (jobTitle && walletAddress) {
      const newMember = `${jobTitle} - ${walletAddress}`;
      setMembers((prevMembers) => [...prevMembers, newMember]);
      setJobTitle("");
      setWalletAddress("");
    }
  };

  const handleRemoveMember = (index: number): void => {
    setMembers((prevMembers) => prevMembers.filter((_, i) => i !== index));
  };

  return (
    <section className="flex min-h-[calc(100vh-120px)] w-full">
      <div className="flex flex-grow flex-col">
        <h1 className="textGradient pb-6 font-semibold leading-[42px] sm:text-2xl ">
          Submit Your Staking Project 2
        </h1>
        <div className="flex w-full flex-col gap-6 rounded-[20px] border-2 border-gray-shade-3 bg-black-shade-9 p-6">
          {innitialForm ? (
            <div className="mb-2 grid w-full  gap-6 md:grid-cols-2">
              <div className="text-14px col-span-2 w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Staking Project Name
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="For example: DeXa Pack 1"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  Toke Address
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Add address here"
                  className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  Multilevel Rewards System
                </label>
                {/* <CustomDropdown
                options={multilevel.slice(1, multilevel.length).map((item) => ({
                  value: item === "Select Any" ? "" : item,
                  label: item,
                }))}
                selectedValue={selectedOptionMultilevel}
                onSelect={handleSelectOption}
              /> */}
                <select
                  name="test"
                  id="test"
                  className="text-14px text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
                  value={selectedValue}
                  onChange={handleChange}
                >
                  <option className="bg-black text-gray-shade-17">
                    Select Any
                  </option>
                  <option className="bg-black text-white" value="level-1">
                    Recurring Return (0 to 1 levels)
                  </option>
                  <option className="bg-black text-white" value="level-2">
                    Recurring Return (0 to 2 levels)
                  </option>
                  <option className="bg-black text-white" value="level-3">
                    Recurring Return (0 to 3 levels)
                  </option>
                  <option className="bg-black text-white" value="level-4">
                    Recurring Return (0 to 4 levels)
                  </option>
                  <option className="bg-black text-white" value="level-5">
                    Recurring Return (0 to 5 levels)
                  </option>
                  <option className="bg-black text-white" value="level-6">
                    Recurring Return (0 to 6 levels)
                  </option>
                </select>
              </div>
              {selectedValue && renderInputFields()}
              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  APY
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Only numbers here"
                  className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  Staking Period
                </label>
                <select
                  name="test"
                  id="test"
                  className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
                >
                  <option className="bg-black text-gray-shade-17">
                    Select Any
                  </option>
                  <option className="bg-black text-white" value="">
                    Staking Period 1
                  </option>
                  <option className="bg-black text-white" value="">
                    Staking Period 2
                  </option>
                </select>
              </div>

              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  Claim Period
                </label>
                <select
                  name="test"
                  id="test"
                  className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
                >
                  <option className="bg-black text-gray-shade-17">
                    Select Any
                  </option>
                  <option className="bg-black text-white" value="">
                    Claim Period 1
                  </option>
                  <option className="bg-black text-white" value="">
                    Claim Period 2
                  </option>
                </select>
              </div>

              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  Liquidity Pool Provided
                </label>
                <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
                  <label
                    htmlFor="test"
                    className="block font-normal tracking-wide"
                  >
                    Liquidity Pool Provided
                  </label>
                  <div className=" flex flex-wrap gap-5">
                    <div className=" flex items-center">
                      <input
                        id="red-radio"
                        type="radio"
                        value=""
                        name="test"
                        className="red-radio text-14px h-4 w-4"
                      />
                      <label
                        htmlFor="red-radio"
                        className="text-sm font-medium text-white"
                      >
                        No
                      </label>
                    </div>
                    <div className=" flex items-center">
                      <input
                        id="green-radio"
                        type="radio"
                        value=""
                        name="test"
                        className="green-radio text-14px h-4 w-4"
                      />
                      <label
                        htmlFor="green-radio"
                        className="text-sm font-medium text-white"
                      >
                        Yes
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  Rewards Release Start
                </label>
                <select
                  name="test"
                  id="test"
                  className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
                >
                  <option className="bg-black text-gray-shade-17">
                    Select Any
                  </option>
                  <option className="bg-black text-white" value="">
                    Rewards Release Start 1
                  </option>
                  <option className="bg-black text-white" value="">
                    Rewards Release Start 2
                  </option>
                </select>
              </div>

              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  Show on Centher
                </label>
                <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
                  <label
                    htmlFor="test"
                    className="block font-normal tracking-wide"
                  >
                    Show on Centher
                  </label>
                  <div className=" flex flex-wrap gap-5">
                    <div className=" flex items-center">
                      <input
                        id="red-radio"
                        type="radio"
                        value=""
                        name="test"
                        className="red-radio text-14px h-4 w-4"
                      />
                      <label
                        htmlFor="red-radio"
                        className="text-sm font-medium text-white"
                      >
                        No
                      </label>
                    </div>
                    <div className=" flex items-center">
                      <input
                        id="green-radio"
                        type="radio"
                        value=""
                        name="test"
                        className="green-radio text-14px h-4 w-4"
                      />
                      <label
                        htmlFor="green-radio"
                        className="text-sm font-medium text-white"
                      >
                        Yes
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  Charge Fee on Cancel
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="0%"
                  className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  Is Cancelable
                </label>
                <div className="mt-2 flex w-full appearance-none items-center justify-between rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary">
                  <label
                    htmlFor="test"
                    className="block font-normal tracking-wide"
                  >
                    Is Cancelable
                  </label>
                  <div className=" flex flex-wrap gap-5">
                    <div className=" flex items-center">
                      <input
                        id="red-radio"
                        type="radio"
                        value=""
                        name="test"
                        className="red-radio text-14px h-4 w-4"
                      />
                      <label
                        htmlFor="red-radio"
                        className="text-sm font-medium text-white"
                      >
                        No
                      </label>
                    </div>
                    <div className=" flex items-center">
                      <input
                        id="green-radio"
                        type="radio"
                        value=""
                        name="test"
                        className="green-radio text-14px h-4 w-4"
                      />
                      <label
                        htmlFor="green-radio"
                        className="text-sm font-medium text-white"
                      >
                        Yes
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  Maximum Stakable Amount
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Only numbers here"
                  className="focus:ring-brand-primar text-14pxy mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none"
                />
              </div>

              <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
                <label
                  htmlFor="test"
                  className="block font-normal tracking-wide"
                >
                  Minimum Stakable Amount
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Example: 100000000000"
                  className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
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
                    {metaDataList.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="gradientborders2 relative mb-[2%] flex h-[98px] w-full flex-col items-center justify-center gap-3 rounded-10px bg-background-shade-3 p-[2px] "
                        >
                          <button
                            className="absolute top-[-4px] right-[-4px] flex h-5 w-5 items-center justify-center rounded-full border border-gray-shade-3 bg-elevation-1 text-center"
                            onClick={() => {
                              handleMetaDataRemove(item.MetaDataName);
                            }}
                          >
                            <IoIosClose className="text-xl text-white" />
                          </button>
                          <h5 className="text-12px textGradient font-medium">
                            {item.MetaDataName}
                          </h5>
                          <h6 className="text-14px font-semibold text-white">
                            {item.Type}
                          </h6>
                        </div>
                      );
                    })}{" "}
                  </div>
                </div>
              )}
              <p className="text-14px col-span-2 text-gray-shade-14">
                <span className="text-white">Note:</span> All fields are
                mandatory
              </p>
            </div>
          ) : (
            <div className="mb-2 grid w-full gap-6 md:grid-cols-2">
              <div className="text-14px w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Website URL
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Example: yourweb.com/"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px  w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Facebook
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Example: yourlogo.com/"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px  w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Twitter
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Example: t.com/"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px  w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Github
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Example: github.com/"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px  w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Telegram
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Example: yourtel.com/"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px  w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Instagram
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Example: instagram.com/"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px  w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Discord
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Example: yourweb.com/"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px  w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Reddit
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Example: reddit.com/"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px  w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Explorers
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Example: BscScan"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px  w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Category
                </label>
                <input
                  type="text"
                  name="test"
                  id="test"
                  placeholder="Example: Decentralised Finance"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="text-14px col-span-2 w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Description*
                </label>
                <textarea
                  name="test"
                  id="test"
                  rows={4}
                  placeholder="Example: This is the best project"
                  className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                />
              </div>

              <div className="dynamicmember text-14px col-span-2 w-full font-medium text-white">
                <label
                  htmlFor="test"
                  className="block font-normal  tracking-wide"
                >
                  Team Members
                </label>
                <div className="mt-4 w-full rounded-lg border-2 border-gray-shade-3 p-6">
                  <div className="mb-2 grid gap-6 md:grid-cols-2">
                    {/* Job title input */}
                    <div className="text-14px w-full font-medium text-white">
                      <label
                        htmlFor="jobTitle"
                        className="block font-normal tracking-wide"
                      >
                        Job title
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        id="jobTitle"
                        placeholder="Example: CEO, CTO, COO etc"
                        className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                        value={jobTitle}
                        onChange={handleJobTitleChange}
                      />
                    </div>

                    {/* Wallet public address input */}
                    <div className="text-14px w-full font-medium text-white">
                      <label
                        htmlFor="walletAddress"
                        className="block font-normal tracking-wide"
                      >
                        Wallet public address
                      </label>
                      <input
                        type="text"
                        name="walletAddress"
                        id="walletAddress"
                        placeholder="Example: 0x018rhf63hjj7763kuxx098nbvxx90cc23BBK99KXX028"
                        className="text-14px mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
                        value={walletAddress}
                        onChange={handleWalletAddressChange}
                      />
                    </div>
                  </div>

                  {/* Button aligned to the right */}
                  <div className="mt-4 flex justify-end">
                    <FinalButton
                      title="Add Members"
                      onClick={handleAddMember}
                      variant="primary"
                      className="text-14px max-w-fit"
                      disabled={!jobTitle || !walletAddress}
                    />
                  </div>
                </div>

                {/* Display added members */}
                <div className="mt-4">
                  {members.map((member, index) => (
                    <div key={index} className="flex items-center text-white">
                      <span>{member}</span>
                      <button
                        className="ml-2 text-red-500"
                        onClick={() => handleRemoveMember(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <FinalButton
            title={true ? "Next" : "Submit Now"}
            onClick={
              true
                ? () => {
                    setInnitialForm(false);
                  }
                : () => {}
            }
            variant="primary"
            className=" text-14px mx-auto mt-5  w-[45%]"
            disabled={false}
          />
        </div>
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
                name="Type"
                id="Type"
                autoComplete="off"
                placeholder="Project"
                className="text-14px w-full rounded-lg  border-0 !bg-black-shade-2  py-3 px-5 font-semibold text-white ring-2 ring-black-shade-7 focus:outline-none focus:!ring-brand-primary active:!ring-brand-primary"
                onChange={handleMetaDataChange}
                value={metaDataDetails.Type}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="text-14px text-start font-normal text-white">
                Name
              </label>
              <input
                type="text"
                name="MetaDataName"
                id="MetaDataName"
                autoComplete="off"
                placeholder="Premium"
                className="text-14px w-full rounded-lg  border-0 !bg-black-shade-2  py-3 px-5 font-semibold text-white ring-2 ring-black-shade-7 focus:outline-none focus:!ring-brand-primary active:!ring-brand-primary"
                onChange={handleMetaDataChange}
                value={metaDataDetails.MetaDataName}
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
              className="mt-2"
            />
          </div>
        </CustomModal>
      )}
    </section>
  );
};

CreateStaking.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Staking">
    <div className="mx-auto w-full max-w-[1144px] bg-black-shade-3 font-monto ">
      {page}
    </div>
  </AllPagesWrapper>
);

export default CreateStaking;
