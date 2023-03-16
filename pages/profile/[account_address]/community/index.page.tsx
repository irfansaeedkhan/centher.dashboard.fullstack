import { GetServerSideProps } from "next";

const Community = () => {
  return null;
};

export default Community;

// Redirect this page to created NFTs page
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: `/profile/${context.query.account_address}/community/followers`,
      permanent: false,
    },
  };
};
