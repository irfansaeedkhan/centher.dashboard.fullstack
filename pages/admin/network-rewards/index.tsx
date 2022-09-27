import AdminHeader from "@/components/header/admin.header";
import { AdminSidebar } from "@/components/sidebar/admin.sidebar";
import React from "react";
import StakingPack from "@/pages.components/admin.staking.fee.details/staking-pack";

const NetworkRewards = () => {
  return (
    <div>
      <AdminHeader
        title="Network Rewards"
        url="/admin/create-network-rewards"
      />
      <div className="flex">
        <AdminSidebar />
        <StakingPack />
      </div>
    </div>
  );
};

export default NetworkRewards;
