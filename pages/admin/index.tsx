// App imports
import { NextPageWithLayout } from "@/pages/_app";
import { AdminSidebar } from "@/components/sidebar/admin.sidebar";
import AdminHeader from "@/components/header/admin.header";

// Current directory imports
import StakingPack from "@/pages.components/admin.staking.fee.details/staking-pack";

const Admin: NextPageWithLayout = () => {
  return <StakingPack />;
};

Admin.getLayout = (page) => {
  return (
    <>
      <AdminHeader title="Staking Pack" url="/admin/create-staking-pack" />
      <div className="flex">
        <AdminSidebar />
        {page}
      </div>
    </>
  );
};

export default Admin;
