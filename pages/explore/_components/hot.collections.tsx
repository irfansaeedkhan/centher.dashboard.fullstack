// React, Next, NPM Packages
import React, { useEffect } from "react";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { CollectionCard } from "@/components/collection.card";
import { AppRoutes } from "@/constants/app.routes";
import { Collection } from "@/store/explore.store";

interface HotCollectionsProps {
  hotCollections: Collection[];
}
export const HotCollections: React.FC<HotCollectionsProps> = ({
  hotCollections,
}) => {
  return (
    <div className={hotCollectionWrapper}>
      <div className={hotCollectionGap}>
        <div className={collectionHeaderAnimation}>Collections</div>
        <Link href={AppRoutes.home} className={viewAllLink}>
          View all
        </Link>
      </div>
      <div className={collectionCardStyle}>
        {hotCollections.map((collection) => {
          return <CollectionCard data={collection} key={collection.id} />;
        })}
      </div>
    </div>
  );
};

const hotCollectionWrapper = ctl(`flex flex-col gap-8`);

const hotCollectionGap = ctl(`flex items-center justify-between gap-10`);

const collectionHeaderAnimation = ctl(`animationTextHeading`);

const viewAllLink = ctl(
  `block py-3 text-white bg-gray-shade-3 w-[172px] min-w-fit px-4 rounded-xl text-center border border-gray-shade-12`
);

const collectionCardStyle = ctl(`flex gap-10 flex-wrap"`);
