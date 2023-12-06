import React, { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";
import { useNFTImageSrc } from "@/hooks/use-nft-image-src";
import { NFTDetails } from "./nft.details";
import { NFTProperties } from "./nft.properties";
import AudioPlayer from "./audio.player";

interface Props {
  nft: CFSNFTForPage;
}

export const NFTLeftSideComponent: React.FC<Props> = ({ nft }) => {
  const { nftImageSrc, setNftImageSrc, DEFAULT_NFT_IMAGE_SRC } =
    useNFTImageSrc(nft);
  const [nftVideoSrc, setNftVideoSrc] = useState<string>("");

  useEffect(() => {
    if (nft.ipfs_metadata.type?.includes("video")) {
      setNftVideoSrc(nft.ipfs_metadata.image);
    }
  }, [nft]);

  return (
    <div className={`flex w-full max-w-[508px] flex-col gap-6`}>
      <div
        className={clsx(
          `relative w-full rounded-2xl border border-gray-shade-3 bg-black-shade-9`,
          !nft.ipfs_metadata.type?.includes("audio") && `pb-[100%]`
        )}
      >
        {nft.ipfs_metadata.type && (
          <div>
            {nft.ipfs_metadata.type.includes("audio") ? (
              <AudioPlayer src={nft.ipfs_metadata.image} />
            ) : nft.ipfs_metadata.type.includes("video") ? (
              <video
                className={`absolute h-full w-full rounded-2xl object-contain`}
                src={nftVideoSrc}
                height={270}
                width={270}
                onError={() => setNftVideoSrc(DEFAULT_NFT_IMAGE_SRC)}
                controls
              />
            ) : (
              <Image
                className={`absolute h-full w-full rounded-2xl object-cover`}
                src={nftImageSrc}
                alt={nft.ipfs_metadata.name}
                height={270}
                width={270}
                onError={() => setNftImageSrc(DEFAULT_NFT_IMAGE_SRC)}
              />
            )}
          </div>
        )}
      </div>
      <NFTDetails nft={nft} />
      <NFTProperties attributes={nft.ipfs_metadata.attributes ?? []} />
    </div>
  );
};
