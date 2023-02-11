import React from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";

import NetworkTabs from "../_components/network.tabs";

const AdminMarketplace: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-18px font-semibold text-white ">Marketplace</h1>
    </div>
  );
};

AdminMarketplace.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Admin Metaverse">
      <div className="mx-auto w-full max-w-[1136px]">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default AdminMarketplace;
