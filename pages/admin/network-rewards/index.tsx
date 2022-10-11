// React, Next, NPM Packages
import React from "react";

// App imports
import { NextPageWithLayout } from "@/pages/_app";
import AdminHeader from "@/components/header/admin.header";
import { AdminSidebar } from "@/components/sidebar/admin.sidebar";

// Current page imports
import StakingPack from "@/pages.components/admin.staking.fee.details/staking-pack";

const NetworkRewards: NextPageWithLayout = () => {
  return <StakingPack />;
};

NetworkRewards.getLayout = (page) => {
  return (
    <>
      <AdminHeader
        title="Network Rewards"
        url="/admin/create-network-rewards"
      />
      <div className="flex">
        <AdminSidebar />
        {page}
      </div>
    </>
  );
};

export default NetworkRewards;
