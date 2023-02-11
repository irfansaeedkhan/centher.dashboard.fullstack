import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { useProfileNFTStore } from "@/store/profile.nft.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CollectionCard } from "@/components/collection.card";
import NftProfileCollectionSkeleton from "@/components/loading.skeletons/nft.profile.collection";
import { NftsCollectionEmpty } from "@/assets/svgs";

import { ProfilePageWrapper } from "./_components";

const NFTProfileCollections: NextPageWithLayout = () => {
  const router = useRouter();
  const account = useMemo(() => {
    return router.query.account_address as string;
  }, [router.query.account_address]);

  const { collections, fetchCollections, loading } = useProfileNFTStore(
    (state) => ({
      collections: state.collections,
      fetchCollections: state.fetchCollections,
      loading: state.loadingCollections,
    })
  );

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1680 },
      items: 2,
      slidesToSlide: 2,
      // paritialVisibilityGutter: 20,
    },
    tablet: {
      breakpoint: { max: 1680, min: 615 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 615, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };
  useEffect(() => {
    if (account) {
      fetchCollections(account);
    }
  }, [account, fetchCollections]);

  return (
    <>
      {collections && collections.length > 0 && (
        <div className="w-full">
          <Carousel
            swipeable={true}
            draggable={false}
            showDots={false}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={false}
            keyBoardControl={true}
            containerClass="carousel-containerProfile"
            // dotListClass="custom-dot-list-style"
            // itemClass="customItemClass"
            arrows={true}
          >
            {collections.map((collection) => {
              return <CollectionCard data={collection} key={collection.id} />;
            })}
          </Carousel>
          ;
        </div>
      )}

      {(loading === "loading" || loading === "idle") && (
        <div className="flex flex-wrap items-center justify-center gap-10 fsm:justify-start">
          <NftProfileCollectionSkeleton />
          <NftProfileCollectionSkeleton />
        </div>
      )}

      {loading === "loaded" && collections?.length === 0 && (
        <>
          <div className="flex items-center justify-center text-white">
            <NftsCollectionEmpty />
          </div>
          <div className="flex items-center justify-center text-[16px] font-semibold text-white">
            No collection found yet
          </div>
        </>
      )}
    </>
  );
};

NFTProfileCollections.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper currentTab="nft-profile">
      <div>{page}</div>
    </ProfilePageWrapper>
  </AllPagesWrapper>
);

export default NFTProfileCollections;
