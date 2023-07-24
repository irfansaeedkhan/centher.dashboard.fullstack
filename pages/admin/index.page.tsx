import { GetServerSideProps } from "next";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AppRoutes } from "@/constants/app.routes";

const Admin: NextPageWithLayout = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Redirect to staking pack page
  return {
    redirect: {
      destination: AppRoutes.admin.staking_packs,
      permanent: false,
    },
  };
};

export default Admin;
