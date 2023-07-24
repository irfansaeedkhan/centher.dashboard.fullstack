import { GetServerSideProps } from "next";

const NFTCollection = () => {
  return null;
};

export default NFTCollection;

// Redirect this page to created NFTs page
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: `/profile/${context.query.user_id}/nfts/created`,
      permanent: false,
    },
  };
};
