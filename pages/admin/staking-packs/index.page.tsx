// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AdminSidebar } from "@/components/sidebar/admin.sidebar";
import AdminHeader from "@/components/header/admin.header";

// Current directory imports
import { StakingPacks } from "./_components";

const StakingPacksPage: NextPageWithLayout = () => {
  return <StakingPacks />;
};

StakingPacksPage.getLayout = (page) => {
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

export default StakingPacksPage;
