// React, Next, NPM Packages
import React from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import ctl from "@netlify/classnames-template-literals";
import { useEffect, useState } from "react";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CollectionCard } from "@/components/collection.card";
import { useAllCollectionsStore } from "@/store/all.collections.store";
import CategoryDropdown from "../explore/_components/category.dropdown";

const AllNFTCollection: NextPageWithLayout = () => {
  const categoryDropdownOpenerRef = React.useRef<HTMLButtonElement>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const {
    collections,
    categoryInStore,
    offset,
    limit,
    updateCategory,
    fetchCollections,
    loading,
  } = useAllCollectionsStore((state) => ({
    collections: state.collections,
    offset: state.offset,
    limit: state.limit,
    categoryInStore: state.category,
    updateCategory: state.updateCategory,
    fetchCollections: state.fetchCollections,
    loading: state.loading,
  }));

  useEffect(() => {
    fetchCollections(offset, limit, categoryInStore);
  }, [fetchCollections, limit, offset, categoryInStore]);

  useEffect(() => {
    updateCategory(category);
  }, [updateCategory, category]);

  return (
    <div className={collectionPageMain}>
      <div className={nameButtonWrapper}>
        <h1 className={title}>Collections</h1>
        <div className={sectionNameStyle}>
          <div className="relative">
            <button
              ref={categoryDropdownOpenerRef}
              className={allButtonWrapper}
              onClick={() => setCategoryOpen((prev: any) => !prev)}
            >
              <span className="text-gray-shade-7 text-sm font-semibold">
                Category
              </span>{" "}
              {categoryOpen ? (
                <HiChevronUp className="text-2xl" />
              ) : (
                <HiChevronDown className="text-2xl" />
              )}
            </button>
            <CategoryDropdown
              isOpen={categoryOpen}
              onClose={() => setCategoryOpen(false)}
              onChange={(value) => setCategory(value)}
              openerRef={categoryDropdownOpenerRef}
            />
          </div>
        </div>
      </div>
      <div className={collectionCardStyle}>
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

const nameButtonWrapper = ctl(
  `flex md:flex-row sm:flex-col md:items-center justify-between md:gap-10 sm:gap-5`
);

const sectionNameStyle = ctl(`flex gap-2 items-center`);

const allButtonWrapper = ctl(
  `flex items-center gap-7 justify-center py-3 text-white bg-gray-shade-3 w-[186px] min-w-fit px-6 rounded-xl text-center border border-gray-shade-12`
);
