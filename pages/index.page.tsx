// React, Next, NPM Packages
import { GetServerSideProps, NextPage } from "next";

const Home: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Redirect to /explore
  return {
    redirect: {
      destination: "/explore",
      permanent: false,
    },
  };
};
export default Home;
