// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { GetServerSideProps } from "next";

// Current directory imports
import { AppRoutes } from "@/constants/app.routes";

const Admin: NextPageWithLayout = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Redirect to staking pack page
  return {
    redirect: {
      destination: AppRoutes.admin_staking_packs,
      permanent: false,
    },
  };
};

export default Admin;
