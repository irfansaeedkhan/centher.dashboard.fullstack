// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { useExploreStore } from "@/store/explore.store";

// Current directory imports
import { Explore } from "./_components";
import { useEffect } from "react";

const MAX_HOT_NFTS = 10;

const AllNftsPage: NextPageWithLayout = () => {
  const { allNFTs, fetchAllNFTs, loadingAllNFTs } = useExploreStore(
    (state) => ({
      allNFTs: state.allNFTs,
      fetchAllNFTs: state.fetchAllNFTs,
      loadingAllNFTs: state.loadingAllNFTs,
    })
  );

  useEffect(() => {
    fetchAllNFTs(0, MAX_HOT_NFTS);
  }, [fetchAllNFTs]);

  return (
    <div className="flex flex-col gap-10">
      <div className="AppWrapper flex flex-col gap-10">
        <Explore loadingAllNFTs={loadingAllNFTs} allNFTs={allNFTs} />
      </div>
    </div>
  );
};

AllNftsPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="NFT">{page}</AllPagesWrapper>;
};

export default AllNftsPage;
