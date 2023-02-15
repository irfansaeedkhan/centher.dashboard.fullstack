// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";
import { useAllCollectionsStore } from "@/store/all.collections.store";

// same directory Imports
import FixedPriceForm from "./fixed.price.form";
import AuctionForm from "./auction.form";
import { useGetMyCollections } from "@/hooks/use.get.my.collections";
import { useWeb3React } from "@web3-react/core";

export interface CreateNFTFormProps {
  createNFT: any;
  clearForm: boolean;
  asset: Blob | undefined;
}
export interface IProperty {
  Type: string;
  PropertyName: string;
}
export interface INFTData {
  name: string;
  description: string;
  category: string;
  supply: number;
  isAuction: boolean;
  price: number;
  period: number;
  collection: string;
  properties: IProperty[];
}
export const CreateNFTForm = ({
  createNFT,
  clearForm,
  asset,
}: CreateNFTFormProps) => {
  // const [tab, setTab] = useState("Fixed");
  const { account } = useWeb3React();
  const collections = useGetMyCollections(account);

  return (
    <div className={CreateNFTFormContainer}>
      {/* <div className={tabsBtnContainer}>
        <Button
          title={"Fixed Price"}
          variant={tab === "Fixed" ? "v1" : "v2"}
          onClick={() => {
            setTab("Fixed");
          }}
          className={`${Tab} ${tab === "Fixed" && activeTab}`}
        />
        <Button
          title={"Auction"}
          variant={tab === "Auction" ? "v1" : "v2"}
          onClick={() => {
            setTab("Auction");
          }}
          className={`${Tab} ${tab === "Auction" && activeTab}`}
        />
      </div> */}
      {/* {tab === "Fixed" && ( */}
      <FixedPriceForm
        createNFT={createNFT}
        collections={collections}
        clearForm={clearForm}
        asset={asset}
      />
      {/* )} */}
      {/* {tab === "Auction" && (
        <AuctionForm
          createNFT={createNFT}
          collections={collections}
          clearForm={clearForm}
          asset={asset}
        />
      )} */}
    </div>
  );
};
// styling
const CreateNFTFormContainer = ctl(`
 bg-black-shade-9 rounded-2xl relative w-full border   border-gray-shade-3 py-8 px-6 flex flex-col gap-6
`);
const tabsBtnContainer = ctl(`
w-full max-w-[290px] flex gap-4
`);
const Tab = ctl(`
w-full py-3 cursor-pointer hover:bg-brand-primary hover:text-black-shade-3
`);
const activeTab = ctl(`
 text-black-shade-3 [&>*>*]:stroke-black-shade-3
`);
