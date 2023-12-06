import { useEffect, useState } from "react";
import { CFSNFT } from "@/models/nft";

export const useNFTImageSrc = (nft: CFSNFT) => {
  const DEFAULT_NFT_IMAGE_SRC = "/images/placeholder-square.svg";
  const [nftImageSrc, setNftImageSrc] = useState(
    nft.ipfs_metadata.image ?? DEFAULT_NFT_IMAGE_SRC
  );

  useEffect(() => {
    if (nft.ipfs_metadata.type.includes("video")) {
      if (nft.ipfs_metadata.videoThumbnail) {
        setNftImageSrc(nft.ipfs_metadata.videoThumbnail);
      } else {
        setNftImageSrc(DEFAULT_NFT_IMAGE_SRC);
      }
    } else if (nft.ipfs_metadata.type.includes("audio")) {
      setNftImageSrc("/images/default-music.png");
    } else if (nft.ipfs_metadata.type.includes("image")) {
      setNftImageSrc(nft.ipfs_metadata.image);
    } else {
      setNftImageSrc(DEFAULT_NFT_IMAGE_SRC);
    }
  }, [nft]);

  return { nftImageSrc, setNftImageSrc, DEFAULT_NFT_IMAGE_SRC };
};
