// React, Next, NPM Packages
import React from "react";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { CollectionCard } from "@/components/collection.card";
import { AppRoutes } from "@/constants/app.routes";

export const HotCollections: React.FC = () => {
  return (
    <div className={hotCollectionWrapper}>
      <div className={hotCollectionGap}>
        <div className={collectionHeaderAnimation}>Collections</div>
        <Link href={AppRoutes.home} className={viewAllLink}>
          View all
        </Link>
      </div>
      <div className={collectionCardStyle}>
        <CollectionCard
          collectionName={Data.Name}
          collectionDescription={Data.Description}
          ownerName={Data.ownerName}
          coverImage={Data.collectionCoverImage}
          logoImage={Data.collectionLogoImage}
        />
      </div>
    </div>
  );
};

const Data = {
  Name: "karyanya bang Rakajana wooy",
  Description:
    "0,000 Moonbird pellets, regurgitated from the imagination of artist Gremplin aand revealed in July 2022 each of them",
  ownerName: "Dannathos ART -",
  collectionCoverImage: "/images/collection.png",
  collectionLogoImage: "/images/nft.png",
};

const hotCollectionWrapper = ctl(`flex flex-col gap-8`);

const hotCollectionGap = ctl(`flex items-center justify-between gap-10`);

const collectionHeaderAnimation = ctl(`animationTextHeading`);

const viewAllLink = ctl(
  `block py-3 text-white bg-gray-shade-3 w-[172px] min-w-fit px-4 rounded-xl text-center border border-gray-shade-12`
);

const collectionCardStyle = ctl(`flex gap-10 flex-wrap"`);
