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
      <div className="w-full max-w-[1136px] mx-auto">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default Liscense;
