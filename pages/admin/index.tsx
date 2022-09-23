// React, Next, NPM Packages
import { NextPage } from "next";

//Current directory imports
import { AdminSidebar } from "@/components/sidebar/admin.sidebar";
import AdminHeader from "@/components/header/admin.header";
import StakingPack from "./staking-pack";

const Admin: NextPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <StakingPack />
      </div>
    </div>
  );
};

export default Admin;
