import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import React from "react";
import NetworkTabs from "../_components/network.tabs";

const Liscense: NextPageWithLayout = () => {
  return <div>Liscense</div>;
};

Liscense.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Liscense">
      <div className="mx-auto w-full max-w-[1136px]">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default Liscense;
