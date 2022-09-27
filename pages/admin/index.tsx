// React, Next, NPM Packages
import { NextPage } from "next";

//Current directory imports
import { AdminSidebar } from "@/components/sidebar/admin.sidebar";
import AdminHeader from "@/components/header/admin.header";
import StakingPack from "@/pages.components/admin.staking.fee.details/staking-pack";

const Admin: NextPage = () => {
  return (
    <div>
      <AdminHeader title="Staking Pack" url="/admin/create-staking-pack" />
      <div className="flex">
        <AdminSidebar />
        <StakingPack />
      </div>
    </div>
  );
};

export default Admin;
