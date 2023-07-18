import { GetServerSideProps, NextPage } from "next";
import { AppRoutes } from "@/constants/app.routes";

const Home: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Redirect to Feed Page
  return {
    redirect: {
      destination: AppRoutes.feed.index,
      permanent: false,
    },
  };
};
export default Home;
