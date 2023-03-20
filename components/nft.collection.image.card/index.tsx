// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import ctl from "@netlify/classnames-template-literals";

import { Collection } from "@/models/nft";
import { formatIPFSUrl } from "@/utils/format.address";
import { AppRoutes } from "@/constants/app.routes";
export interface NFTCardProps {
  data: Collection;
}

export const NFTCollectionImageCard: React.FC<NFTCardProps> = ({ data }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchMetadata = async (ipfs: string) => {
      try {
        const formattedUrl = formatIPFSUrl(ipfs);
        const { data: metadata } = await axios.get(formattedUrl);
        const imgUrl = formatIPFSUrl(metadata.coverIPFSHash);
        setImageUrl(imgUrl);
      } catch (error) {
        console.dir(error);
      }
    };
    if (data && data.ipfs) {
      fetchMetadata(data.ipfs);
    }
  }, [data]);

  return (
    <div className={nftCardWrapper}>
      <Link
        href={{
          pathname: AppRoutes.marketplace.collection,
          query: {
            collection: data.collection,
          },
        }}
        className={nftImageWrapper}
      >
        {imageUrl ? (
          <Image
            src={
              imageUrl.includes("mp3") ? "/images/default-music.png" : imageUrl
            }
            alt="nft"
            height={275}
            width={275}
            className="absolute inset-0 h-full w-full rounded-xl object-cover"
            onError={() => setImageUrl("/images/placeholder-square.svg")}
          />
        ) : (
          <div className="absolute inset-0 h-full w-full animate-pulse rounded-xl bg-[#3C3F4A] object-cover"></div>
        )}
      </Link>
    </div>
  );
};

const nftCardWrapper = ctl(
  `bg-transparent relative rounded-xl overflow-hidden h-0 pb-[100%]`
);

const nftImageWrapper = ctl(`w-full h-full flex justify-center `);
