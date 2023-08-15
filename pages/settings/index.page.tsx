import { GetServerSideProps } from "next";
import { AppRoutes } from "@/constants/app.routes";

const Setting = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Redirect to Profile Settings Page
  return {
    redirect: {
      destination: AppRoutes.settings.profile,
      permanent: false,
    },
  };
};

export default Setting;
