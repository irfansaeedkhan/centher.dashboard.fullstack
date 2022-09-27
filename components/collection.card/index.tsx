// React, Next, NPM Packages
import React from "react";
import Image from "next/future/image";
import ctl from "@netlify/classnames-template-literals";

export interface CollectionCardProps {
  collectionName: string;
  ownerName: string;
  collectionDescription: string;
  coverImage: string;
  logoImage: string;
}

export const CollectionCard: React.FC<CollectionCardProps> = (props) => {
  return (
    <div className={collectionWrapper}>
      <div className={imagesWrapper}>
        <Image
          src={props.coverImage}
          alt="collection Image"
          width={390}
          height={244}
          className="rounded-t-lg"
        />
        <Image
          src={props.logoImage}
          alt="Logo Image"
          width={64}
          height={64}
          className={logoImage}
        />
      </div>
      <div className={contentWrapper}>
        <div className={collectionName}>{props.collectionName}</div>
        <div className={collectionOwner}>{props.ownerName}</div>
        <p className={collectionDescription}>{props.collectionDescription}</p>
      </div>
    </div>
  );
};

const collectionWrapper = ctl(
  `w-[340px] border border-gray-shade-3 h-auto rounded-lg flex flex-col gap-12`
);

const imagesWrapper = ctl(`relative flex justify-center`);

const logoImage = ctl(
  `rounded-full absolute object-cover !h-16 z-50 -bottom-[1.8rem]`
);

const contentWrapper = ctl(`flex flex-col gap-3 px-4 items-center`);

const collectionName = ctl(`text-base text-white font-bold`);

const collectionOwner = ctl(`text-sm text-white font-semibold`);

const collectionDescription = ctl(
  `font-medium text-xs text-gray-shade-14 text-center mb-8 line-clamp-3 whitespace-pre-wrap`
);
