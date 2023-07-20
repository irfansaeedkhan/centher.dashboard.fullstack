import React, { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { NFTDetails } from "./nft.details";
import { NFTProperties } from "./nft.properties";
import { IProperty } from "./create.nft.form";
import AudioPlayer from "./audio.player";
interface NFTLeftSideComponentProps {
  image: string | undefined;
  type: string | undefined;
  nftId: number | undefined;
  mintTx: string | undefined;
  collection: string | undefined;
  attributes: IProperty[] | undefined;
  collectionMintedTokens: number;
}

export const NFTLeftSideComponent = (props: NFTLeftSideComponentProps) => {
  const [imageUrl, setImageUrl] = useState(props.image);

  useEffect(() => {
    setImageUrl(props.image);
  }, [props.image]);

  return (
    <div className={`flex w-full max-w-[508px] flex-col gap-6`}>
      <div
        className={clsx(
          `relative w-full rounded-2xl border border-gray-shade-3 bg-black-shade-9`,
          props.type?.includes("audio") ? `` : `pb-[100%]`
        )}
      >
        {props.type && imageUrl && (
          <div>
            {props.type.includes("audio") ? (
              <AudioPlayer src={props.image} />
            ) : props.type.includes("video") ? (
              <video controls={true} className={videoStyling}>
                <source src={props.image} type="video/mp4" />
              </video>
            ) : (
              <Image
                className={`absolute h-full w-full rounded-2xl object-cover`}
                src={imageUrl}
                alt="image"
                height={270}
                width={270}
                onError={() => setImageUrl("/images/placeholder-square.svg")}
              />
            )}
          </div>
        )}
      </div>
      <NFTDetails
        nftId={props.nftId}
        mintTx={props.mintTx}
        collection={props.collection}
        collectionMintedTokens={props.collectionMintedTokens}
      />
      <NFTProperties attributes={props.attributes} />
    </div>
  );
};
const videoStyling = `
w-full h-full absolute rounded-2xl object-contain
`;
