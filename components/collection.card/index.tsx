// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";
import axios from "axios";
import { Collection } from "@/store/explore.store";
import { formatAddress } from "@/utils/format.address";
import Link from "next/link";

export interface CollectionCardProps {
  data: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ data }) => {
  const [coverImage, setCoverImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchMetadata = async (ipfs: string) => {
      try {
        const metadata = await axios.get(ipfs);
        setCoverImage(metadata.data.coverIPFSHash);
        setProfileImage(metadata.data.profileIPFSHash);
        setDescription(metadata.data.description);
      } catch (error) {}
    };
    if (data && data.ipfs) {
      fetchMetadata(data.ipfs);
    }
  }, [data]);
  return (
    <Link
      href={`/collections/${data.collection}`}
      className={collectionWrapper}
    >
      <div className={imagesWrapper}>
        <Image
          src={coverImage}
          alt="collection Image"
          width={340}
          height={180}
          className={imageStyle}
        />
        <Image
          src={profileImage}
          alt="Logo Image"
          width={64}
          height={64}
          className={logoImage}
        />
      </div>
      <div className={contentWrapper}>
        <div className={collectionName}>{data.name}</div>
        <span className={collectionOwner}>{formatAddress(data.creator)}</span>
        <p className={collectionDescription}>{description}</p>
      </div>
    </Link>
  );
};

const collectionWrapper = ctl(
  `w-[340px] border border-gray-shade-3 h-[360px] rounded-lg flex flex-col gap-12`
);

const imagesWrapper = ctl(`relative flex justify-center`);

const logoImage = ctl(
  `rounded-full absolute object-cover !h-16 z-50 -bottom-[1.8rem]`
);

const contentWrapper = ctl(`flex flex-col px-4 items-center`);

const collectionName = ctl(`text-base text-white font-bold`);

const collectionOwner = ctl(`text-sm text-white font-semibold mt-1`);

const collectionDescription = ctl(
  `font-medium text-xs text-gray-shade-14 text-center mt-2 line-clamp-3 whitespace-pre-wrap`
);

const imageStyle = ctl(`rounded-t-lg w-[340px] h-[180px] object-cover`);
