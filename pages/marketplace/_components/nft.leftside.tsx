// React, Next, NPM Packages
import React from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";

// Same directory imports
import { NFTDetails } from "./nft.details";
import { NFTProperties } from "./nft.properties";
import { IProperty } from "./create.nft.form";
import AudioPlayer from "./audio.player";
import clsx from "clsx";
interface NFTLeftSideComponentProps {
  image: string | undefined;
  type: string | undefined;
  nftId: number | undefined;
  mintTx: string | undefined;
  collection: string | undefined;
  attributes: IProperty[] | undefined;
}

export const NFTLeftSideComponent = (props: NFTLeftSideComponentProps) => {
  return (
    <div className={`flex w-full max-w-[508px] flex-col gap-6`}>
      <div
        className={clsx(
          `relative w-full rounded-2xl border border-gray-shade-3 bg-black-shade-9`,
          props.image?.includes("mp3") ? `` : `pb-[100%]`
        )}
      >
        {props.image && (
          <div>
            {props.image?.includes("mp3") ? (
              <AudioPlayer src={props.image} />
            ) : (
              <Image
                className={`absolute h-full w-full rounded-2xl object-contain`}
                src={props.image ? props.image : ""}
                alt="image"
                height={270}
                width={270}
              />
            )}
          </div>
        )}
      </div>
      <NFTDetails
        nftId={props.nftId}
        mintTx={props.mintTx}
        collection={props.collection}
      />
      <NFTProperties attributes={props.attributes} />
    </div>
  );
};
