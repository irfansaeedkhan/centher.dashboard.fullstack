// React, Next, NPM Packages
import React from "react";
import Link from "next/link";

// App imports
import { CollectionCard } from "@/components/collection.card";

// Current directory imports

export const HotCollections: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-10">
        <div className="animationTextHeading">Collections</div>
        <Link href="/">
          <a className="block py-3 text-white bg-gray-shade-3 w-[172px] min-w-fit px-4 rounded-xl text-center border border-gray-shade-12">
            View all
          </a>
        </Link>
      </div>
      <div className="flex gap-10 flex-wrap">
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
