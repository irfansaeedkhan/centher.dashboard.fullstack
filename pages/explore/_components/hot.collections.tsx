// React, Next, NPM Packages
import React, { useEffect } from "react";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// App imports
import { CollectionCard } from "@/components/collection.card";
import { AppRoutes } from "@/constants/app.routes";
import { useExploreStore } from "@/store/explore.store";
import { NftsCollectionEmpty } from "@/assets/svgs";

import NftCollectionSkeleton from "@/components/loading.skeletons/nft.collection.skeleton";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1440, min: 464 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 659, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const MAX_COLLECTIONS = 10;
export const HotCollections: React.FC = () => {
  const { hotCollections, fetchCollections, loadingCollections } =
    useExploreStore((state) => ({
      hotCollections: state.collections,
      fetchCollections: state.fetchCollections,
      loadingCollections: state.loadingCollections,
    }));

  useEffect(() => {
    fetchCollections(0, MAX_COLLECTIONS);
  }, [fetchCollections]);

  return (
    <div className={hotCollectionWrapper}>
      <div className={hotCollectionGap}>
        <div className={collectionHeaderAnimation}>Collections</div>
        <Link href={AppRoutes.all_collections} className={viewAllLink}>
          View all
        </Link>
      </div>
      <div className={collectionCardStyle}>
        {hotCollections?.length > 0 && (
          <div className={mediaContainer}>
            <Carousel
              swipeable={true}
              draggable={false}
              showDots={false}
              responsive={responsive}
              ssr={true} // means to render carousel on server-side.
              infinite={true}
              keyBoardControl={true}
              containerClass="carousel-container"
              // dotListClass="custom-dot-list-style"
              // itemClass="customItemClass"
              arrows={true}
            >
              {hotCollections.map((collection) => {
                return <CollectionCard data={collection} key={collection.id} />;
              })}
            </Carousel>
            ;
          </div>
        )}

        {(loadingCollections === "loading" ||
          loadingCollections === "idle") && (
          <div className="flex flex-wrap gap-5 items-center">
            <NftCollectionSkeleton />
            <NftCollectionSkeleton />
          </div>
        )}

        {loadingCollections === "loaded" && hotCollections.length === 0 && (
          <div>
            <div className="flex justify-center items-center">
              <NftsCollectionEmpty />
            </div>
            <div className={noCollectionContainer}>
              <h1 className={noCollectionTxt}>No collections yet</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const hotCollectionWrapper = ctl(`flex flex-col gap-8`);

const hotCollectionGap = ctl(
  `flex [@media(max-width:767px)]:flex-col [@media(max-width:767px)]:gap-5 items-center justify-between gap-10`
);

const collectionHeaderAnimation = ctl(`animationTextHeading`);

const viewAllLink = ctl(
  `block py-3 text-white bg-gray-shade-3 w-[172px] min-w-fit px-4 rounded-xl text-center border border-gray-shade-12`
);

const collectionCardStyle = ctl(`flex gap-10 flex-wrap`);

const mediaContainer = ctl(`
 w-full grid, gap-3,
`);
const noCollectionContainer = ctl(`
 bg-[#1b1c22] w-full h-20 rounded-10px flex items-center justify-center
`);
const noCollectionTxt = ctl(`
text-lg text-white font-semibold
`);
