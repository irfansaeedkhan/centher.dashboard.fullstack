// React, Next, NPM Packages
import React, { useState } from "react";

// App imports
import Button from "@/components/button";
import { useWeb3React } from "@web3-react/core";
import { useGetMyCollections } from "@/hooks/use.get.my.collections";

// same directory Imports
import FixedPriceForm from "./fixed.price.form";
import AuctionForm from "./auction.form";

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
  const [tab, setTab] = useState("Fixed");
  const { account } = useWeb3React();
  const collections = useGetMyCollections(account);

  return (
    <div
      className={`relative flex w-full flex-col gap-6 rounded-2xl border border-gray-shade-3 bg-black-shade-9 py-8 px-6`}
    >
      <div className={`flex w-full max-w-[290px] gap-4`}>
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
      </div>
      {tab === "Fixed" && (
        <FixedPriceForm
          createNFT={createNFT}
          collections={collections}
          clearForm={clearForm}
          asset={asset}
        />
      )}
      {tab === "Auction" && (
        <AuctionForm
          createNFT={createNFT}
          collections={collections}
          clearForm={clearForm}
          asset={asset}
        />
      )}
    </div>
  );
};
// styling

const Tab = `w-full py-3 cursor-pointer hover:bg-brand-primary hover:text-black-shade-3`;
const activeTab = `text-black-shade-3 [&>*>*]:stroke-black-shade-3`;
