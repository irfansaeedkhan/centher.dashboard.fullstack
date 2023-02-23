// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { formatAddress, formatIPFSUrl } from "@/utils/format.address";
import Link from "next/link";
import useGetUser from "@/hooks/use.get.user";
import { Collection } from "@/models/nft";
import { AppRoutes } from "@/constants/app.routes";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";

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
    <div className="py-1 px-2">
      <Link
        href={{
          pathname: AppRoutes.marketplace.collection,
          query: {
            collection: data.collection,
          },
        }}
        className={`flex h-[360px] w-auto flex-col gap-12 rounded-lg border border-gray-shade-3 [@media(max-width:650px)]:w-full `}
      >
        <div className={`relative flex justify-center`}>
          {coverImage && (
            <Image
              src={coverImage}
              alt="collection Image"
              width={340}
              height={180}
              className={`h-[180px]  w-full rounded-t-lg object-cover`}
              // className={`rounded-t-lg w-[340px] [@media(max-width:390px)]:w-[290px] h-[180px] object-cover`}
            />
          )}
          {profileImage && (
            <Image
              src={profileImage}
              alt="Logo Image"
              width={64}
              height={64}
              className={`absolute -bottom-[1.8rem] z-0 !h-16 rounded-full object-cover`}
            />
          )}
        </div>
        <div className={`flex flex-col items-center px-4`}>
          <div className={`text-base font-bold text-white`}>{data.name}</div>
          <span
            className={` mt-1  text-sm font-semibold text-white   ${
              user?.display_name.includes(" ")
                ? "text-ellipsis line-clamp-1"
                : "whitespace-no-wrap block w-full max-w-full overflow-hidden truncate"
            }`}
            title={user?.display_name}
          >
            {user && sliceDisplayName(user.display_name)}
          </span>
          <p
            className={`mt-2 whitespace-pre-wrap text-center text-xs font-medium text-gray-shade-14 line-clamp-3`}
          >
            {description}
          </p>
        </div>
      </Link>
    </div>
  );
};
