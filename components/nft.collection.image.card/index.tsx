import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CFSCollection } from "@/models/nft";
import { AppRoutes } from "@/constants/app.routes";

export interface NFTCardProps {
  data: CFSCollection;
}

export const NFTCollectionImageCard: React.FC<NFTCardProps> = ({ data }) => {
  const [imageUrl, setImageUrl] = useState(data.ipfs_metadata.coverIPFSHash);

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
          src={imageUrl}
          alt={data.name}
          height={275}
          width={275}
          className="absolute inset-0 h-full w-full rounded-xl object-cover"
          onError={() => setImageUrl("/images/placeholder-square.svg")}
        />
      </Link>
    </div>
  );
};
