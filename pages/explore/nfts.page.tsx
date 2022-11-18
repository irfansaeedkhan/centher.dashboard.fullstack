
import { useEffect } from "react";
// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { useAllNFTsStore } from "@/store/all.nfts.store";
import { Explore } from "./_components";

const MAX_HOT_NFTS = 10;

const AllNftsPage: NextPageWithLayout = () => {
  const { allNFTs, fetchAllNFTs, loading } = useAllNFTsStore(
    (state) => ({
      allNFTs: state.allNFTs,
      fetchAllNFTs: state.fetchAllNFTs,
      loading: state.loading,
    })
  );

  useEffect(() => {
    fetchAllNFTs(0, MAX_HOT_NFTS);
  }, [fetchAllNFTs]);

  return (
    <div className="flex flex-col gap-10">
      <div className="AppWrapper flex flex-col gap-10">
        <Explore loading={loading} allNFTs={allNFTs} />
      </div>
    </div>
  );
};

AllNftsPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="NFT">{page}</AllPagesWrapper>;
};

export default AllNftsPage;
