// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";
import { useEffect } from "react";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { useExploreStore } from "@/store/explore.store";
import { CollectionCard } from "@/components/collection.card";

const AllNFTCollection: NextPageWithLayout = () => {
  const MAX_COLLECTIONS = 10;
  const { collections, fetchCollections } = useExploreStore((state) => ({
    collections: state.collections,
    fetchCollections: state.fetchCollections,
  }));

  useEffect(() => {
    fetchCollections(0, MAX_COLLECTIONS);
  }, [fetchCollections]);
  return (
    <div className={collectionPageMain}>
      <h1 className={title}>Collections</h1>
      <div className={collectionCardStyle}>
        {collections.map((collection) => {
          return <CollectionCard data={collection} key={collection.id} />;
        })}
        {collections.map((collection) => {
          return <CollectionCard data={collection} key={collection.id} />;
        })}
        {collections.map((collection) => {
          return <CollectionCard data={collection} key={collection.id} />;
        })}
        {collections.map((collection) => {
          return <CollectionCard data={collection} key={collection.id} />;
        })}
        {collections.map((collection) => {
          return <CollectionCard data={collection} key={collection.id} />;
        })}
      </div>
    </div>
  );
};

AllNFTCollection.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Create NFT">
      <div className={dashboardContentContainer}>
        <div className={feedContainer}>{page}</div>
      </div>
    </AllPagesWrapper>
  );
};

export default AllNFTCollection;

// styling
const dashboardContentContainer = ctl(`
 bg-black-shade-3 w-full h-full font-monto
`);
const collectionPageMain = ctl(`
pb-16 flex flex-col gap-8  w-full mx-auto [@media(min-width:1800px)]:max-w-[1480px] [@media(max-width:1799px)]:max-w-[1101px] [@media(max-width:1417px)]:max-w-[722px] [@media(max-width:745px)]:max-w-[340px]
`);
const title = ctl(`
textGradient  font-semibold leading-[42px] animationTextHeading lg:text-[34px] sm:text-2xl
`);
const feedContainer = ctl(`
flex flex-col lg:flex-row  gap-5 lg:items-start 
`);
const collectionCardStyle = ctl(`flex gap-10 flex-wrap w-full mx-auto`);
