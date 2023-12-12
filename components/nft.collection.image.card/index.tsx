import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CFSCollection } from "@/models/nft";
import { AppRoutes } from "@/constants/app.routes";

export interface NFTCardProps {
  data: CFSCollection;
}

export const NFTCollectionImageCard: React.FC<NFTCardProps> = ({ data }) => {
  const DEFAULT_IMAGE_SRC = "/images/placeholder-square.svg";
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMAGE_SRC);

  useEffect(() => {
    if (data.ipfs_metadata.profileIPFSHash) {
      setImageSrc(data.ipfs_metadata.profileIPFSHash);
    } else {
      setImageSrc(DEFAULT_IMAGE_SRC);
    }
  }, [data.ipfs_metadata.profileIPFSHash]);

  return (
    <div
      className={`relative h-0 overflow-hidden rounded-xl bg-transparent pb-[100%]`}
    >
      <Link
        href={{
          pathname: AppRoutes.marketplace.collection,
          query: {
            collection: data.collection,
          },
        }}
        className={`flex h-full w-full justify-center`}
      >
        <Image
          src={imageSrc}
          alt={data.name}
          height={275}
          width={275}
          className="absolute inset-0 h-full w-full rounded-xl object-cover"
          onError={() => setImageSrc(DEFAULT_IMAGE_SRC)}
        />
      </Link>
    </div>
  );
};
