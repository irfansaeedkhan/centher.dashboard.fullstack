import React, { useState } from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import CustomDropdown from "@/pages/marketplace/_components/custom.dropdown";
import { multilevel } from "../_components/staking-types";

const CreateStaking: NextPageWithLayout = () => {
  const [selectedOptionMultilevel, setSelectedOptionMultilevel] = useState("");
  const [multilevelError, setMultilevelError] = useState(true);
  const handleSelectOption = (value: string) => {
    setSelectedOptionMultilevel(value);
    setMultilevelError(false);
  };
  return (
    <section className="flex min-h-[calc(100vh-120px)] w-full">
      <div className="flex flex-grow flex-col">
        <h1 className="textGradient pb-6 font-semibold leading-[42px] sm:text-2xl ">
          Submit Your Staking Project 2
        </h1>
        <div className="flex w-full flex-col gap-6 rounded-[20px] border-2 border-gray-shade-3 bg-black-shade-9 p-6">
          <div className="text-14px w-full font-medium text-white">
            <label htmlFor="test" className="block font-normal">
              Staking Project Name
            </label>
            <input
              type="text"
              name="test"
              id="test"
              placeholder="For example: DeXa Pack 1"
              className="mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
            />
          </div>

          <div className="mb-2 grid w-full gap-6 md:grid-cols-2">
            <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Toke Address
              </label>
              <input
                type="text"
                name="test"
                id="test"
                placeholder="Add address here"
                className="mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
            </div>

            <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
              <label htmlFor="test" className="block font-normal tracking-wide">
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
                className="text-14px mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 accent-black-shade-7 focus:outline-none focus:ring-brand-primary"
              >
                <option className="bg-black text-gray-shade-17">
                  Select Any
                </option>
                <option className="bg-black text-white" value="">
                  Multilevel 1
                </option>
                <option className="bg-black text-white" value="">
                  Multilevel 2
                </option>
              </select>
            </div>

            <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
              <label htmlFor="test" className="block font-normal tracking-wide">
                APY
              </label>
              <input
                type="text"
                name="test"
                id="test"
                placeholder="Only numbers here"
                className="mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
            </div>

            <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
              <label htmlFor="test" className="block font-normal tracking-wide">
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
              <label htmlFor="test" className="block font-normal tracking-wide">
                Claim Period
              </label>
              <input
                type="text"
                name="test"
                id="test"
                placeholder="For example: DeXa Pack 1"
                className="mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
            </div>

            <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Liquidity Pool Provided
              </label>
              <input
                type="text"
                name="test"
                id="test"
                placeholder="For example: DeXa Pack 1"
                className="mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
            </div>

            <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Rewards Release Start
              </label>
              <input
                type="text"
                name="test"
                id="test"
                placeholder="For example: DeXa Pack 1"
                className="mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
            </div>

            <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Show on Centher
              </label>
              <input
                type="text"
                name="test"
                id="test"
                placeholder="For example: DeXa Pack 1"
                className="mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
            </div>

            <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Charge Fee on Cancel
              </label>
              <input
                type="text"
                name="test"
                id="test"
                placeholder="0%"
                className="mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
            </div>

            <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Is Cancelable
              </label>
              <input
                type="text"
                name="test"
                id="test"
                placeholder="For example: DeXa Pack 1"
                className="mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
            </div>

            <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Maximum Stakable Amount
              </label>
              <input
                type="text"
                name="test"
                id="test"
                placeholder="Only numbers here"
                className="mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
            </div>

            <div className="text-14px mb-6 w-full font-medium text-white md:mb-0">
              <label htmlFor="test" className="block font-normal tracking-wide">
                Minimum Stakable Amount
              </label>
              <input
                type="text"
                name="test"
                id="test"
                placeholder="Example: 100000000000"
                className="mt-2 block w-full appearance-none rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
              />
            </div>
          </div>

          <div className="text-14px w-full font-medium text-white">
            <label htmlFor="test" className="block font-normal">
              Project Metadata
            </label>
            <input
              type="text"
              name="test"
              id="test"
              placeholder="Add metadata here"
              className="mt-2 block w-full rounded-lg border-0 bg-black-shade-3 py-3 px-5 placeholder:text-gray-shade-17 focus:outline-none focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

CreateStaking.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Staking">
    <div className="mx-auto w-full max-w-[1144px] bg-black-shade-3 font-monto">
      {page}
    </div>
  </AllPagesWrapper>
);

export default CreateStaking;
