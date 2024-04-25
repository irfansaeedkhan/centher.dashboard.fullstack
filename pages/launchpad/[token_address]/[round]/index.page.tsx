import { GetServerSideProps, NextPage } from "next";

const Launchpad: NextPage = () => {
  return null;
};

export default Launchpad;

export const getServerSideProps: GetServerSideProps = async () => {
  // Redirect to Prebooking Page
  return {
    redirect: {
      destination: "/launchpad/launchpad-list/?list_type=all",
      permanent: false,
    },
  };
};
