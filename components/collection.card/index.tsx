// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { formatAddress, formatIPFSUrl } from "@/utils/format.address";
import Link from "next/link";
import useGetUser from "@/hooks/use.get.user";
import { Collection } from "@/models/nft";
import { AppRoutes } from "@/constants/app.routes";

export interface CollectionCardProps {
  data: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ data }) => {
  const { user } = useGetUser(data?.creator);
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
      href={{
        pathname: AppRoutes.marketplace.collection,
        query: {
          collection: data.collection,
        },
      }}
      className={`w-auto border border-gray-shade-3 h-[360px] rounded-lg flex flex-col gap-12 [@media(max-width:650px)]:w-full `}
    >
      <div className={`relative flex justify-center`}>
        {coverImage && (
          <Image
            src={coverImage}
            alt="collection Image"
            width={340}
            height={180}
            className={`rounded-t-lg  h-[180px] object-cover w-full`}
            // className={`rounded-t-lg w-[340px] [@media(max-width:390px)]:w-[290px] h-[180px] object-cover`}
          />
        )}
        {profileImage && (
          <Image
            src={profileImage}
            alt="Logo Image"
            width={64}
            height={64}
            className={`rounded-full absolute object-cover !h-16 -bottom-[1.8rem] z-0`}
          />
        )}
      </div>
      <div className={`flex flex-col px-4 items-center`}>
        <div className={`text-base text-white font-bold`}>{data.name}</div>
        <span
          className={`text-sm text-white font-semibold text-ellipsis line-clamp-1 mt-1`}
        >
          {user?.display_name}
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
