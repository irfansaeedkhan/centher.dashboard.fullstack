import React from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

const CreateStaking: NextPageWithLayout = () => {
  return (
    <section className="flex min-h-[calc(100vh-120px)] w-full">
      <div className="flex flex-grow flex-col">
        <h1 className="textGradient pb-6 font-semibold leading-[42px] sm:text-2xl ">
          Submit Your Staking Project 2
        </h1>
        <div className="w-full rounded-[20px] border-2 border-gray-shade-3 p-2">
          sdfds
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
