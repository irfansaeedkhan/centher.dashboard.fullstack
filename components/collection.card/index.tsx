// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Collection } from "@/store/explore.store";
import { formatAddress, formatIPFSUrl } from "@/utils/format.address";
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
        const metadata = await axios.get(formatIPFSUrl(ipfs));
        setCoverImage(formatIPFSUrl(metadata.data.coverIPFSHash));
        setProfileImage(formatIPFSUrl(metadata.data.profileIPFSHash));
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
      className={`w-[340px] border border-gray-shade-3 h-[360px] rounded-lg flex flex-col gap-12 [@media(max-width:390px)]:w-[290px]`}
    >
      <div className={`relative flex justify-center`}>
        <Image
          src={coverImage}
          alt="collection Image"
          width={340}
          height={180}
          className={`rounded-t-lg w-[340px] [@media(max-width:390px)]:w-[290px] h-[180px] object-cover`}
        />
        <Image
          src={profileImage}
          alt="Logo Image"
          width={64}
          height={64}
          className={`rounded-full absolute object-cover !h-16 z-50 -bottom-[1.8rem]`}
        />
      </div>
      <div className={`flex flex-col px-4 items-center`}>
        <div className={`text-base text-white font-bold`}>{data.name}</div>
        <span className={`text-sm text-white font-semibold mt-1`}>
          {formatAddress(data.creator)}
        </span>
        <p
          className={`font-medium text-xs text-gray-shade-14 text-center mt-2 line-clamp-3 whitespace-pre-wrap`}
        >
          {description}
        </p>
      </div>
    </Link>
  );
};
