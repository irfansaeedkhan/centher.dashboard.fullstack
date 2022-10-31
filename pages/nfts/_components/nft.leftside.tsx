// React, Next, NPM Packages
import React from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";

// Same directory imports
import { NFTDetails } from "./nft.details";
import { NFTProperties } from "./nft.properties";
import { IProperty } from "./create.nft.form";
interface NFTLeftSideComponentProps {
  image: string | undefined;
  nftId: number | undefined;
  mintTx: string | undefined;
  collection: string | undefined;
  attributes: IProperty[] | undefined;
}
export const NFTLeftSideComponent = (props: NFTLeftSideComponentProps) => {
  return (
    <div className={leftSideContainer}>
      <div className={ImgContainer}>
        <div>
          <Image
            className={ImgStyling}
            src={props.image ? props.image : ""}
            alt="image"
            height={270}
            width={270}
          />
        </div>
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
// styling
const leftSideContainer = ctl(`
w-full max-w-[508px] flex flex-col gap-6
`);
const ImgContainer = ctl(`
 bg-black-shade-9 rounded-2xl relative border border-gray-shade-3 w-full pb-[100%] 
`);
const ImgStyling = ctl(`
w-full h-full absolute rounded-2xl object-contain
`);
