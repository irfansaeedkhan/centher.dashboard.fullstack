// React, Next, NPM Packages
import React, { useState } from "react";

// App imports
import FinalButton from "@/components/button/final.button";
import { useWeb3React } from "@web3-react/core";
import { useGetMyCollections } from "@/hooks/use.get.my.collections";

// same directory Imports
import FixedPriceForm from "./fixed.price.form";
import AuctionForm from "./auction.form";

export interface CreateNFTFormProps {
  createNFT: any;
  clearForm: boolean;
  asset: Blob | undefined;
  library: any;
  videoThumbnailPreview: boolean;
  assetTab: string;
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
  library,
  videoThumbnailPreview,
  assetTab,
}: CreateNFTFormProps) => {
  const [tab, setTab] = useState("Fixed");
  const { account } = useWeb3React();
  const collections = useGetMyCollections(account);

  return (
    <div
      className={`relative flex w-full flex-col gap-6 rounded-2xl border border-gray-shade-3 bg-black-shade-9 px-6 py-8`}
    >
      <div className={`flex w-full max-w-[290px] gap-4`}>
        <FinalButton
          title={"Fixed Price"}
          variant={tab === "Fixed" ? "primary" : "secondary"}
          onClick={() => {
            setTab("Fixed");
          }}
          className={`${Tab} ${tab === "Fixed" && activeTab}`}
        />
        <FinalButton
          title={"Auction"}
          variant={tab === "Auction" ? "primary" : "secondary"}
          onClick={() => {
            setTab("Auction");
          }}
          className={`${Tab} ${tab === "Auction" && activeTab}`}
        />
      </div>
      {tab === "Fixed" && (
        <FixedPriceForm
          assetTab={assetTab}
          library={library}
          createNFT={createNFT}
          collections={collections}
          clearForm={clearForm}
          asset={asset}
          videoThumbnailPreview={videoThumbnailPreview}
        />
      )}
      {tab === "Auction" && (
        <AuctionForm
          assetTab={assetTab}
          videoThumbnailPreview={videoThumbnailPreview}
          library={library}
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

const Tab = `w-full cursor-pointer hover:bg-brand-primary rounded-[14px]`;
const activeTab = `text-black-shade-3 [&>*>*]:stroke-black-shade-3`;
