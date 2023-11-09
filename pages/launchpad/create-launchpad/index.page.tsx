import React from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import RoundCard from "./_components/round-card";
import { roundCardData } from "./_components/round-card-data";

const CreateLaunchpad: NextPageWithLayout = () => {
  return (
    <div>
      <div className="flex w-full items-center gap-5">
        {roundCardData.map((item) => (
          <RoundCard
            key={item.round}
            round={item.round}
            description={item.description}
            title={item.title}
          />
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
        <div className="flex flex-col gap-6">
          <div className="col-span-1 mb-6 w-full text-sm font-medium text-white md:mb-0">
            <label
              htmlFor="token_address"
              className="block font-normal tracking-wide"
            >
              Token Address
              <span className="text-gradient ml-[2px]">*</span>
            </label>
            <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
              <input
                type="text"
                id="token_address"
                placeholder="Example: Centher Token"
                className="block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
              />
            </div>
            <p className="text-gradient w-fit pb-2 pt-1 text-xs font-medium">
              Pool creation fee: 100 BNB
            </p>
          </div>
          <div className="col-span-1 mb-6 w-full text-sm font-medium text-white md:mb-0">
            <label
              htmlFor="sale_rounds"
              className="block font-normal tracking-wide"
            >
              Select amount of sale rounds
              <span className="text-gradient ml-[2px]">*</span>
            </label>
            <div className="gradient-border-3 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full p-[1px]">
              <span className="background-gradient-color h-[10px] w-[10px] flex-shrink-0 rounded-full"></span>
            </div>
          </div>
          <p className="text-sm text-gray-shade-14">
            <span className="text-white">Note: </span>
            Disclaimer: The information provided shall not in any way constitute
            a recommendation as to whether you should invest in any product
            discussed. We accept no liability for any loss occasioned to any
            person acting or refraining from action as a result of any material
            provided or published.
          </p>
          <div className="col-span-1 mb-6 w-full text-sm font-medium text-white md:mb-0">
            <label
              htmlFor="liquidity_lockup"
              className="block font-normal tracking-wide"
            >
              Liquidity lockup (days)
              <span className="text-gradient ml-[2px]">*</span>
            </label>
            <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
              <input
                type="text"
                id="liquidity_lockup"
                placeholder="Example: 0"
                className="block w-full appearance-none rounded-lg border-0 bg-gray-shade-24 px-5 py-3 text-sm placeholder:font-semibold placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CreateLaunchpad.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Create Launchpad">
    <div className="mx-auto min-h-screen w-full max-w-[1112px] bg-black-shade-3 pb-10 font-monto">
      {page}
    </div>
  </AllPagesWrapper>
);

export default CreateLaunchpad;
