import { useEffect, useState } from "react";
import { CFSNFT } from "@/models/nft";

export const useNFTImageSrc = (data: {
  ipfs_metadata: CFSNFT["ipfs_metadata"];
}) => {
  const DEFAULT_NFT_IMAGE_SRC = "/images/placeholder-square.svg";
  const [nftImageSrc, setNftImageSrc] = useState(DEFAULT_NFT_IMAGE_SRC);

  useEffect(() => {
    if (data.ipfs_metadata.type.includes("video")) {
      if (data.ipfs_metadata.videoThumbnail) {
        setNftImageSrc(data.ipfs_metadata.videoThumbnail);
      } else {
        setNftImageSrc(DEFAULT_NFT_IMAGE_SRC);
      }
    } else if (data.ipfs_metadata.type.includes("audio")) {
      setNftImageSrc("/images/default-music.png");
    } else if (data.ipfs_metadata.type.includes("image")) {
      setNftImageSrc(data.ipfs_metadata.image);
    } else {
      setNftImageSrc(DEFAULT_NFT_IMAGE_SRC);
    }
  }, [data]);

  return { nftImageSrc, setNftImageSrc, DEFAULT_NFT_IMAGE_SRC };
};
